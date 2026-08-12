'use client'

import React, { useState } from 'react'
import { B2BEnquiryType } from '@/types/supabase'
import Button from '@/components/ui/Button'

interface B2BEnquiryFormProps {
  activeType: B2BEnquiryType
}

export default function B2BEnquiryForm({ activeType }: B2BEnquiryFormProps): React.JSX.Element {
  const [companyName, setCompanyName] = useState('')
  const [contactName, setContactName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [city, setCity] = useState('')
  const [estimatedQuantity, setEstimatedQuantity] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatusMessage(null)

    if (!companyName || !contactName || !phone || !city) {
      setStatusMessage({ type: 'error', text: 'Please fill in all required fields.' })
      return
    }

    setLoading(true)

    try {
      const res = await fetch('/api/b2b-enquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          enquiry_type: activeType,
          company_name: companyName,
          contact_name: contactName,
          phone,
          email: email || undefined,
          city,
          estimated_quantity: estimatedQuantity || undefined,
          message: message || undefined,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit enquiry.')
      }

      setStatusMessage({
        type: 'success',
        text: data.message || 'Thank you for reaching out. Our team will contact you within 24 hours.',
      })

      // Reset form on success
      setCompanyName('')
      setContactName('')
      setPhone('')
      setEmail('')
      setCity('')
      setEstimatedQuantity('')
      setMessage('')
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Something went wrong. Please try again.'
      setStatusMessage({ type: 'error', text: errorMessage })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-[#F7F4EE] rounded-none p-6 md:p-10 shadow-none">
      {statusMessage ? (
        <div
          className={`p-6 rounded-none text-center ${
            statusMessage.type === 'success'
              ? 'bg-forest/10 border border-forest/30 text-forest'
              : 'bg-terracotta/10 border border-terracotta/30 text-terracotta'
          }`}
        >
          <span className="text-2xl block mb-2">{statusMessage.type === 'success' ? '📜' : '⚠️'}</span>
          <p className="font-serif text-lg font-medium mb-2">{statusMessage.text}</p>
          {statusMessage.type === 'success' && (
            <button
              onClick={() => setStatusMessage(null)}
              className="mt-4 text-xs font-sans font-bold uppercase tracking-widest text-molasses hover:text-gold underline cursor-pointer"
            >
              Submit Another Enquiry
            </button>
          )}
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Row 1: Company Name & Contact Person */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-[10px] font-sans font-bold uppercase tracking-[0.2em] text-[#2D241E]/70 mb-2 block">
                Company / Organization Name *
              </label>
              <input
                type="text"
                required
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="e.g. Mahalakshmi Temple Trust / Apex Organics"
                className="w-full rounded-none bg-white/60 border-none px-4 py-3.5 text-sm font-sans text-[#2D241E] focus:outline-none focus:ring-1 focus:ring-gold shadow-none"
              />
            </div>

            <div>
              <label className="text-[10px] font-sans font-bold uppercase tracking-[0.2em] text-[#2D241E]/70 mb-2 block">
                Contact Person Name *
              </label>
              <input
                type="text"
                required
                value={contactName}
                onChange={(e) => setContactName(e.target.value)}
                placeholder="e.g. Rajesh Shinde"
                className="w-full rounded-none bg-white/60 border-none px-4 py-3.5 text-sm font-sans text-[#2D241E] focus:outline-none focus:ring-1 focus:ring-gold shadow-none"
              />
            </div>
          </div>

          {/* Row 2: Phone Number & Email Address */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-[10px] font-sans font-bold uppercase tracking-[0.2em] text-[#2D241E]/70 mb-2 block">
                Phone Number *
              </label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98765 43210"
                className="w-full rounded-none bg-white/60 border-none px-4 py-3.5 text-sm font-sans text-[#2D241E] focus:outline-none focus:ring-1 focus:ring-gold shadow-none"
              />
            </div>

            <div>
              <label className="text-[10px] font-sans font-bold uppercase tracking-[0.2em] text-[#2D241E]/70 mb-2 block">
                Email Address (Optional)
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="b2b@company.com"
                className="w-full rounded-none bg-white/60 border-none px-4 py-3.5 text-sm font-sans text-[#2D241E] focus:outline-none focus:ring-1 focus:ring-gold shadow-none"
              />
            </div>
          </div>

          {/* Row 3: City / Region & Estimated Quantity */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-[10px] font-sans font-bold uppercase tracking-[0.2em] text-[#2D241E]/70 mb-2 block">
                City / Region *
              </label>
              <input
                type="text"
                required
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="e.g. Mumbai / Pune / Dubai"
                className="w-full rounded-none bg-white/60 border-none px-4 py-3.5 text-sm font-sans text-[#2D241E] focus:outline-none focus:ring-1 focus:ring-gold shadow-none"
              />
            </div>

            <div>
              <label className="text-[10px] font-sans font-bold uppercase tracking-[0.2em] text-[#2D241E]/70 mb-2 block">
                Estimated Monthly / Order Quantity
              </label>
              <input
                type="text"
                value={estimatedQuantity}
                onChange={(e) => setEstimatedQuantity(e.target.value)}
                placeholder="e.g. 500 kg / 2 Metric Tons"
                className="w-full rounded-none bg-white/60 border-none px-4 py-3.5 text-sm font-sans text-[#2D241E] focus:outline-none focus:ring-1 focus:ring-gold shadow-none"
              />
            </div>
          </div>

          {/* Row 4: Message / Special Requirements */}
          <div>
            <label className="text-[10px] font-sans font-bold uppercase tracking-[0.2em] text-[#2D241E]/70 mb-2 block">
              Message / Special Requirements
            </label>
            <textarea
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Tell us about your packaging, customized weight, or delivery timeline requirements..."
              className="w-full rounded-none bg-white/60 border-none px-4 py-3.5 text-sm font-sans text-[#2D241E] focus:outline-none focus:ring-1 focus:ring-gold shadow-none resize-none"
            />
          </div>

          {/* Blocky Structural Submit Button */}
          <Button
            type="submit"
            variant="primary"
            loading={loading}
            className="w-full py-6 sm:py-7 font-extrabold text-sm sm:text-base"
          >
            {loading ? 'Submitting Enquiry...' : 'Submit Partnership Enquiry →'}
          </Button>
        </form>
      )}
    </div>
  )
}
