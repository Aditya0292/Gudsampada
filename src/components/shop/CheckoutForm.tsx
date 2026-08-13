'use client'

import React from 'react'
import { CustomerDetails } from '@/lib/whatsapp/buildOrderMessage'

interface CheckoutFormProps {
  customer: CustomerDetails
  setCustomer: React.Dispatch<React.SetStateAction<CustomerDetails>>
  indianStates: string[]
}

const S = {
  sectionTitle: {
    fontFamily: 'Playfair Display, serif',
    fontSize: '24px',
    fontWeight: 500,
    color: '#010100',
    borderBottom: '1px solid rgba(200,193,182,0.45)',
    paddingBottom: '12px',
    marginBottom: '24px',
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

export default function CheckoutForm({
  customer,
  setCustomer,
  indianStates,
}: CheckoutFormProps): React.JSX.Element {
  const updateField = (field: keyof CustomerDetails, value: string) => {
    setCustomer((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '48px', fontFamily: 'Outfit, sans-serif' }}>
      
      {/* Section 1: Customer Contact */}
      <div>
        <h2 style={S.sectionTitle}>1. customer contact</h2>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label style={S.label}>Full Name *</label>
              <input
                type="text"
                required
                value={customer.name}
                onChange={(e) => updateField('name', e.target.value)}
                placeholder="e.g. Aditya Patil"
                style={S.input}
              />
            </div>
            <div>
              <label style={S.label}>Phone Number (WhatsApp) *</label>
              <input
                type="tel"
                required
                value={customer.phone}
                onChange={(e) => updateField('phone', e.target.value)}
                placeholder="e.g. 9876543210"
                style={S.input}
              />
            </div>
          </div>

          <div>
            <label style={S.label}>Email Address (Optional for Email Confirmation)</label>
            <input
              type="email"
              value={customer.email || ''}
              onChange={(e) => updateField('email', e.target.value)}
              placeholder="e.g. aditya@example.com"
              style={S.input}
            />
          </div>
        </div>
      </div>

      {/* Section 2: Delivery Address */}
      <div>
        <h2 style={S.sectionTitle}>2. delivery address</h2>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
          <div>
            <label style={S.label}>Street Address *</label>
            <input
              type="text"
              required
              value={customer.addressLine1}
              onChange={(e) => updateField('addressLine1', e.target.value)}
              placeholder="House/Flat No., Building Name, Street"
              style={S.input}
            />
          </div>

          <div>
            <label style={S.label}>Apartment, Suite, Unit etc. (Optional)</label>
            <input
              type="text"
              value={customer.addressLine2}
              onChange={(e) => updateField('addressLine2', e.target.value)}
              placeholder="Apartment, floor, landmark etc."
              style={S.input}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div>
              <label style={S.label}>City / Town *</label>
              <input
                type="text"
                required
                value={customer.city}
                onChange={(e) => updateField('city', e.target.value)}
                placeholder="e.g. Kolhapur"
                style={S.input}
              />
            </div>
            <div>
              <label style={S.label}>State *</label>
              <select
                value={customer.state}
                onChange={(e) => updateField('state', e.target.value)}
                style={{ ...S.input, cursor: 'pointer' }}
              >
                {indianStates.map((st) => (
                  <option key={st} value={st}>
                    {st}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label style={S.label}>Pincode *</label>
              <input
                type="text"
                required
                value={customer.pincode}
                onChange={(e) => updateField('pincode', e.target.value)}
                placeholder="e.g. 416001"
                style={S.input}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Section 3: Payment Method */}
      <div>
        <h2 style={S.sectionTitle}>3. payment method</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Online Payment */}
          <button
            type="button"
            onClick={() => updateField('paymentPreference', 'online')}
            style={{
              padding: '24px',
              border: customer.paymentPreference === 'online' ? '1.5px solid #1c1b1a' : '1px solid rgba(200,193,182,0.6)',
              background: customer.paymentPreference === 'online' ? '#fff' : 'transparent',
              textAlign: 'left',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              minHeight: '130px',
              borderRadius: 0,
              fontFamily: 'Outfit, sans-serif',
              boxSizing: 'border-box',
            }}
          >
            <div>
              <span style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: customer.paymentPreference === 'online' ? '#c9a96e' : '#8a8880', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <rect x="2" y="5" width="20" height="14" rx="0" />
                  <line x1="2" y1="10" x2="22" y2="10" />
                </svg>
                Instant Online Payment
              </span>
              <span style={{ fontSize: '12px', color: '#474741', lineHeight: 1.4 }}>
                Pay securely via Credit Card, Debit Card, UPI, Wallets, or Netbanking (Razorpay).
              </span>
            </div>
          </button>

          {/* WhatsApp Checkout */}
          <button
            type="button"
            onClick={() => updateField('paymentPreference', 'cod')}
            style={{
              padding: '24px',
              border: customer.paymentPreference === 'cod' ? '1.5px solid #1c1b1a' : '1px solid rgba(200,193,182,0.6)',
              background: customer.paymentPreference === 'cod' ? '#fff' : 'transparent',
              textAlign: 'left',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              minHeight: '130px',
              borderRadius: 0,
              fontFamily: 'Outfit, sans-serif',
              boxSizing: 'border-box',
            }}
          >
            <div>
              <span style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: customer.paymentPreference === 'cod' ? '#c9a96e' : '#8a8880', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
                WhatsApp Checkout (COD)
              </span>
              <span style={{ fontSize: '12px', color: '#474741', lineHeight: 1.4 }}>
                Review and finalize your order directly with our customer support team over WhatsApp.
              </span>
            </div>
          </button>
        </div>
      </div>

      {/* Section 4: Special Notes */}
      <div>
        <label style={S.label}>Order Notes (Optional)</label>
        <textarea
          rows={3}
          value={customer.notes}
          onChange={(e) => updateField('notes', e.target.value)}
          placeholder="Special delivery instructions, landmarks, packaging requests etc."
          style={{ ...S.input, resize: 'vertical' }}
        />
      </div>

    </div>
  )
}
