'use client'

import React from 'react'
import { CustomerDetails } from '@/lib/whatsapp/buildOrderMessage'

interface CheckoutFormProps {
  customer: CustomerDetails
  setCustomer: React.Dispatch<React.SetStateAction<CustomerDetails>>
  indianStates: string[]
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
    <div className="space-y-8">
      {/* Section 1: Customer Details */}
      <div className="space-y-6">
        <h2 className="font-heading text-xl text-molasses lowercase tracking-tight border-b border-molasses/10 pb-3">
          1. customer contact
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="text-[10px] font-sans font-bold uppercase tracking-[0.2em] text-[#2D241E]/70 mb-2 block">
              Full Name *
            </label>
            <input
              type="text"
              required
              value={customer.name}
              onChange={(e) => updateField('name', e.target.value)}
              placeholder="e.g. Aditya Patil"
              className="w-full h-11 rounded-none bg-transparent border border-[#2D241E]/30 px-4 text-base font-sans text-[#2D241E] focus:outline-none focus:border-gold shadow-none"
            />
          </div>
          <div>
            <label className="text-[10px] font-sans font-bold uppercase tracking-[0.2em] text-[#2D241E]/70 mb-2 block">
              Phone Number (WhatsApp) *
            </label>
            <input
              type="tel"
              required
              value={customer.phone}
              onChange={(e) => updateField('phone', e.target.value)}
              placeholder="e.g. 9876543210"
              className="w-full h-11 rounded-none bg-transparent border border-[#2D241E]/30 px-4 text-base font-sans text-[#2D241E] focus:outline-none focus:border-gold shadow-none"
            />
          </div>
        </div>

        <div>
          <label className="text-[10px] font-sans font-bold uppercase tracking-[0.2em] text-[#2D241E]/70 mb-2 block">
            Email Address (Optional for Email Confirmation)
          </label>
          <input
            type="email"
            value={customer.email || ''}
            onChange={(e) => updateField('email', e.target.value)}
            placeholder="e.g. aditya@example.com"
            className="w-full h-11 rounded-none bg-transparent border border-[#2D241E]/30 px-4 text-sm font-sans text-[#2D241E] focus:outline-none focus:border-gold shadow-none"
          />
        </div>
      </div>

      {/* Section 2: Shipping Address */}
      <div className="space-y-6">
        <h2 className="font-heading text-xl text-molasses lowercase tracking-tight border-b border-molasses/10 pb-3">
          2. delivery address
        </h2>
        <div className="space-y-6">
          <div>
            <label className="text-[10px] font-sans font-bold uppercase tracking-[0.2em] text-[#2D241E]/70 mb-2 block">
              Street Address *
            </label>
            <input
              type="text"
              required
              value={customer.addressLine1}
              onChange={(e) => updateField('addressLine1', e.target.value)}
              placeholder="House/Flat No., Building Name, Street"
              className="w-full h-11 rounded-none bg-transparent border border-[#2D241E]/30 px-4 text-base font-sans text-[#2D241E] focus:outline-none focus:border-gold shadow-none"
            />
          </div>
          <div>
            <label className="text-[10px] font-sans font-bold uppercase tracking-[0.2em] text-[#2D241E]/70 mb-2 block">
              Apartment, Suite, Unit etc. (Optional)
            </label>
            <input
              type="text"
              value={customer.addressLine2}
              onChange={(e) => updateField('addressLine2', e.target.value)}
              placeholder="Apartment, floor, landmark etc."
              className="w-full h-11 rounded-none bg-transparent border border-[#2D241E]/30 px-4 text-base font-sans text-[#2D241E] focus:outline-none focus:border-gold shadow-none"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div>
              <label className="text-[10px] font-sans font-bold uppercase tracking-[0.2em] text-[#2D241E]/70 mb-2 block">
                City / Town *
              </label>
              <input
                type="text"
                required
                value={customer.city}
                onChange={(e) => updateField('city', e.target.value)}
                placeholder="e.g. Kolhapur"
                className="w-full h-11 rounded-none bg-transparent border border-[#2D241E]/30 px-4 text-base font-sans text-[#2D241E] focus:outline-none focus:border-gold shadow-none"
              />
            </div>
            <div>
              <label className="text-[10px] font-sans font-bold uppercase tracking-[0.2em] text-[#2D241E]/70 mb-2 block">
                State *
              </label>
              <select
                value={customer.state}
                onChange={(e) => updateField('state', e.target.value)}
                className="w-full h-11 rounded-none bg-cream border border-[#2D241E]/30 px-3 text-base font-sans text-[#2D241E] focus:outline-none focus:border-gold cursor-pointer"
              >
                {indianStates.map((st) => (
                  <option key={st} value={st}>
                    {st}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-[10px] font-sans font-bold uppercase tracking-[0.2em] text-[#2D241E]/70 mb-2 block">
                Pincode *
              </label>
              <input
                type="text"
                required
                value={customer.pincode}
                onChange={(e) => updateField('pincode', e.target.value)}
                placeholder="e.g. 416001"
                className="w-full h-11 rounded-none bg-transparent border border-[#2D241E]/30 px-4 text-base font-sans text-[#2D241E] focus:outline-none focus:border-gold shadow-none"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Section 3: Payment Preference */}
      <div className="space-y-6">
        <h2 className="font-heading text-xl text-molasses lowercase tracking-tight border-b border-molasses/10 pb-3">
          3. payment method
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Online Payment Option */}
          <button
            type="button"
            onClick={() => updateField('paymentPreference', 'online')}
            className={`p-5 rounded-none border text-left transition-all duration-300 cursor-pointer flex flex-col justify-between min-h-[110px] ${
              customer.paymentPreference === 'online'
                ? 'bg-[#2D241E] text-cream border-[#2D241E]'
                : 'bg-transparent text-[#2D241E] border-[#2D241E]/20 hover:border-gold/60'
            }`}
          >
            <div className="w-full">
              <span className="text-[11px] font-sans font-bold uppercase tracking-[0.18em] block mb-2 leading-snug flex items-center gap-2">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="2" y="5" width="20" height="14" rx="2" />
                  <line x1="2" y1="10" x2="22" y2="10" />
                </svg>
                Instant Online Payment
              </span>
              <span className={`text-[11px] font-sans leading-relaxed block ${
                customer.paymentPreference === 'online' ? 'text-cream/80' : 'text-[#2D241E]/70'
              }`}>
                Pay securely via Credit Card, Debit Card, UPI, Wallets, or Netbanking (Razorpay).
              </span>
            </div>
          </button>

          {/* WhatsApp COD Option */}
          <button
            type="button"
            onClick={() => updateField('paymentPreference', 'cod')}
            className={`p-5 rounded-none border text-left transition-all duration-300 cursor-pointer flex flex-col justify-between min-h-[110px] ${
              customer.paymentPreference === 'cod'
                ? 'bg-[#2D241E] text-cream border-[#2D241E]'
                : 'bg-transparent text-[#2D241E] border-[#2D241E]/20 hover:border-gold/60'
            }`}
          >
            <div className="w-full">
              <span className="text-[11px] font-sans font-bold uppercase tracking-[0.18em] block mb-2 leading-snug flex items-center gap-2">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
                WhatsApp Checkout (COD)
              </span>
              <span className={`text-[11px] font-sans leading-relaxed block ${
                customer.paymentPreference === 'cod' ? 'text-cream/80' : 'text-[#2D241E]/70'
              }`}>
                Review and finalize your order directly with our customer support team over WhatsApp.
              </span>
            </div>
          </button>
        </div>
      </div>

      {/* Section 4: Special Notes */}
      <div className="space-y-4">
        <label className="text-[10px] font-sans font-bold uppercase tracking-[0.2em] text-[#2D241E]/70 mb-1 block">
          Order Notes (Optional)
        </label>
        <textarea
          rows={3}
          value={customer.notes}
          onChange={(e) => updateField('notes', e.target.value)}
          placeholder="Special delivery instructions, landmarks, packaging requests etc."
          className="w-full rounded-none bg-transparent border border-[#2D241E]/30 p-4 text-base font-sans text-[#2D241E] focus:outline-none focus:border-gold shadow-none resize-none"
        />
      </div>
    </div>
  )
}
