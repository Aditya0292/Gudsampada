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

      setUpdateMessage({ type: 'success', text: 'Order status & tracking updated successfully!' })
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to update order'
      setUpdateMessage({ type: 'error', text: msg })
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
      setShipmentMsg({ type: 'success', text: `Shipment Created! AWB: ${data.awb_number}` })
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
      setShipmentMsg({ type: 'error', text: msg })
    } finally {
      setIsCreatingShipment(false)
    }
  }

  // Payment Identifiers Box
  return (
    <div className="space-y-6 sm:space-y-8 w-full">
      {/* Top Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <Link
          href="/admin/orders"
          className="text-xs font-sans text-molasses/70 hover:text-gold font-bold uppercase tracking-wider"
        >
          ← Back to Orders List
        </Link>
        <button
          onClick={handleCopyWhatsApp}
          className="inline-flex items-center justify-center bg-forest hover:bg-forest/90 text-white text-xs font-sans font-bold uppercase tracking-wider px-4 py-2.5 rounded-none transition-all gap-2 cursor-pointer w-full sm:w-auto"
        >
          <span>💬</span>
          <span>{copiedWhatsApp ? 'Copied to Clipboard! ✓' : 'Copy WhatsApp Message'}</span>
        </button>
      </div>

      {/* Main Order Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
        {/* Left Column (8 cols): Details & Items */}
        <div className="lg:col-span-8 space-y-6">
          {/* Order Details Header */}
          <div className="bg-white border border-[#1C1C1A]/15 p-4 sm:p-6 rounded-none shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#1C1C1A]/10 pb-3 gap-2">
              <div>
                <span className="text-[9px] font-sans font-bold uppercase tracking-[0.2em] text-[#8C7A6B] block mb-1">
                  Order Summary
                </span>
                <h2 className="font-mono text-xl sm:text-2xl font-bold text-[#1C1C1A]">{order.order_number}</h2>
              </div>
              <span className="text-xs font-serif text-molasses/60">
                Placed on {new Date(order.created_at).toLocaleString('en-IN')}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-sans">
              <div>
                <span className="text-molasses/50 uppercase text-[9px] font-bold block">Payment Status</span>
                <span className="font-bold capitalize text-[#1C1C1A]">{order.payment_status}</span>
              </div>
              <div>
                <span className="text-molasses/50 uppercase text-[9px] font-bold block">Fulfillment</span>
                <span className="font-bold capitalize text-[#1C1C1A]">{order.order_status}</span>
              </div>
              <div>
                <span className="text-molasses/50 uppercase text-[9px] font-bold block">Method</span>
                <span className="font-bold text-[#1C1C1A]">{order.checkout_method || 'Standard'}</span>
              </div>
              <div>
                <span className="text-molasses/50 uppercase text-[9px] font-bold block">Grand Total</span>
                <span className="font-mono font-bold text-gold text-sm">
                  ₹{Number(order.total || 0).toLocaleString('en-IN')}
                </span>
              </div>
            </div>
          </div>

          {/* Email Delivery Status Card */}
          <div className="bg-white border border-[#1C1C1A]/15 p-4 sm:p-6 rounded-none shadow-sm space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#1C1C1A]/10 pb-3">
              <div>
                <span className="text-[9px] font-sans font-bold uppercase tracking-[0.2em] text-[#8C7A6B] block">
                  Customer Email Notification
                </span>
                <h3 className="font-heading text-base font-bold text-[#1C1C1A]">Confirmation Email</h3>
              </div>
              <div className="flex items-center space-x-2">
                {order.customer_email ? (
                  order.email_sent ? (
                    <span className="px-2.5 py-1 bg-forest/15 text-forest border border-forest/30 font-bold text-[9px] uppercase tracking-wider">
                      Sent ✓ {order.email_sent_at ? `(${new Date(order.email_sent_at).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })})` : ''}
                    </span>
                  ) : (
                    <span className="px-2.5 py-1 bg-terracotta/15 text-terracotta border border-terracotta/30 font-bold text-[9px] uppercase tracking-wider">
                      Pending / Failed ❌
                    </span>
                  )
                ) : (
                  <span className="px-2.5 py-1 bg-gray-100 text-gray-600 border border-gray-300 font-bold text-[9px] uppercase tracking-wider">
                    No Email Provided
                  </span>
                )}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-sans">
              <span className="font-mono text-molasses/80">
                Recipient: <strong>{order.customer_email || 'None (Guest checkout phone only)'}</strong>
              </span>

              {order.customer_email && (
                <button
                  type="button"
                  onClick={handleResendEmail}
                  disabled={isResendingEmail}
                  className="bg-[#1C1C1A] hover:bg-gold text-white font-bold text-[10px] uppercase tracking-wider px-3.5 py-2 rounded-none transition-all cursor-pointer disabled:opacity-50"
                >
                  {isResendingEmail ? 'Sending Email...' : 'Resend Confirmation Email ✉️'}
                </button>
              )}
            </div>

            {emailStatusMsg && (
              <p className="text-xs font-sans font-bold text-[#1C1C1A] bg-[#F9F6F0] p-2 border border-[#1C1C1A]/10">
                {emailStatusMsg}
              </p>
            )}
          </div>

          {/* Itemized Products List */}
          <div className="bg-white border border-[#1C1C1A]/15 p-4 sm:p-6 rounded-none shadow-sm space-y-4">
            <h3 className="font-heading text-lg font-bold text-[#1C1C1A] border-b border-[#1C1C1A]/10 pb-2">
              Itemized Products ({order.items?.length || 0})
            </h3>
            <div className="divide-y divide-[#1C1C1A]/10 text-xs font-sans">
              {(order.items || []).map((item, idx) => (
                <div key={idx} className="py-3 flex items-center justify-between first:pt-0 last:pb-0 gap-2">
                  <div>
                    <p className="font-bold text-[#1C1C1A] text-sm">{item.name}</p>
                    <p className="text-molasses/60 text-[11px]">Size / Weight: {item.size || 'Standard'}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="font-mono font-bold text-[#1C1C1A]">
                      ₹{item.price} × {item.qty || 1} = ₹{((item.price || 0) * (item.qty || 1)).toLocaleString('en-IN')}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Price Breakdown */}
            <div className="border-t border-[#1C1C1A]/15 pt-4 space-y-2 text-xs font-sans text-[#1C1C1A]">
              <div className="flex justify-between text-molasses/70">
                <span>Subtotal</span>
                <span className="font-mono">₹{Number(order.subtotal || 0).toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-molasses/70">
                <span>Shipping Fee</span>
                <span className="font-mono">₹{Number(order.shipping_fee || 0).toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between font-bold text-sm text-[#1C1C1A] pt-2 border-t border-[#1C1C1A]/10">
                <span>Total Amount Paid / Payable</span>
                <span className="font-mono text-gold">₹{Number(order.total || 0).toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>

          {/* Customer & Shipping Information */}
          <div className="bg-white border border-[#1C1C1A]/15 p-4 sm:p-6 rounded-none shadow-sm space-y-4">
            <h3 className="font-heading text-lg font-bold text-[#1C1C1A] border-b border-[#1C1C1A]/10 pb-2">
              Customer & Shipping Info
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs font-sans">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-molasses/50 block mb-1">
                  Customer Contact
                </span>
                <p className="font-bold text-[#1C1C1A] text-sm">{order.customer_name}</p>
                <p className="font-mono text-molasses/80 mt-1">📞 {order.customer_phone}</p>
                {order.customer_email && <p className="text-molasses/70 mt-0.5">✉️ {order.customer_email}</p>}
              </div>

              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-molasses/50 block mb-1">
                  Shipping Address
                </span>
                <p className="text-[#1C1C1A] font-serif leading-relaxed">
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
          <div className="bg-white border border-[#1C1C1A]/15 p-4 sm:p-6 rounded-none shadow-sm space-y-4">
            <div className="border-b border-[#1C1C1A]/10 pb-2">
              <span className="text-[9px] font-sans font-bold uppercase tracking-[0.2em] text-[#8C7A6B] block">
                Courier Dispatch
              </span>
              <h3 className="font-heading text-lg font-bold text-[#1C1C1A]">Shiprocket Fulfillment</h3>
            </div>

            {shipmentMsg && (
              <div
                className={`p-3 text-xs font-sans rounded-none ${
                  shipmentMsg.type === 'success'
                    ? 'bg-forest/10 border border-forest/30 text-forest font-bold'
                    : 'bg-terracotta/10 border border-terracotta/30 text-terracotta font-bold'
                }`}
              >
                {shipmentMsg.text}
              </div>
            )}

            {order.shiprocket_order_id ? (
              <div className="space-y-2 text-xs font-sans">
                <div className="p-3 bg-[#F9F6F0] border border-[#1C1C1A]/15 space-y-1.5">
                  <div>
                    <span className="text-molasses/50 text-[9px] font-bold uppercase block">Shiprocket Order ID</span>
                    <span className="font-mono font-bold text-[#1C1C1A]">{order.shiprocket_order_id}</span>
                  </div>
                  <div>
                    <span className="text-molasses/50 text-[9px] font-bold uppercase block">AWB Tracking Number</span>
                    <span className="font-mono font-bold text-gold">{order.awb_number || 'Pending AWB Assignment'}</span>
                  </div>
                  {order.courier_name && (
                    <div>
                      <span className="text-molasses/50 text-[9px] font-bold uppercase block">Assigned Courier</span>
                      <span className="font-bold text-[#1C1C1A]">{order.courier_name}</span>
                    </div>
                  )}
                </div>

                {order.tracking_url && (
                  <a
                    href={order.tracking_url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center w-full bg-[#1C1C1A] hover:bg-gold text-white font-sans font-bold text-xs uppercase tracking-wider py-2.5 transition-all text-center rounded-none"
                  >
                    Track Shipment Live ↗
                  </a>
                )}
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-xs text-molasses/70 font-sans leading-relaxed">
                  Generate courier dispatch order with Shiprocket to assign AWB and track shipment progress.
                </p>
                <button
                  type="button"
                  onClick={handleCreateShipment}
                  disabled={isCreatingShipment}
                  className="w-full bg-[#1C1C1A] hover:bg-gold text-white font-sans font-bold text-xs uppercase tracking-[0.2em] py-3 rounded-none transition-all cursor-pointer disabled:opacity-50"
                >
                  {isCreatingShipment ? 'Generating Shipment...' : '📦 Create Shiprocket Shipment'}
                </button>
              </div>
            )}
          </div>

          <form onSubmit={handleUpdateOrder} className="bg-white border border-[#1C1C1A]/15 p-4 sm:p-6 rounded-none shadow-sm space-y-5">
            <h3 className="font-heading text-lg font-bold text-[#1C1C1A] border-b border-[#1C1C1A]/10 pb-2">
              Fulfillment Controls
            </h3>

            {updateMessage && (
              <div
                className={`p-3 text-xs font-sans rounded-none ${
                  updateMessage.type === 'success'
                    ? 'bg-forest/10 border border-forest/30 text-forest'
                    : 'bg-terracotta/10 border border-terracotta/30 text-terracotta'
                }`}
              >
                {updateMessage.text}
              </div>
            )}

            {/* Order Status Select */}
            <div>
              <label className="block text-[10px] font-sans font-bold uppercase tracking-[0.2em] text-[#8C7A6B] mb-2">
                Order Fulfillment Status
              </label>
              <select
                value={orderStatus}
                onChange={(e) => setOrderStatus(e.target.value)}
                className="w-full h-11 bg-[#F9F6F0] border border-[#1C1C1A]/20 px-3 text-xs font-sans text-[#1C1C1A] focus:outline-none focus:border-gold rounded-none cursor-pointer capitalize"
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
              <label className="block text-[10px] font-sans font-bold uppercase tracking-[0.2em] text-[#8C7A6B] mb-2">
                Payment Status
              </label>
              <select
                value={paymentStatus}
                onChange={(e) => setPaymentStatus(e.target.value)}
                className="w-full h-11 bg-[#F9F6F0] border border-[#1C1C1A]/20 px-3 text-xs font-sans text-[#1C1C1A] focus:outline-none focus:border-gold rounded-none cursor-pointer capitalize"
              >
                <option value="pending">Pending</option>
                <option value="paid">Paid</option>
                <option value="failed">Failed</option>
                <option value="refunded">Refunded</option>
              </select>
            </div>

            {/* Tracking Number Input */}
            <div>
              <label className="block text-[10px] font-sans font-bold uppercase tracking-[0.2em] text-[#8C7A6B] mb-2">
                Courier Tracking Number
              </label>
              <input
                type="text"
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
                placeholder="e.g. AWB987654321"
                className="w-full h-11 bg-[#F9F6F0] border border-[#1C1C1A]/20 px-3 text-xs font-sans text-[#1C1C1A] focus:outline-none focus:border-gold rounded-none"
              />
            </div>

            <button
              type="submit"
              disabled={isUpdating}
              className="w-full h-11 bg-[#1C1C1A] hover:bg-gold text-white font-sans font-bold text-xs uppercase tracking-[0.2em] transition-all rounded-none cursor-pointer disabled:opacity-50"
            >
              {isUpdating ? 'Saving Changes...' : 'Save Order Changes'}
            </button>
          </form>

          {/* Payment Identifiers Box */}
          <div className="bg-white border border-[#1C1C1A]/15 p-4 sm:p-6 rounded-none shadow-sm space-y-3 text-xs font-sans">
            <h4 className="font-bold uppercase tracking-wider text-[#8C7A6B] border-b border-[#1C1C1A]/10 pb-2">
              Payment Gateway Meta
            </h4>
            <div>
              <span className="text-molasses/50 text-[10px] uppercase font-bold block">Razorpay Order ID</span>
              <span className="font-mono text-[#1C1C1A] font-bold block truncate">
                {order.razorpay_order_id || 'N/A (WhatsApp COD)'}
              </span>
            </div>
            <div>
              <span className="text-molasses/50 text-[10px] uppercase font-bold block">Razorpay Payment ID</span>
              <span className="font-mono text-[#1C1C1A] font-bold block truncate">
                {order.razorpay_payment_id || 'N/A'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
