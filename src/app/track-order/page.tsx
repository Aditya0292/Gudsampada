'use client'

import React, { useState, Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

interface TrackedOrderData {
  order_number: string
  customer_name: string
  created_at: string
  order_status: 'placed' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled'
  payment_status: string
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
  total: number
  courier_name?: string | null
  awb_number?: string | null
  tracking_url?: string | null
  shipment_status?: string | null
}

const ORDER_STEPS = [
  { id: 'placed', label: 'Order Placed' },
  { id: 'confirmed', label: 'Confirmed' },
  { id: 'shipped', label: 'Shipped' },
  { id: 'delivered', label: 'Delivered' },
]

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
    marginBottom: '4px',
  },
  input: {
    width: '100%',
    border: 'none',
    borderBottom: '1px solid rgba(200,193,182,0.8)',
    background: 'transparent',
    padding: '10px 0',
    fontSize: '14px',
    color: '#010100',
    outline: 'none',
    fontFamily: 'Outfit, sans-serif',
    borderRadius: 0,
  }
}

function TrackOrderContent(): React.JSX.Element {
  const searchParams = useSearchParams()
  const initialOrderNum = searchParams ? (searchParams.get('order') || searchParams.get('num') || '') : ''

  const [orderNumber, setOrderNumber] = useState(initialOrderNum)
  const [phone, setPhone] = useState('')
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [orderData, setOrderData] = useState<TrackedOrderData | null>(null)

  const handleTrackSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErrorMsg(null)
    setOrderData(null)

    try {
      const response = await fetch('/api/track-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ order_number: orderNumber, phone }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Unable to locate order')
      }

      setOrderData(data.order)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Order lookup failed'
      setErrorMsg(msg)
    } finally {
      setLoading(false)
    }
  }

  const getStepIndex = (status: string) => {
    switch (status) {
      case 'placed':
        return 0
      case 'confirmed':
        return 1
      case 'shipped':
        return 2
      case 'delivered':
        return 3
      default:
        return 0
    }
  }

  const currentStep = orderData ? getStepIndex(orderData.order_status) : 0

  return (
    <div style={{ background: '#f9f4f1', minHeight: '100vh', fontFamily: 'Outfit, sans-serif', display: 'flex', flexDirection: 'column' }}>
      <Header />

      <main className="px-4 sm:px-12 py-12 sm:py-16 w-full max-w-3xl" style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', boxSizing: 'border-box', margin: '0 auto' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', width: '100%' }}>
          
          {/* Header Banner */}
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <span style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', color: '#c9a96e', background: '#f5f0ef', padding: '8px 20px', border: '1px solid rgba(200,193,182,0.6)', display: 'inline-block', marginBottom: '16px' }}>
              Guest Order Tracking
            </span>
            <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: '38px', fontWeight: 500, color: '#010100', margin: 0 }}>
              Track Your Package
            </h1>
            <p style={{ fontSize: '14px', color: '#8a8880', marginTop: '12px', lineHeight: 1.6 }}>
              Enter your Order Number and Phone Number below to check real-time dispatch and courier status.
            </p>
          </div>

          {/* Form Card */}
          <div style={{ border: '1px solid rgba(200,193,182,0.5)', background: '#fff', padding: '32px' }}>
            <form onSubmit={handleTrackSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label style={S.label}>Order Number *</label>
                  <input
                    type="text"
                    required
                    value={orderNumber}
                    onChange={(e) => setOrderNumber(e.target.value)}
                    placeholder="e.g. GS-2026-8492"
                    style={{ ...S.input, textTransform: 'uppercase' }}
                  />
                </div>
                <div>
                  <label style={S.label}>Phone Number *</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. 9876543210"
                    style={S.input}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                style={{
                  width: '100%',
                  background: '#1c1b1a',
                  color: '#fff',
                  border: 'none',
                  padding: '16px',
                  fontSize: '11px',
                  fontWeight: 700,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                  opacity: loading ? 0.6 : 1,
                  transition: 'opacity 0.15s',
                  borderRadius: 0,
                  boxSizing: 'border-box',
                }}
              >
                {loading ? 'Locating Order...' : 'Track Order Status →'}
              </button>
            </form>

            {errorMsg && (
              <div style={{ marginTop: '24px', padding: '16px', background: 'rgba(186,26,26,0.08)', border: '1px solid rgba(186,26,26,0.3)', color: '#ba1a1a', fontSize: '13px', textAlign: 'center' }}>
                {errorMsg}
                <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid rgba(186,26,26,0.2)' }}>
                  <a
                    href="https://wa.me/919876543210?text=Hi%20GudSampada,%20I%20need%20help%20tracking%20my%20order."
                    target="_blank"
                    rel="noreferrer"
                    style={{ fontSize: '11px', fontWeight: 700, color: '#1c1b1a', textDecoration: 'underline' }}
                  >
                    💬 Contact Support on WhatsApp
                  </a>
                </div>
              </div>
            )}
          </div>

          {/* Results Box */}
          {orderData && (
            <div style={{ border: '1px solid rgba(200,193,182,0.5)', background: '#fff', padding: '32px', display: 'flex', flexDirection: 'column', gap: '32px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid rgba(200,193,182,0.35)', paddingBottom: '20px' }}>
                <div>
                  <span style={S.label}>Active Order</span>
                  <h2 style={{ fontFamily: 'monospace', fontSize: '24px', fontWeight: 700, color: '#010100', margin: 0 }}>
                    {orderData.order_number}
                  </h2>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '12px', color: '#8a8880', display: 'block' }}>
                    Placed on {new Date(orderData.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </span>
                  <span style={{ display: 'inline-block', marginTop: '6px', fontSize: '10px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#2E7D32', background: '#E8F5E9', padding: '4px 12px', border: '1px solid currentColor' }}>
                    Payment: {orderData.payment_status}
                  </span>
                </div>
              </div>

              {/* Progress Timeline */}
              <div>
                <h3 style={{ ...S.sectionTitle, fontSize: '14px', textTransform: 'uppercase', letterSpacing: '0.12em', color: '#8a8880' }}>
                  Fulfillment Status
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                  {ORDER_STEPS.map((step, idx) => {
                    const isCompleted = idx <= currentStep
                    const isCurrent = idx === currentStep
                    return (
                      <div
                        key={step.id}
                        style={{
                          padding: '16px',
                          border: isCompleted ? '1px solid #1c1b1a' : '1px solid rgba(200,193,182,0.6)',
                          background: isCompleted ? '#1c1b1a' : '#fff',
                          color: isCompleted ? '#fff' : '#474741',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '4px',
                          borderRadius: 0,
                          textAlign: 'center',
                        }}
                      >
                        <span style={{ fontSize: '9px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: isCompleted ? '#c9a96e' : '#8a8880' }}>
                          Step 0{idx + 1}
                        </span>
                        <span style={{ fontSize: '12px', fontWeight: 600 }}>{step.label}</span>
                        {isCurrent && (
                          <span style={{ fontSize: '9px', color: '#c9a96e', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700, marginTop: '4px' }}>
                            Current Stage
                          </span>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Courier Panel */}
              <div style={{ background: '#fdf8f7', border: '1px solid rgba(200,193,182,0.5)', padding: '20px' }}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <span style={S.label}>Courier Partner</span>
                    <span style={{ fontSize: '13px', fontWeight: 600, color: '#010100' }}>
                      {orderData.courier_name || 'Dispatching soon via Shiprocket'}
                    </span>
                  </div>
                  <div>
                    <span style={S.label}>AWB / Tracking ID</span>
                    <span style={{ fontSize: '13px', fontWeight: 600, color: '#010100', fontFamily: 'monospace' }}>
                      {orderData.awb_number || 'Assigning AWB...'}
                    </span>
                  </div>
                </div>

                {orderData.tracking_url && (
                  <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid rgba(200,193,182,0.3)' }}>
                    <a
                      href={orderData.tracking_url}
                      target="_blank"
                      rel="noreferrer"
                      style={{
                        display: 'block', width: '100%', background: '#1c1b1a', color: '#fff',
                        fontSize: '11px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase',
                        padding: '12px', textDecoration: 'none', textAlign: 'center', boxSizing: 'border-box',
                      }}
                    >
                      Track Package on Courier Portal ↗
                    </a>
                  </div>
                )}
              </div>

              {/* Summary Lists */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 pt-6 border-t border-[rgba(200,193,182,0.35)]">
                <div>
                  <h3 style={S.label}>Shipping Address</h3>
                  <p style={{ fontSize: '13px', color: '#474741', margin: 0, lineHeight: 1.5 }}>
                    <strong style={{ color: '#010100' }}>{orderData.customer_name}</strong><br />
                    {orderData.shipping_address?.line1}<br />
                    {orderData.shipping_address?.city}, {orderData.shipping_address?.state} — {orderData.shipping_address?.pincode}
                  </p>
                </div>

                <div>
                  <h3 style={S.label}>Items Purchased ({orderData.items?.length || 0})</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {(orderData.items || []).map((item, idx) => (
                      <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#474741', borderBottom: '1px solid rgba(200,193,182,0.25)', paddingBottom: '6px' }}>
                        <span>
                          <strong>{item.name}</strong> {item.size && `(${item.size})`} × {item.qty}
                        </span>
                        <span style={{ fontFamily: 'monospace', fontWeight: 600 }}>₹{((item.price || 0) * (item.qty || 1)).toLocaleString('en-IN')}</span>
                      </div>
                    ))}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', fontWeight: 700, fontSize: '14px', color: '#010100', paddingTop: '8px' }}>
                      <span>Total Amount Paid</span>
                      <span style={{ fontFamily: 'Playfair Display, serif', fontSize: '18px', color: '#ba1a1a' }}>₹{Number(orderData.total || 0).toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          )}

        </div>
      </main>

      <Footer />
    </div>
  )
}

export default function TrackOrderPage(): React.JSX.Element {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', background: '#f9f4f1', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Outfit, sans-serif', fontSize: '11px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#8a8880' }}>Loading Order Tracker...</div>}>
      <TrackOrderContent />
    </Suspense>
  )
}
