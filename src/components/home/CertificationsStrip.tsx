'use client'

import React from 'react'

const certs = [
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#c9a96e" strokeWidth="1.6">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <path d="m9 12 2 2 4-4" />
      </svg>
    ),
    title: 'FSSAI Certified',
    subtitle: 'Govt. Food Safety Verified',
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#c9a96e" strokeWidth="1.6">
        <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
      </svg>
    ),
    title: '100% Organic Sugarcane',
    subtitle: 'Sourced from natural Kolhapur soil',
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#c9a96e" strokeWidth="1.6">
        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4z" />
        <path d="M6 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2" />
      </svg>
    ),
    title: 'Ancestral Wood-Firing',
    subtitle: 'Heirloom iron vat slow cooking',
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#c9a96e" strokeWidth="1.6">
        <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" />
        <path d="m9 12 2 2 4-4" />
      </svg>
    ),
    title: 'Zero Chemical Additives',
    subtitle: 'No sulfur, no bleach, no white sugar',
  },
]

export default function CertificationsStrip() {
  return (
    <section style={{ background: '#fdf8f7', padding: '70px 0', borderTop: '1px solid rgba(200,193,182,0.4)', borderBottom: '1px solid rgba(200,193,182,0.4)' }}>
      <div className="container-main max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {certs.map((c, i) => (
            <div
              key={i}
              className="flex items-start gap-4 p-7 border border-[rgba(200,193,182,0.55)] bg-white rounded-none transition-all duration-300 hover:shadow-md"
              style={{
                fontFamily: 'Outfit, sans-serif',
                boxSizing: 'border-box',
              }}
            >
              {/* Icon box */}
              <div style={{ padding: '12px', background: '#fdf8f7', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, border: '1px solid rgba(200,193,182,0.25)' }}>
                {c.icon}
              </div>
              
              <div style={{ minWidth: 0, flex: 1, paddingTop: '2px' }}>
                <h4 style={{ fontFamily: 'Playfair Display, serif', fontSize: '17px', fontWeight: 500, color: '#010100', margin: '0 0 5px', lineHeight: 1.3 }}>
                  {c.title}
                </h4>
                <p style={{ fontSize: '12px', color: '#8a8880', margin: 0, lineHeight: 1.45 }}>
                  {c.subtitle}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
