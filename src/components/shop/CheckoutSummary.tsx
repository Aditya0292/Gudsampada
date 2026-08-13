'use client'

import React from 'react'
import Image from 'next/image'

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

const S = {
  sectionTitle: {
    fontFamily: 'Playfair Display, serif',
    fontSize: '22px',
    fontWeight: 500,
    color: '#010100',
    borderBottom: '1px solid rgba(200,193,182,0.45)',
    paddingBottom: '12px',
    marginBottom: '20px',
  },
  label: {
    fontSize: '11px',
    fontWeight: 600,
    letterSpacing: '0.04em',
    textTransform: 'uppercase' as const,
    color: '#8a8880',
    fontFamily: 'Outfit, sans-serif',
  }
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
    <div style={{ border: '1px solid rgba(200,193,182,0.5)', background: '#fff', padding: '32px', fontFamily: 'Outfit, sans-serif' }}>
      <h2 style={S.sectionTitle}>order summary</h2>

      {/* Cart Items List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxHeight: '300px', overflowY: 'auto', marginBottom: '24px' }}>
        {items.map((item) => (
          <div key={`${item.id}-${item.variantId}`} style={{ display: 'flex', alignItems: 'center', gap: '16px', paddingBottom: '16px', borderBottom: '1px solid rgba(200,193,182,0.25)' }}>
            <div style={{ position: 'relative', width: '48px', height: '60px', background: '#f5f0ef', border: '1px solid rgba(200,193,182,0.4)', flexShrink: 0 }}>
              <Image src={item.image} alt={item.name} fill className="object-contain p-1" sizes="48px" />
            </div>
            
            <div style={{ flex: 1, minWidth: 0 }}>
              <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: '15px', fontWeight: 500, color: '#010100', margin: '0 0 2px', lineHeight: 1.3 }}>
                {item.name}
              </h3>
              <span style={{ fontSize: '11px', color: '#8a8880', fontWeight: 600, textTransform: 'uppercase' }}>
                {item.variant} x {item.quantity}
              </span>
            </div>

            <span style={{ fontFamily: 'Playfair Display, serif', fontSize: '15px', fontWeight: 500, color: '#010100' }}>
              ₹{(item.price * item.quantity).toLocaleString('en-IN')}
            </span>
          </div>
        ))}
      </div>

      {/* Pricing breakdown */}
      <div style={{ borderTop: '1px solid rgba(200,193,182,0.4)', paddingTop: '20px', display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '13px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', color: '#474741' }}>
          <span>Subtotal (Item Price)</span>
          <span style={{ fontWeight: 600, color: '#010100' }}>₹{subtotal.toLocaleString('en-IN')}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', color: '#474741' }}>
          <span>Shipping &amp; Handling</span>
          <span style={{ fontWeight: 600, color: '#2E7D32' }}>
            {delivery === 0 ? 'Free Delivery' : `₹${delivery.toLocaleString('en-IN')}`}
          </span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', color: '#474741' }}>
          <span>Estimated GST (Included 5%)</span>
          <span style={{ fontWeight: 600, color: '#010100' }}>₹{estimatedTax.toLocaleString('en-IN')}</span>
        </div>

        {/* Total */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', borderTop: '1px solid rgba(200,193,182,0.4)', paddingTop: '16px', marginBottom: '8px' }}>
          <span style={{ ...S.label, color: '#010100' }}>Total</span>
          <span style={{ fontFamily: 'Playfair Display, serif', fontSize: '22px', fontWeight: 500, color: '#010100' }}>
            ₹{total.toLocaleString('en-IN')}
          </span>
        </div>
      </div>

      {/* Place Order CTA Block Button */}
      <button
        onClick={onPlaceOrder}
        disabled={isSubmitting || items.length === 0}
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
          opacity: isSubmitting || items.length === 0 ? 0.6 : 1,
          transition: 'opacity 0.15s',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          boxSizing: 'border-box',
          borderRadius: 0,
        }}
      >
        {paymentPreference === 'online' ? (
          <>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <rect x="2" y="5" width="20" height="14" rx="0" />
              <line x1="2" y1="10" x2="22" y2="10" />
            </svg>
            <span>Pay Online — ₹{total.toLocaleString('en-IN')}</span>
          </>
        ) : (
          <>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
            <span>Place Order via WhatsApp — ₹{total.toLocaleString('en-IN')}</span>
          </>
        )}
      </button>
    </div>
  )
}
