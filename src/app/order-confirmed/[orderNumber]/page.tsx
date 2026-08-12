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
    <div className="min-h-screen flex flex-col bg-[#F9F6F0] text-[#1C1C1A]">
      <Header />

      <main className="main-page-padding flex-1 w-full pb-20 pt-8">
        <div className="container-main max-w-3xl mx-auto space-y-8">

          {/* ── 1. Success Icon & Main Message Banner ── */}
          <div className="text-center flex flex-col items-center justify-center space-y-4 pt-4 w-full">
            <div className="flex justify-center w-full">
              <div className={`w-16 h-16 rounded-full border-2 flex items-center justify-center ${
                isPaid
                  ? 'border-[#4A5D23] bg-[#4A5D23]/10 text-[#4A5D23]'
                  : 'border-[#8B5A2B] bg-[#8B5A2B]/10 text-[#8B5A2B]'
              }`}>
                {isPaid ? (
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                ) : (
                  <span className="text-2xl">📦</span>
                )}
              </div>
            </div>

            <div className="text-center w-full">
              <span className={`inline-block px-3 py-1 font-sans font-bold text-[10px] uppercase tracking-[0.2em] mb-3 ${
                isPaid
                  ? 'bg-[#4A5D23]/15 text-[#4A5D23] border border-[#4A5D23]/30'
                  : 'bg-[#8B5A2B]/15 text-[#8B5A2B] border border-[#8B5A2B]/30'
              }`}>
                {isPaid ? 'Payment Verified ✓' : 'Order Placed (Payment Pending COD)'}
              </span>

              <h1 className="font-heading text-3xl sm:text-4xl font-bold text-[#1C1C1A] leading-tight text-center block w-full">
                {isPaid ? 'Thank You For Your Order!' : 'Order Request Received!'}
              </h1>
            </div>

            <p className="font-sans text-sm text-[#1C1C1A]/70 max-w-lg mx-auto text-center leading-relaxed block w-full">
              {isPaid
                ? 'Your payment was successfully verified. Your authentic Kolhapuri jaggery is being freshly prepared for dispatch.'
                : 'Your order request has been logged. Our team will verify your items and collect payment via COD or UPI upon delivery.'}
            </p>
          </div>

          {/* ── 2. Order Reference Summary Box ── */}
          <div className="bg-white border border-[#1C1C1A]/15 p-6 sm:p-8 rounded-none shadow-sm space-y-6">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#1C1C1A]/10 pb-4 gap-3">
              <div>
                <span className="text-[10px] font-sans font-bold uppercase tracking-[0.2em] text-[#8B5A2B] block mb-1">
                  Order Reference Number
                </span>
                <span className="font-mono text-2xl sm:text-3xl font-bold text-[#1C1C1A] tracking-wider block">
                  {orderNumber}
                </span>
              </div>
              <div className="text-left sm:text-right">
                <span className="text-xs font-sans text-[#1C1C1A]/60 block">
                  Placed: {order ? new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : new Date().toLocaleDateString('en-IN')}
                </span>
                <span className={`inline-block mt-1.5 px-3 py-0.5 border text-[10px] font-sans font-bold uppercase tracking-wider ${
                  isPaid
                    ? 'bg-[#4A5D23]/10 text-[#4A5D23] border-[#4A5D23]/30'
                    : 'bg-[#8B5A2B]/10 text-[#8B5A2B] border-[#8B5A2B]/30'
                }`}>
                  {loading ? 'Loading...' : isPaid ? 'Paid Online ✓' : 'Pending (COD)'}
                </span>
              </div>
            </div>

            {/* Courier Dispatch Partner & AWB Block */}
            <div className="bg-[#F9F6F0] border border-[#1C1C1A]/15 p-5 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <span className="text-[10px] font-sans font-bold uppercase tracking-[0.2em] text-[#8B5A2B] block mb-1">
                    Courier Dispatch Partner
                  </span>
                  <span className="font-sans text-sm font-bold text-[#1C1C1A] block">
                    {order?.courier_name || 'Shiprocket (Assigning Courier...)'}
                  </span>
                </div>

                <div>
                  <span className="text-[10px] font-sans font-bold uppercase tracking-[0.2em] text-[#8B5A2B] block mb-1">
                    AWB Tracking Number
                  </span>
                  <span className="font-mono text-sm font-bold text-[#8B5A2B] block">
                    {order?.awb_number || 'Assigning AWB...'}
                  </span>
                </div>
              </div>

              {order?.tracking_url && (
                <div className="pt-3 border-t border-[#1C1C1A]/10">
                  <a
                    href={order.tracking_url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center w-full bg-[#1C1C1A] hover:bg-[#8B5A2B] text-white font-sans font-bold text-xs uppercase tracking-[0.2em] py-3.5 transition-all text-center rounded-none shadow-sm"
                  >
                    Track Package Live on Courier Portal ↗
                  </a>
                </div>
              )}
            </div>

            {/* ── 3. Fulfillment Pipeline ── */}
            <div className="space-y-4 pt-2">
              <h2 className="font-sans text-xs font-bold uppercase tracking-[0.2em] text-[#8B5A2B] block">
                Fulfillment Timeline
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {steps.map((st) => (
                  <div
                    key={st.num}
                    className={`p-4 border rounded-none text-left space-y-1 transition-all ${
                      st.completed
                        ? 'bg-[#1C1C1A] text-white border-[#1C1C1A]'
                        : 'bg-[#F9F6F0] text-[#1C1C1A]/60 border-[#1C1C1A]/15'
                    }`}
                  >
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider block text-[#8B5A2B]">
                      Step {st.num}
                    </span>
                    <span className="text-xs font-sans font-bold block text-[#1C1C1A] leading-snug">
                      {st.title}
                    </span>
                    <span className="text-[11px] font-serif block opacity-75 leading-relaxed">
                      {st.desc}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* ── 4. Itemized Order Receipt & Delivery Address ── */}
            {order && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-[#1C1C1A]/10 text-xs font-sans">
                <div>
                  <h3 className="font-sans font-bold text-[#8B5A2B] uppercase tracking-[0.15em] text-[10px] mb-2 block">
                    Shipping Address
                  </h3>
                  <p className="font-serif leading-relaxed text-[#1C1C1A] text-xs">
                    <strong>{order.customer_name}</strong><br />
                    {order.shipping_address?.line1}<br />
                    {order.shipping_address?.city}, {order.shipping_address?.state} — {order.shipping_address?.pincode}<br />
                    <span className="font-mono text-[#1C1C1A]/70">📞 {order.customer_phone}</span>
                  </p>
                </div>

                <div>
                  <h3 className="font-sans font-bold text-[#8B5A2B] uppercase tracking-[0.15em] text-[10px] mb-2 block">
                    Items Purchased ({order.items?.length || 0})
                  </h3>
                  <div className="space-y-2">
                    {(order.items || []).map((item, idx) => (
                      <div key={idx} className="flex justify-between border-b border-[#1C1C1A]/10 pb-2 text-xs">
                        <span>
                          <strong>{item.name}</strong> ({item.size || 'Standard'}) × {item.qty}
                        </span>
                        <span className="font-mono">₹{((item.price || 0) * (item.qty || 1)).toLocaleString('en-IN')}</span>
                      </div>
                    ))}
                    <div className="flex justify-between font-bold text-sm text-[#1C1C1A] pt-2 border-t border-[#1C1C1A]/15">
                      <span>Total Amount</span>
                      <span className="font-mono text-[#8B5A2B]">₹{Number(order.total || 0).toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

          </div>

          {/* ── 5. Action Buttons (Track Portal, Shop, Home) ── */}
          <div className="space-y-4 text-center">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Link
                href={`/track-order?order=${orderNumber}`}
                className="w-full bg-[#1C1C1A] hover:bg-[#8B5A2B] text-white font-sans font-bold text-xs uppercase tracking-[0.2em] py-4 rounded-none transition-all text-center shadow-sm flex items-center justify-center space-x-2"
              >
                <span>📦</span>
                <span>Open Order Tracking Portal</span>
              </Link>

              <Link
                href="/shop"
                className="w-full border border-[#1C1C1A] hover:bg-[#1C1C1A] text-[#1C1C1A] hover:text-white font-sans font-bold text-xs uppercase tracking-[0.2em] py-4 rounded-none transition-all text-center shadow-sm"
              >
                Continue Shopping 🛍️
              </Link>
            </div>

            <div className="pt-2">
              <Link
                href="/"
                className="text-[11px] font-sans text-[#1C1C1A]/60 hover:text-[#8B5A2B] uppercase tracking-wider font-bold"
              >
                ← Return to Homepage
              </Link>
            </div>
          </div>

          {/* ── 6. WhatsApp Support Footer ── */}
          <p className="text-center text-xs font-sans text-[#1C1C1A]/60 pt-2">
            Have questions about your order?{' '}
            <a
              href={`https://wa.me/919876543210?text=Hi%20GudSampada,%20I%20have%20a%20question%20regarding%20Order%20%23${orderNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-[#1C1C1A] underline hover:text-[#8B5A2B]"
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
