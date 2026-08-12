'use client'

import React from 'react'

const certs = [
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6 text-gold">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <path d="m9 12 2 2 4-4" />
      </svg>
    ),
    title: 'FSSAI Certified',
    subtitle: 'Govt. Food Safety Verified',
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6 text-gold">
        <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
      </svg>
    ),
    title: '100% Organic Sugarcane',
    subtitle: 'Sourced from natural Kolhapur soil',
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6 text-gold">
        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4z" />
        <path d="M6 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2" />
      </svg>
    ),
    title: 'Ancestral Wood-Firing',
    subtitle: 'Heirloom iron vat slow cooking',
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6 text-gold">
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
    <section className="py-16 md:py-20 bg-[#F7F4EE] border-y border-[#2D241E]/10">
      <div className="container-main">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {certs.map((c, i) => (
            <div
              key={i}
              className="flex items-start gap-4 p-6 rounded-none bg-cream h-full justify-between transition-all duration-300 shadow-sm hover:shadow-md hover:-translate-y-1"
            >
              <div className="p-2.5 rounded-none bg-gold/10 flex-shrink-0 text-gold">
                {c.icon}
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="font-serif text-base font-normal text-molasses leading-snug tracking-tight mb-1.5 break-words">
                  {c.title}
                </h4>
                <p className="text-xs font-sans text-[#2D241E]/70 leading-relaxed break-words">
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
