'use client'

import React from 'react'
import Image from 'next/image'
import Button from '@/components/ui/Button'

interface CartItem {
  id: string
  variantId: string
  name: string
  variant: string
  price: number
  quantity: number
  image: string
}

interface CheckoutSummaryProps {
  items: CartItem[]
  subtotal: number
  delivery: number
  estimatedTax: number
  total: number
  paymentPreference: 'online' | 'cod'
  isSubmitting: boolean
  onPlaceOrder: () => void
}

export default function CheckoutSummary({
  items,
  subtotal,
  delivery,
  estimatedTax,
  total,
  paymentPreference,
  isSubmitting,
  onPlaceOrder,
}: CheckoutSummaryProps): React.JSX.Element {
  return (
    <div className="border border-[#2D241E]/20 rounded-none p-6 md:p-8 bg-[#F7F4EE]/50 space-y-8">
      <h2 className="font-heading text-xl text-molasses lowercase tracking-tight border-b border-molasses/10 pb-3">
        order summary
      </h2>

      {/* Cart Items List */}
      <div className="divide-y divide-[#2D241E]/10 max-h-[300px] overflow-y-auto pr-1">
        {items.map((item) => (
          <div key={`${item.id}-${item.variantId}`} className="flex items-center space-x-4 py-4 first:pt-0 last:pb-0">
            <div className="relative w-12 h-15 bg-cream border border-[#2D241E]/10 rounded-none overflow-hidden flex-shrink-0">
              <Image src={item.image} alt={item.name} fill className="object-cover" sizes="48px" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-heading text-sm text-molasses leading-tight truncate">{item.name}</h3>
              <p className="text-[10px] font-sans text-molasses/50 uppercase tracking-wider mt-1">
                {item.variant} x {item.quantity}
              </p>
            </div>
            <span className="font-sans font-semibold text-sm text-molasses text-right">
              ₹{(item.price * item.quantity).toLocaleString('en-IN')}
            </span>
          </div>
        ))}
      </div>

      {/* Charge Breakdown */}
      <div className="border-t border-molasses/10 pt-6 space-y-3.5 text-sm">
        <div className="flex justify-between text-molasses-lighter">
          <span className="font-serif">Subtotal (Item Price)</span>
          <span className="font-sans font-semibold">₹{subtotal.toLocaleString('en-IN')}</span>
        </div>
        <div className="flex justify-between text-molasses-lighter">
          <span className="font-serif">Shipping & Handling</span>
          <span className="font-sans font-semibold text-forest">
            {delivery === 0 ? 'Free Delivery' : `₹${delivery.toLocaleString('en-IN')}`}
          </span>
        </div>
        <div className="flex justify-between text-molasses-lighter">
          <span className="font-serif">Estimated GST (Included 5%)</span>
          <span className="font-sans font-semibold">₹{estimatedTax.toLocaleString('en-IN')}</span>
        </div>

        {/* Grand Total */}
        <div className="flex justify-between items-center text-molasses border-t border-molasses/10 pt-4 text-base font-bold">
          <span className="font-serif">Total</span>
          <span className="font-sans text-lg">₹{total.toLocaleString('en-IN')}</span>
        </div>
      </div>

      {/* CTA Checkout Button */}
      <Button
        onClick={onPlaceOrder}
        disabled={isSubmitting || items.length === 0}
        variant="primary"
        loading={isSubmitting}
        className="w-full py-5 text-center flex items-center justify-center space-x-3 shadow-md"
        id="place-order-cta"
      >
        {paymentPreference === 'online' ? (
          <>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mr-1">
              <rect x="2" y="5" width="20" height="14" rx="2" />
              <line x1="2" y1="10" x2="22" y2="10" />
            </svg>
            <span>Pay Online (Razorpay) — ₹{total.toLocaleString('en-IN')}</span>
          </>
        ) : (
          <>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mr-1">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
            <span>Place Order via WhatsApp — ₹{total.toLocaleString('en-IN')}</span>
          </>
        )}
      </Button>
    </div>
  )
}
