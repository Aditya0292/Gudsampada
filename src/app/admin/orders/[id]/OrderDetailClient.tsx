'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { AdminOrder } from '../OrdersTable'

interface OrderDetailClientProps {
  order: AdminOrder
}

export default function OrderDetailClient({ order: initialOrder }: OrderDetailClientProps): React.JSX.Element {
  const [order, setOrder] = useState<AdminOrder>(initialOrder)
  const [orderStatus, setOrderStatus] = useState<string>(initialOrder.order_status)
  const [paymentStatus, setPaymentStatus] = useState<string>(initialOrder.payment_status)
  const [trackingNumber, setTrackingNumber] = useState<string>(initialOrder.tracking_number || '')
  const [isUpdating, setIsUpdating] = useState(false)
  const [updateMessage, setUpdateMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [copiedWhatsApp, setCopiedWhatsApp] = useState(false)

  const handleUpdateOrder = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsUpdating(true)
    setUpdateMessage(null)

    try {
      const supabase = createClient()
      const { error } = await (supabase.from('orders') as any)
        .update({
          order_status: orderStatus,
          payment_status: paymentStatus,
          tracking_number: trackingNumber || null,
        })
        .eq('id', order.id)

      if (error) {
        throw new Error(error.message)
      }

      setOrder((prev) => ({
        ...prev,
        order_status: orderStatus as AdminOrder['order_status'],
        payment_status: paymentStatus as AdminOrder['payment_status'],
        tracking_number: trackingNumber || null,
      }))

      setUpdateMessage({ type: 'success', text: '✓ Order status & tracking updated successfully!' })
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to update order'
      setUpdateMessage({ type: 'error', text: `❌ ${msg}` })
    } finally {
      setIsUpdating(false)
    }
  }

  // Generate WhatsApp Message for Admin to Customer
  const generateWhatsAppMessageText = () => {
    const address = [
      order.shipping_address?.line1,
      order.shipping_address?.city,
      order.shipping_address?.pincode,
      order.shipping_address?.state,
    ]
      .filter(Boolean)
      .join(', ')

    const itemsText = (order.items || [])
      .map((i) => `• ${i.name} (${i.size || 'Default'}) × ${i.qty || 1} — ₹${((i.price || 0) * (i.qty || 1)).toLocaleString('en-IN')}`)
      .join('\n')

    return `*GudSampada — Order Update* 📦
Order ID: *${order.order_number}*
Customer Name: ${order.customer_name}

━━━━━━━━━━━━━━━━━━━━━━━━
*Fulfillment Status:* ${orderStatus.toUpperCase()}
*Payment Status:* ${paymentStatus.toUpperCase()}
${trackingNumber ? `*Courier Tracking Number:* ${trackingNumber}` : ''}

━━━━━━━━━━━━━━━━━━━━━━━━
*ORDER ITEMS:*
${itemsText}

*Total Amount:* ₹${Number(order.total || 0).toLocaleString('en-IN')}
*Shipping Address:* ${address}

Thank you for choosing GudSampada! 🙏`
  }

  const handleCopyWhatsApp = () => {
    const msg = generateWhatsAppMessageText()
    navigator.clipboard.writeText(msg)
    setCopiedWhatsApp(true)
    setTimeout(() => setCopiedWhatsApp(false), 2500)
  }

  const [isResendingEmail, setIsResendingEmail] = useState(false)
  const [emailStatusMsg, setEmailStatusMsg] = useState<string | null>(null)
  const [isCreatingShipment, setIsCreatingShipment] = useState(false)
  const [shipmentMsg, setShipmentMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const handleResendEmail = async () => {
    setIsResendingEmail(true)
    setEmailStatusMsg(null)
    try {
      const res = await fetch('/api/admin/resend-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ order_id: order.id }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to resend email')
      setEmailStatusMsg(`✓ ${data.message || 'Email sent successfully!'}`)
      setOrder((prev) => ({ ...prev, email_sent: true, email_sent_at: new Date().toISOString() }))
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Resend email error'
      setEmailStatusMsg(`❌ ${msg}`)
    } finally {
      setIsResendingEmail(false)
    }
  }

  const handleCreateShipment = async () => {
    setIsCreatingShipment(true)
    setShipmentMsg(null)
    try {
      const res = await fetch('/api/create-shipment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ order_id: order.id }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to create shipment')
      setShipmentMsg({ type: 'success', text: `✓ Shipment Created! AWB: ${data.awb_number}` })
      setOrder((prev) => ({
        ...prev,
        order_status: 'shipped',
        shipment_status: 'shipped',
        shiprocket_order_id: data.shiprocket_order_id,
        shiprocket_shipment_id: data.shipment_id,
        awb_number: data.awb_number,
        courier_name: data.courier_name,
        tracking_url: data.tracking_url,
        tracking_number: data.awb_number,
      }))
      if (data.awb_number && data.awb_number !== 'Pending AWB Assignment') {
        setTrackingNumber(data.awb_number)
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Shipment error'
      setShipmentMsg({ type: 'error', text: `❌ ${msg}` })
    } finally {
      setIsCreatingShipment(false)
    }
  }

  return (
    <div className="space-y-6 sm:space-y-8 w-full" style={{ fontFamily: 'Outfit, sans-serif' }}>

      {/* Top Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 border-b border-[#c8c7bf]/35 pb-5">
        <Link href="/admin/orders"
          className="flex items-center gap-2 text-[#8a8880] hover:text-[#010100] font-semibold text-xs uppercase tracking-wider transition-colors group">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="group-hover:-translate-x-0.5 transition-transform"><path d="m15 18-6-6 6-6" /></svg>
          Back to Orders
        </Link>
        <button onClick={handleCopyWhatsApp}
          className="inline-flex items-center justify-center border border-[#2E7D32] hover:bg-[#2E7D32] text-[#2E7D32] hover:text-white text-[10px] font-bold uppercase tracking-wider px-5 py-2.5 rounded-none transition-all gap-2 cursor-pointer w-full sm:w-auto bg-transparent">
          <span>💬</span>
          <span>{copiedWhatsApp ? 'Copied! ✓' : 'Copy WhatsApp Update'}</span>
        </button>
      </div>

      {/* Main Order Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">

        {/* Left Column (8 cols): Details & Items */}
        <div className="lg:col-span-8 space-y-6">

          {/* Order Details Header */}
          <div className="bg-white border border-[#c8c7bf]/35 p-6 sm:p-8 rounded-none shadow-sm space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#c8c7bf]/20 gap-3">
              <div>
                <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-[#8a8880] mb-1">Order Identifier</p>
                <h2 className="font-serif text-2xl font-semibold text-[#010100]">{order.order_number}</h2>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 border text-[9px] font-bold uppercase tracking-wider rounded-none ${order.payment_status === 'paid' ? 'bg-[#E8F5E9]/50 text-[#2E7D32] border-[#2E7D32]/20' :
                    order.payment_status === 'failed' ? 'bg-[#FFEBEE]/50 text-[#ba1a1a] border-[#ba1a1a]/20' : 'bg-[#FFF8E1]/50 text-[#b56a00] border-[#b56a00]/20'
                  }`}>
                  <span className="w-1.5 h-1.5 bg-current rounded-none"></span>
                  Payment: {order.payment_status}
                </span>
                <span className={`inline-flex items-center px-3 py-1 border text-[9px] font-bold uppercase tracking-wider rounded-none ${order.order_status === 'shipped' ? 'bg-[#E3F2FD]/50 text-[#1565C0] border-[#1565C0]/20' :
                    order.order_status === 'delivered' ? 'bg-[#E8F5E9]/50 text-[#1B5E20] border-[#1B5E20]/20' :
                      order.order_status === 'confirmed' ? 'bg-[#E8F5E9]/50 text-[#2E7D32] border-[#2E7D32]/20' :
                        'bg-[#e5e2e1]/50 text-[#474741] border-[#c8c7bf]/30'
                  }`}>
                  Fulfillment: {order.order_status}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-2">
              <div>
                <span className="text-[#8a8880] uppercase text-[9px] font-bold tracking-wider block mb-1">Order Date</span>
                <span className="font-semibold text-xs text-[#010100]">
                  {new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              <div>
                <span className="text-[#8a8880] uppercase text-[9px] font-bold tracking-wider block mb-1">Customer Name</span>
                <span className="font-semibold text-xs text-[#010100] truncate block">{order.customer_name}</span>
              </div>
              <div>
                <span className="text-[#8a8880] uppercase text-[9px] font-bold tracking-wider block mb-1">Payment Method</span>
                <span className="font-semibold text-xs text-[#010100] uppercase font-mono">{order.checkout_method?.replace(/_/g, ' ') || 'COD'}</span>
              </div>
              <div>
                <span className="text-[#8a8880] uppercase text-[9px] font-bold tracking-wider block mb-1">Grand Total</span>
                <span className="font-serif font-bold text-[#ba1a1a] text-sm">
                  ₹{Number(order.total || 0).toLocaleString('en-IN')}
                </span>
              </div>
            </div>
          </div>

          {/* Email Delivery Status Card */}
          <div className="bg-white border border-[#c8c7bf]/35 p-6 rounded-none shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#c8c7bf]/20 pb-3">
              <div>
                <span className="text-[9px] font-bold uppercase tracking-[0.15em] text-[#8a8880] block">
                  Customer Email Notification
                </span>
                <h3 className="font-serif text-base font-semibold text-[#010100] mt-0.5">Confirmation Email</h3>
              </div>
              <div>
                {order.customer_email ? (
                  order.email_sent ? (
                    <span className="px-2.5 py-1 bg-[#E8F5E9]/50 text-[#2E7D32] border border-[#2E7D32]/20 font-bold text-[9px] uppercase tracking-wider rounded-none">
                      Sent ✓ {order.email_sent_at ? `(${new Date(order.email_sent_at).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })})` : ''}
                    </span>
                  ) : (
                    <span className="px-2.5 py-1 bg-[#FFEBEE]/50 text-[#ba1a1a] border border-[#ba1a1a]/20 font-bold text-[9px] uppercase tracking-wider rounded-none">
                      Pending / Failed ❌
                    </span>
                  )
                ) : (
                  <span className="px-2.5 py-1 bg-gray-50 text-gray-500 border border-gray-200 font-bold text-[9px] uppercase tracking-wider rounded-none">
                    No Email Provided
                  </span>
                )}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1">
              <div className="text-xs text-[#010100]">
                <span className="text-[#8a8880] font-semibold">Recipient:</span> <code className="font-mono bg-[#fdf8f7] px-2 py-1 border border-[#c8c7bf]/20">{order.customer_email || 'None (WhatsApp COD)'}</code>
              </div>

              {order.customer_email && (
                <button
                  type="button"
                  onClick={handleResendEmail}
                  disabled={isResendingEmail}
                  className="border border-[#010100] hover:bg-[#010100] hover:text-white text-[#010100] font-bold text-[10px] uppercase tracking-wider px-4 py-2 rounded-none transition-all cursor-pointer bg-transparent disabled:opacity-50"
                >
                  {isResendingEmail ? 'Sending...' : 'Resend Confirmation Email'}
                </button>
              )}
            </div>

            {emailStatusMsg && (
              <p className="text-xs font-semibold text-[#010100] bg-[#f9f4f1] p-3 border border-[#c8c7bf]/40">
                {emailStatusMsg}
              </p>
            )}
          </div>

          {/* Itemized Products List */}
          <div className="bg-white border border-[#c8c7bf]/35 p-6 rounded-none shadow-sm space-y-4">
            <h3 className="font-serif text-base font-semibold text-[#010100] border-b border-[#c8c7bf]/20 pb-3">
              Itemized Products ({order.items?.length || 0})
            </h3>
            <div className="divide-y divide-[#c8c7bf]/20">
              {(order.items || []).map((item, idx) => (
                <div key={idx} className="py-4 flex items-center justify-between first:pt-0 last:pb-0 gap-3">
                  <div>
                    <p className="font-serif font-semibold text-[#010100] text-base">{item.name}</p>
                    <p className="text-[#8a8880] text-xs mt-1">Size / Weight: {item.size || 'Standard'}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="font-mono font-bold text-xs text-[#010100]">
                      ₹{item.price} × {item.qty || 1} = ₹{((item.price || 0) * (item.qty || 1)).toLocaleString('en-IN')}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Price Breakdown */}
            <div className="border-t border-[#c8c7bf]/20 pt-4 space-y-2.5 text-xs text-[#010100]">
              <div className="flex justify-between text-[#8a8880]">
                <span>Subtotal</span>
                <span className="font-mono">₹{Number(order.subtotal || 0).toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-[#8a8880]">
                <span>Shipping Fee</span>
                <span className="font-mono">₹{Number(order.shipping_fee || 0).toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between font-semibold text-sm text-[#010100] pt-3 border-t border-[#c8c7bf]/20">
                <span>Total Amount Paid / Payable</span>
                <span className="font-serif text-lg font-bold text-[#ba1a1a]">₹{Number(order.total || 0).toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>

          {/* Customer & Shipping Information */}
          <div className="bg-white border border-[#c8c7bf]/35 p-6 sm:p-8 rounded-none shadow-sm space-y-5">
            <h3 className="font-serif text-base font-semibold text-[#010100] border-b border-[#c8c7bf]/20 pb-3">
              Customer & Shipping Info
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 text-xs">

              <div className="space-y-2">
                <span className="text-[9px] font-bold uppercase tracking-wider text-[#8a8880] block mb-1">
                  Customer Contact
                </span>
                <p className="font-serif font-semibold text-[#010100] text-base">{order.customer_name}</p>
                <div className="space-y-1 mt-2 text-[#474741]">
                  <p className="flex items-center gap-1.5 font-mono">
                    <span className="text-[#8a8880]">Phone:</span> {order.customer_phone}
                  </p>
                  {order.customer_email && (
                    <p className="flex items-center gap-1.5">
                      <span className="text-[#8a8880]">Email:</span> {order.customer_email}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <span className="text-[9px] font-bold uppercase tracking-wider text-[#8a8880] block mb-1">
                  Shipping Address
                </span>
                <p className="text-[#474741] font-serif leading-relaxed text-sm bg-[#fdf8f7] p-4 border border-[#c8c7bf]/20">
                  {order.shipping_address?.line1}
                  <br />
                  {order.shipping_address?.city}, {order.shipping_address?.state} — {order.shipping_address?.pincode}
                </p>
              </div>

            </div>
          </div>
        </div>

        {/* Right Column (4 cols): Order Management Controls */}
        <div className="lg:col-span-4 space-y-6">

          {/* Shiprocket Order Creation Card */}
          <div className="bg-white border border-[#c8c7bf]/35 p-6 rounded-none shadow-sm space-y-4">
            <div className="border-b border-[#c8c7bf]/20 pb-3">
              <span className="text-[9px] font-bold uppercase tracking-[0.15em] text-[#8a8880] block">
                Courier Dispatch
              </span>
              <h3 className="font-serif text-base font-semibold text-[#010100] mt-0.5">Shiprocket Fulfillment</h3>
            </div>

            {shipmentMsg && (
              <div
                className={`p-3 text-xs font-semibold rounded-none ${shipmentMsg.type === 'success'
                    ? 'bg-[#E8F5E9]/50 border border-[#2E7D32]/20 text-[#2E7D32]'
                    : 'bg-[#FFEBEE]/50 border border-[#ba1a1a]/20 text-[#ba1a1a]'
                  }`}
              >
                {shipmentMsg.text}
              </div>
            )}

            {order.shiprocket_order_id ? (
              <div className="space-y-3 text-xs">
                <div className="p-4 bg-[#fdf8f7] border border-[#c8c7bf]/25 space-y-2.5">
                  <div>
                    <span className="text-[#8a8880] text-[9px] font-bold uppercase tracking-wider block">Shiprocket Order ID</span>
                    <span className="font-mono font-bold text-[#010100]">{order.shiprocket_order_id}</span>
                  </div>
                  <div>
                    <span className="text-[#8a8880] text-[9px] font-bold uppercase tracking-wider block">AWB Tracking Number</span>
                    <span className="font-mono font-bold text-gold">{order.awb_number || 'Pending AWB Assignment'}</span>
                  </div>
                  {order.courier_name && (
                    <div>
                      <span className="text-[#8a8880] text-[9px] font-bold uppercase tracking-wider block">Assigned Courier</span>
                      <span className="font-bold text-[#010100]">{order.courier_name}</span>
                    </div>
                  )}
                </div>

                {order.tracking_url && (
                  <a
                    href={order.tracking_url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center w-full bg-[#010100] hover:bg-[#c9a96e] text-white font-bold text-xs uppercase tracking-[0.12em] py-3 transition-colors text-center rounded-none"
                  >
                    Track Shipment Live ↗
                  </a>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-xs text-[#8a8880] leading-relaxed">
                  Generate courier dispatch order with Shiprocket to assign AWB and track shipment progress.
                </p>
                <button
                  type="button"
                  onClick={handleCreateShipment}
                  disabled={isCreatingShipment}
                  className="w-full bg-[#010100] hover:bg-[#c9a96e] text-white font-bold text-xs uppercase tracking-[0.15em] py-3 rounded-none transition-colors cursor-pointer disabled:opacity-50"
                >
                  {isCreatingShipment ? 'Generating Shipment...' : 'Create Shiprocket Shipment'}
                </button>
              </div>
            )}
          </div>

          {/* Fulfillment Controls Form */}
          <form onSubmit={handleUpdateOrder} className="bg-white border border-[#c8c7bf]/35 p-6 rounded-none shadow-sm space-y-5">
            <h3 className="font-serif text-base font-semibold text-[#010100] border-b border-[#c8c7bf]/20 pb-3">
              Fulfillment Controls
            </h3>

            {updateMessage && (
              <div
                className={`p-3 text-xs font-semibold rounded-none ${updateMessage.type === 'success'
                    ? 'bg-[#E8F5E9]/50 border border-[#2E7D32]/20 text-[#2E7D32]'
                    : 'bg-[#FFEBEE]/50 border border-[#ba1a1a]/20 text-[#ba1a1a]'
                  }`}
              >
                {updateMessage.text}
              </div>
            )}

            {/* Order Status Select */}
            <div>
              <label className="block text-[9px] font-bold uppercase tracking-wider text-[#8a8880] mb-2">
                Order Fulfillment Status
              </label>
              <select
                value={orderStatus}
                onChange={(e) => setOrderStatus(e.target.value)}
                className="w-full h-11 bg-white border border-[#c8c7bf]/60 px-3 text-xs text-[#010100] focus:outline-none focus:border-[#010100] rounded-none cursor-pointer capitalize"
              >
                <option value="placed">Placed</option>
                <option value="confirmed">Confirmed</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            {/* Payment Status Select */}
            <div>
              <label className="block text-[9px] font-bold uppercase tracking-wider text-[#8a8880] mb-2">
                Payment Status
              </label>
              <select
                value={paymentStatus}
                onChange={(e) => setPaymentStatus(e.target.value)}
                className="w-full h-11 bg-white border border-[#c8c7bf]/60 px-3 text-xs text-[#010100] focus:outline-none focus:border-[#010100] rounded-none cursor-pointer capitalize"
              >
                <option value="pending">Pending</option>
                <option value="paid">Paid</option>
                <option value="failed">Failed</option>
                <option value="refunded">Refunded</option>
              </select>
            </div>

            {/* Tracking Number Input */}
            <div>
              <label className="block text-[9px] font-bold uppercase tracking-wider text-[#8a8880] mb-2">
                Courier Tracking Number
              </label>
              <input
                type="text"
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
                placeholder="e.g. AWB987654321"
                className="w-full h-11 bg-white border border-[#c8c7bf]/60 px-3 text-xs text-[#010100] focus:outline-none focus:border-[#010100] rounded-none"
              />
            </div>

            <button
              type="submit"
              disabled={isUpdating}
              className="w-full h-11 bg-[#010100] hover:bg-[#c9a96e] text-white font-bold text-xs uppercase tracking-[0.15em] transition-colors rounded-none cursor-pointer disabled:opacity-50"
            >
              {isUpdating ? 'Saving Changes...' : 'Save Order Changes'}
            </button>
          </form>

          {/* Payment Gateway Meta Box */}
          <div className="bg-white border border-[#c8c7bf]/35 p-6 rounded-none shadow-sm space-y-3.5 text-xs">
            <h4 className="font-serif text-base font-semibold text-[#010100] border-b border-[#c8c7bf]/20 pb-3">
              Payment Gateway Meta
            </h4>
            <div className="space-y-2.5 pt-1">
              <div>
                <span className="text-[#8a8880] text-[9px] uppercase font-bold tracking-wider block">Razorpay Order ID</span>
                <span className="font-mono text-[#010100] font-bold block truncate bg-[#fdf8f7] p-2 border border-[#c8c7bf]/20 mt-1">
                  {order.razorpay_order_id || 'N/A (WhatsApp COD)'}
                </span>
              </div>
              <div>
                <span className="text-[#8a8880] text-[9px] uppercase font-bold tracking-wider block">Razorpay Payment ID</span>
                <span className="font-mono text-[#010100] font-bold block truncate bg-[#fdf8f7] p-2 border border-[#c8c7bf]/20 mt-1">
                  {order.razorpay_payment_id || 'N/A'}
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
