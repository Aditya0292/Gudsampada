'use client'

import { useState } from 'react'

export default function NewsletterCTA() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (email) {
      setSubmitted(true)
      setEmail('')
    }
  }

  return (
    <section style={{ background: '#1c1b1a', borderTop: '1px solid rgba(200,193,182,0.15)', borderBottom: '1px solid rgba(200,193,182,0.15)', padding: '36px 0' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 48px', boxSizing: 'border-box' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '32px', flexWrap: 'wrap' }}>
          
          {/* Left Text group */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
            <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '26px', fontWeight: 500, color: '#fff', margin: 0 }}>
              sweet updates<span style={{ color: '#c9a96e' }}>.</span>
            </h2>
            <span style={{ width: '1px', height: '20px', background: 'rgba(255,255,255,0.15)' }} />
            <p style={{ fontFamily: 'Outfit, sans-serif', fontSize: '13px', color: 'rgba(255,255,255,0.7)', margin: 0 }}>
              New products, limited batches, and early access. No spam.
            </p>
          </div>

          {/* Right Input Form */}
          <div style={{ flex: 1, maxWidth: '340px', minWidth: '260px' }}>
            {submitted ? (
              <div style={{ border: '1px solid rgba(201,169,110,0.3)', background: 'rgba(201,169,110,0.08)', padding: '8px 16px', color: '#c9a96e', fontSize: '12px', textAlign: 'center', fontFamily: 'Outfit, sans-serif' }}>
                You&apos;re subscribed!
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', alignItems: 'center', gap: '12px', width: '100%' }}>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  style={{
                    flex: 1,
                    border: 'none',
                    borderBottom: '1px solid rgba(255,255,255,0.3)',
                    background: 'transparent',
                    padding: '6px 0',
                    fontSize: '13px',
                    color: '#fff',
                    outline: 'none',
                    fontFamily: 'Outfit, sans-serif',
                    borderRadius: 0,
                  }}
                />
                <button
                  type="submit"
                  style={{
                    background: 'transparent',
                    border: 'none',
                    borderBottom: '1.5px solid #c9a96e',
                    color: '#c9a96e',
                    fontSize: '10px',
                    fontWeight: 700,
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    padding: '6px 0',
                    cursor: 'pointer',
                    fontFamily: 'Outfit, sans-serif',
                  }}
                >
                  SUBSCRIBE
                </button>
              </form>
            )}
          </div>

        </div>
      </div>
    </section>
  )
}
