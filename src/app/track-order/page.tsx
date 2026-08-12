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
    <div className="min-h-screen flex flex-col bg-[#F9F6F0] text-[#1C1C1A]">
      <Header />

      <main className="main-page-padding flex-1 w-full pb-20 pt-8">
        <div className="container-main max-w-3xl mx-auto w-full space-y-8">
          {/* Header Banner */}
          <div className="text-center space-y-3 pt-4">
            <span className="inline-block px-3.5 py-1 bg-[#1C1C1A] text-gold font-sans font-bold text-[10px] uppercase tracking-[0.25em]">
              Guest Order Tracking
            </span>
            <h1 className="font-heading text-3xl sm:text-4xl font-bold text-[#1C1C1A] block leading-tight">
              Track Your Package
            </h1>
            <p className="font-sans text-xs sm:text-sm text-molasses/70 max-w-lg mx-auto leading-relaxed">
              Enter your Order Number and Phone Number below to check real-time dispatch and courier status.
            </p>
          </div>

          {/* Lookup Form */}
          <div className="bg-white border border-[#1C1C1A]/15 p-6 sm:p-8 rounded-none shadow-sm space-y-6">
            <form onSubmit={handleTrackSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-sans font-bold uppercase tracking-[0.2em] text-[#8C7A6B] mb-2">
                    Order Number *
                  </label>
                  <input
                    type="text"
                    required
                    value={orderNumber}
                    onChange={(e) => setOrderNumber(e.target.value)}
                    placeholder="e.g. GS-2026-8492"
                    className="w-full h-12 bg-[#F9F6F0] border border-[#1C1C1A]/20 px-4 text-base font-mono text-[#1C1C1A] focus:outline-none focus:border-gold rounded-none uppercase"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-sans font-bold uppercase tracking-[0.2em] text-[#8C7A6B] mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. 9876543210"
                    className="w-full h-12 bg-[#F9F6F0] border border-[#1C1C1A]/20 px-4 text-base font-sans text-[#1C1C1A] focus:outline-none focus:border-gold rounded-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full h-12 bg-[#1C1C1A] hover:bg-gold text-white hover:text-[#1C1C1A] font-sans font-bold text-xs uppercase tracking-[0.2em] transition-all rounded-none cursor-pointer disabled:opacity-50 flex items-center justify-center space-x-2 shadow-sm"
              >
                {loading ? 'Locating Order...' : 'Track Order Status →'}
              </button>
            </form>

            {errorMsg && (
              <div className="p-4 bg-terracotta/10 border border-terracotta/30 text-terracotta text-xs font-sans text-center rounded-none leading-relaxed">
                {errorMsg}
                <div className="mt-2 pt-2 border-t border-terracotta/20">
                  <a
                    href="https://wa.me/919876543210?text=Hi%20GudSampada,%20I%20need%20help%20tracking%20my%20order."
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center text-[10px] font-bold text-terracotta underline hover:text-[#1C1C1A]"
                  >
                    💬 Contact Support on WhatsApp
                  </a>
                </div>
              </div>
            )}
          </div>

          {/* Results Display */}
          {orderData && (
            <div className="bg-white border border-[#1C1C1A]/15 p-6 sm:p-8 rounded-none shadow-sm space-y-8 animate-fadeIn">
              {/* Order Top Banner */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#1C1C1A]/10 pb-4 gap-3">
                <div>
                  <span className="text-[9px] font-sans font-bold uppercase tracking-[0.2em] text-[#8C7A6B] block">
                    Active Order
                  </span>
                  <h2 className="font-mono text-2xl font-bold text-[#1C1C1A]">{orderData.order_number}</h2>
                </div>
                <div className="text-left sm:text-right">
                  <span className="text-xs font-serif text-molasses/60 block">
                    Placed on {new Date(orderData.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </span>
                  <span className="inline-block mt-1 px-2.5 py-0.5 bg-forest/15 text-forest border border-forest/30 text-[10px] font-bold uppercase tracking-wider">
                    Payment: {orderData.payment_status}
                  </span>
                </div>
              </div>

              {/* Progress Timeline Tracker */}
              <div className="space-y-4">
                <h3 className="font-heading text-sm font-bold uppercase tracking-wider text-[#8C7A6B]">
                  Fulfillment Status
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  {ORDER_STEPS.map((step, idx) => {
                    const isCompleted = idx <= currentStep
                    const isCurrent = idx === currentStep
                    return (
                      <div
                        key={step.id}
                        className={`p-3 border rounded-none text-center transition-all ${
                          isCompleted
                            ? 'bg-[#1C1C1A] text-white border-[#1C1C1A]'
                            : 'bg-[#F9F6F0] text-molasses/40 border-[#1C1C1A]/15'
                        }`}
                      >
                        <span className="text-[10px] font-mono block mb-1">Step 0{idx + 1}</span>
                        <span className="text-xs font-sans font-bold block">{step.label}</span>
                        {isCurrent && (
                          <span className="inline-block mt-1 text-[9px] font-sans text-gold uppercase tracking-widest font-bold">
                            Current Stage
                          </span>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Courier & Tracking Box */}
              <div className="bg-[#F9F6F0] border border-[#1C1C1A]/15 p-5 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <span className="text-[9px] font-sans font-bold uppercase tracking-[0.2em] text-[#8C7A6B] block mb-1">
                      Courier Partner
                    </span>
                    <p className="font-sans text-sm font-bold text-[#1C1C1A]">
                      {orderData.courier_name || 'Dispatching soon via Shiprocket'}
                    </p>
                  </div>
                  <div>
                    <span className="text-[9px] font-sans font-bold uppercase tracking-[0.2em] text-[#8C7A6B] block mb-1">
                      AWB / Tracking ID
                    </span>
                    <p className="font-mono text-sm font-bold text-gold">
                      {orderData.awb_number || 'Assigning AWB...'}
                    </p>
                  </div>
                </div>

                {orderData.tracking_url && (
                  <div className="pt-2 border-t border-[#1C1C1A]/10">
                    <a
                      href={orderData.tracking_url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center justify-center w-full bg-[#1C1C1A] hover:bg-gold text-white hover:text-[#1C1C1A] font-sans font-bold text-xs uppercase tracking-[0.2em] py-3 rounded-none transition-all text-center"
                    >
                      Track Package on Courier Portal ↗
                    </a>
                  </div>
                )}
              </div>

              {/* Items & Shipping Summary */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-[#1C1C1A]/10 text-xs font-sans">
                <div>
                  <h4 className="font-bold text-[#8C7A6B] uppercase tracking-wider text-[10px] mb-2">
                    Shipping Address
                  </h4>
                  <p className="font-serif leading-relaxed text-[#1C1C1A]">
                    <strong>{orderData.customer_name}</strong><br />
                    {orderData.shipping_address?.line1}<br />
                    {orderData.shipping_address?.city}, {orderData.shipping_address?.state} — {orderData.shipping_address?.pincode}
                  </p>
                </div>

                <div>
                  <h4 className="font-bold text-[#8C7A6B] uppercase tracking-wider text-[10px] mb-2">
                    Items Purchased ({orderData.items?.length || 0})
                  </h4>
                  <div className="space-y-2">
                    {(orderData.items || []).map((item, idx) => (
                      <div key={idx} className="flex justify-between border-b border-[#1C1C1A]/10 pb-1.5">
                        <span>
                          <strong>{item.name}</strong> ({item.size || 'Standard'}) × {item.qty}
                        </span>
                        <span className="font-mono">₹{((item.price || 0) * (item.qty || 1)).toLocaleString('en-IN')}</span>
                      </div>
                    ))}
                    <div className="flex justify-between font-bold text-sm text-[#1C1C1A] pt-1">
                      <span>Total Amount Paid</span>
                      <span className="font-mono text-gold">₹{Number(orderData.total || 0).toLocaleString('en-IN')}</span>
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
    <Suspense fallback={<div className="min-h-screen bg-[#F9F6F0] flex items-center justify-center font-sans text-xs uppercase tracking-widest text-[#1C1C1A]">Loading Order Tracker...</div>}>
      <TrackOrderContent />
    </Suspense>
  )
}
