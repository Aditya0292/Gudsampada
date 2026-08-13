'use client'

import React, { useState } from 'react'
import { B2BEnquiryType } from '@/types/supabase'

interface B2BEnquiryFormProps {
  activeType: B2BEnquiryType
}

const S = {
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
    <div className="p-5 sm:p-8 md:px-12 md:py-10" style={{ border: '1px solid rgba(200,193,182,0.5)', background: '#fff', fontFamily: 'Outfit, sans-serif' }}>
      {statusMessage ? (
        <div
          style={{
            padding: '24px',
            textAlign: 'center',
            background: statusMessage.type === 'success' ? 'rgba(46,125,50,0.08)' : 'rgba(186,26,26,0.08)',
            border: statusMessage.type === 'success' ? '1px solid rgba(46,125,50,0.3)' : '1px solid rgba(186,26,26,0.3)',
            color: statusMessage.type === 'success' ? '#2E7D32' : '#ba1a1a',
          }}
        >
          <span style={{ fontSize: '24px', display: 'block', marginBottom: '8px' }}>{statusMessage.type === 'success' ? '📜' : '⚠️'}</span>
          <p style={{ fontFamily: 'Playfair Display, serif', fontSize: '18px', fontWeight: 500, margin: '0 0 12px' }}>{statusMessage.text}</p>
          {statusMessage.type === 'success' && (
            <button
              onClick={() => setStatusMessage(null)}
              style={{ background: 'none', border: 'none', fontSize: '11px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#010100', textDecoration: 'underline', cursor: 'pointer' }}
            >
              Submit Another Enquiry
            </button>
          )}
        </div>
      ) : (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
          
          {/* Row 1 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
            <div>
              <label style={S.label}>Company / Organization Name *</label>
              <input
                type="text"
                required
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="e.g. Mahalakshmi Temple Trust / Apex Organics"
                style={S.input}
              />
            </div>
            <div>
              <label style={S.label}>Contact Person Name *</label>
              <input
                type="text"
                required
                value={contactName}
                onChange={(e) => setContactName(e.target.value)}
                placeholder="e.g. Rajesh Shinde"
                style={S.input}
              />
            </div>
          </div>

          {/* Row 2 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
            <div>
              <label style={S.label}>Phone Number *</label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98765 43210"
                style={S.input}
              />
            </div>
            <div>
              <label style={S.label}>Email Address (Optional)</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="b2b@company.com"
                style={S.input}
              />
            </div>
          </div>

          {/* Row 3 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
            <div>
              <label style={S.label}>City / Region *</label>
              <input
                type="text"
                required
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="e.g. Mumbai / Pune / Dubai"
                style={S.input}
              />
            </div>
            <div>
              <label style={S.label}>Estimated Monthly / Order Quantity</label>
              <input
                type="text"
                value={estimatedQuantity}
                onChange={(e) => setEstimatedQuantity(e.target.value)}
                placeholder="e.g. 500 kg / 2 Metric Tons"
                style={S.input}
              />
            </div>
          </div>

          {/* Row 4 */}
          <div>
            <label style={S.label}>Message / Special Requirements</label>
            <textarea
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Tell us about your packaging, customized weight, or delivery timeline requirements..."
              style={{ ...S.input, resize: 'vertical' }}
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              background: '#1c1b1a',
              color: '#fff',
              border: 'none',
              padding: '18px',
              fontSize: '14px',
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
            {loading ? 'Submitting Enquiry...' : 'Submit Partnership Enquiry →'}
          </button>
        </form>
      )}
    </div>
  )
}
