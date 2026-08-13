'use client'

import { use, useEffect, useState } from 'react'
import Link from 'next/link'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { createClient } from '@/lib/supabase/client'

interface OrderConfirmedPageProps {
  params: Promise<{
    orderNumber: string
  }>
}

interface FullOrderDetails {
  id: string
  order_number: string
  customer_name: string
  customer_phone: string
  customer_email?: string | null
  shipping_address: {
    line1: string
    city: string
    state: string
    pincode: string
  }
  items: Array<{
    name: string
    size?: string
    qty: number
    price: number
  }>
  subtotal: number
  shipping_fee: number
  total: number
  payment_status: string
  order_status: string
  checkout_method: string
  courier_name?: string | null
  awb_number?: string | null
  tracking_url?: string | null
  shipment_status?: string | null
  created_at: string
}

const S = {
  sectionTitle: {
    fontFamily: 'Playfair Display, serif',
    fontSize: '22px',
    fontWeight: 500,
    color: '#010100',
    marginBottom: '20px',
  },
  label: {
    display: 'block',
    fontSize: '10px',
    fontWeight: 700,
    letterSpacing: '0.12em',
    textTransform: 'uppercase' as const,
    color: '#8a8880',
    fontFamily: 'Outfit, sans-serif',
    marginBottom: '6px',
  }
}

export default function OrderConfirmedPage({ params }: OrderConfirmedPageProps) {
  const resolvedParams = use(params)
  const orderNumber = resolvedParams.orderNumber
  const [order, setOrder] = useState<FullOrderDetails | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchOrder() {
      try {
        const supabase = createClient()
        const { data } = await (supabase.from('orders') as any)
          .select('*')
          .eq('order_number', orderNumber)
          .single()

        if (data) {
          setOrder(data)
        }
      } catch (err) {
        console.warn('Could not fetch order details from DB:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchOrder()
  }, [orderNumber])

  const isPaid = order ? order.payment_status === 'paid' : false

  const steps = [
    {
      num: '01',
      title: 'Order Received',
      desc: isPaid ? 'Payment verified via Razorpay' : 'Submitted via WhatsApp (COD / Bank Transfer)',
      completed: true,
    },
    {
      num: '02',
      title: 'Packing & Quality Check',
      desc: 'Freshly packed at our Kolhapur farm',
      completed: order ? ['confirmed', 'shipped', 'delivered'].includes(order.order_status) : false,
    },
    {
      num: '03',
      title: 'Dispatched with Courier',
      desc: order?.courier_name ? `Assigned to ${order.courier_name}` : 'Courier Partner Assigning...',
      completed: order ? ['shipped', 'delivered'].includes(order.order_status) : false,
    },
    {
      num: '04',
      title: 'Out for Delivery',
      desc: 'Delivered to your address',
      completed: order?.order_status === 'delivered',
    },
  ]

  return (
    <div style={{ background: '#f9f4f1', minHeight: '100vh', fontFamily: 'Outfit, sans-serif' }}>
      <Header />

      <main className="px-4 sm:px-12 py-12 sm:py-16 w-full max-w-3xl" style={{ boxSizing: 'border-box', margin: '0 auto' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          
          {/* Header check icon / verification badge */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '48px', height: '48px', border: '1px solid #1c1b1a', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                {isPaid ? (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1c1b1a" strokeWidth="2.5">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                ) : (
                  <span style={{ fontSize: '18px' }}>📦</span>
                )}
              </div>
              <span style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#474741', background: '#f5f0ef', padding: '8px 16px', border: '1px solid rgba(200,193,182,0.6)' }}>
                {isPaid ? 'Payment Verified ✓' : 'Order Placed (COD)'}
              </span>
            </div>

            <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: '38px', fontWeight: 500, color: '#010100', margin: '8px 0 0' }}>
              {isPaid ? 'Thank You For Your Order!' : 'Order Request Received!'}
            </h1>

            <p style={{ fontSize: '14px', color: '#8a8880', maxWidth: '520px', margin: 0, lineHeight: 1.6 }}>
              {isPaid
                ? 'Your payment was successfully verified. Your authentic Kolhapuri jaggery is being freshly prepared for dispatch.'
                : 'Your order request has been logged. Our team will verify your items and collect payment via COD or UPI upon delivery.'}
            </p>
          </div>

          {/* Reference Info Box */}
          <div style={{ border: '1px solid rgba(200,193,182,0.5)', background: '#fff', padding: '32px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid rgba(200,193,182,0.35)', paddingBottom: '20px', marginBottom: '24px' }}>
              <div>
                <span style={S.label}>Order Reference Number</span>
                <span style={{ fontFamily: 'monospace', fontSize: '24px', fontWeight: 700, color: '#010100', letterSpacing: '0.04em' }}>
                  {orderNumber}
                </span>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '12px', color: '#8a8880', display: 'block' }}>
                  Placed: {order ? new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : new Date().toLocaleDateString('en-IN')}
                </span>
                <span style={{ display: 'inline-block', marginTop: '6px', fontSize: '10px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: isPaid ? '#2E7D32' : '#b56a00', background: isPaid ? '#E8F5E9' : '#FFF8E1', padding: '4px 12px', border: '1px solid currentColor', borderOpacity: 0.2 } as any}>
                  {loading ? 'Loading...' : isPaid ? 'Paid Online ✓' : 'Pending (COD)'}
                </span>
              </div>
            </div>

            {/* Courier status block */}
            <div style={{ background: '#fdf8f7', border: '1px solid rgba(200,193,182,0.5)', padding: '20px', marginBottom: '28px' }}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <span style={S.label}>Courier Dispatch Partner</span>
                  <span style={{ fontSize: '13px', fontWeight: 600, color: '#010100' }}>
                    {order?.courier_name || 'Shiprocket (Assigning Courier...)'}
                  </span>
                </div>
                <div>
                  <span style={S.label}>AWB Tracking Number</span>
                  <span style={{ fontSize: '13px', fontWeight: 600, color: '#010100', fontFamily: 'monospace' }}>
                    {order?.awb_number || 'Assigning AWB...'}
                  </span>
                </div>
              </div>

              {order?.tracking_url && (
                <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid rgba(200,193,182,0.3)' }}>
                  <a
                    href={order.tracking_url}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      display: 'block', width: '100%', background: '#1c1b1a', color: '#fff',
                      fontSize: '11px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase',
                      padding: '12px', textDecoration: 'none', textAlign: 'center', boxSizing: 'border-box',
                    }}
                  >
                    Track Package Live on Courier Portal ↗
                  </a>
                </div>
              )}
            </div>

            {/* Timeline */}
            <div style={{ marginBottom: '32px' }}>
              <h2 style={{ ...S.sectionTitle, fontSize: '14px', textTransform: 'uppercase', letterSpacing: '0.12em', color: '#8a8880' }}>
                Fulfillment Timeline
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                {steps.map((st) => (
                  <div
                    key={st.num}
                    style={{
                      padding: '16px',
                      border: st.completed ? '1px solid #1c1b1a' : '1px solid rgba(200,193,182,0.6)',
                      background: st.completed ? '#1c1b1a' : '#fff',
                      color: st.completed ? '#fff' : '#474741',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '4px',
                      borderRadius: 0,
                    }}
                  >
                    <span style={{ fontSize: '9px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: st.completed ? '#c9a96e' : '#8a8880' }}>
                      Step {st.num}
                    </span>
                    <span style={{ fontSize: '12px', fontWeight: 600, leadingHeight: 1.3 } as any}>
                      {st.title}
                    </span>
                    <span style={{ fontSize: '11px', opacity: 0.8, leadingHeight: 1.4 } as any}>
                      {st.desc}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Itemized list / Address grid */}
            {order && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 pt-6 border-t border-[rgba(200,193,182,0.35)]">
                <div>
                  <h3 style={S.label}>Shipping Address</h3>
                  <p style={{ fontSize: '13px', color: '#474741', margin: 0, lineHeight: 1.5 }}>
                    <strong style={{ color: '#010100' }}>{order.customer_name}</strong><br />
                    {order.shipping_address?.line1}<br />
                    {order.shipping_address?.city}, {order.shipping_address?.state} — {order.shipping_address?.pincode}<br />
                    <span style={{ display: 'block', marginTop: '6px', fontFamily: 'monospace', color: '#8a8880' }}>📞 {order.customer_phone}</span>
                  </p>
                </div>
                <div>
                  <h3 style={S.label}>Items Purchased ({order.items?.length || 0})</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {(order.items || []).map((item, idx) => (
                      <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#474741', borderBottom: '1px solid rgba(200,193,182,0.25)', paddingBottom: '6px' }}>
                        <span>
                          <strong>{item.name}</strong> {item.size && `(${item.size})`} × {item.qty}
                        </span>
                        <span style={{ fontFamily: 'monospace', fontWeight: 600 }}>₹{((item.price || 0) * (item.qty || 1)).toLocaleString('en-IN')}</span>
                      </div>
                    ))}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', fontWeight: 700, fontSize: '14px', color: '#010100', paddingTop: '8px' }}>
                      <span>Total Amount</span>
                      <span style={{ fontFamily: 'Playfair Display, serif', fontSize: '18px', color: '#ba1a1a' }}>₹{Number(order.total || 0).toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Action buttons columns */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', textAlign: 'center' }}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Link
                href={`/track-order?order=${orderNumber}`}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                  background: '#1c1b1a', color: '#fff', fontSize: '11px', fontWeight: 700,
                  letterSpacing: '0.12em', textTransform: 'uppercase', padding: '16px',
                  textDecoration: 'none', borderRadius: 0,
                }}
              >
                📦 Open Order Tracking Portal
              </Link>
              <Link
                href="/shop"
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                  border: '1.5px solid #1c1b1a', background: 'transparent', color: '#1c1b1a', fontSize: '11px', fontWeight: 700,
                  letterSpacing: '0.12em', textTransform: 'uppercase', padding: '16px',
                  textDecoration: 'none', borderRadius: 0,
                }}
              >
                Continue Shopping 🛍️
              </Link>
            </div>
            
            <Link href="/" style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#8a8880', textDecoration: 'none', marginTop: '12px' }}>
              ← Return to Homepage
            </Link>
          </div>

          {/* WhatsApp Support text */}
          <p style={{ textAlign: 'center', fontSize: '12px', color: '#8a8880', margin: 0 }}>
            Have questions about your order?{' '}
            <a
              href={`https://wa.me/919876543210?text=Hi%20GudSampada,%20I%20have%20a%20question%20regarding%20Order%20%23${orderNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{ fontWeight: 700, color: '#1c1b1a', textDecoration: 'underline', textUnderlineOffset: '3px' }}
            >
              Chat with Us on WhatsApp 💬
            </a>
          </p>

        </div>
      </main>

      <Footer />
    </div>
  )
}
