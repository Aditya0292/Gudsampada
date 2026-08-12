'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function QuickTrackSection(): React.JSX.Element {
  const [orderNumber, setOrderNumber] = useState('')
  const router = useRouter()

  const handleTrackSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!orderNumber.trim()) return
    const cleanNum = orderNumber.trim().toUpperCase()
    router.push(`/track-order?order=${encodeURIComponent(cleanNum)}`)
  }

  return (
    <section className="w-full bg-[#1C1C1A] text-white py-16 sm:py-20 border-t border-white/10 flex justify-center text-center">
      <div className="w-full max-w-2xl mx-auto px-4 sm:px-6 flex flex-col items-center text-center space-y-6">
        
        {/* Top Badge */}
        <div className="flex justify-center w-full">
          <span className="inline-block px-3.5 py-1 bg-gold/20 text-gold font-sans font-bold text-[10px] uppercase tracking-[0.25em] border border-gold/30">
            Order Status Center
          </span>
        </div>

        {/* Main Heading */}
        <h2 className="font-heading text-2xl sm:text-3xl font-bold text-[#F9F6F0] leading-tight text-center block w-full">
          Track Your Package Live
        </h2>

        {/* Description */}
        <p className="font-sans text-xs sm:text-sm text-white/70 max-w-md mx-auto text-center leading-relaxed block w-full">
          Already placed an order? Enter your Order Reference Number below to check real-time courier dispatch status.
        </p>

        {/* Centered Form */}
        <form onSubmit={handleTrackSubmit} className="w-full max-w-lg flex flex-col sm:flex-row gap-3 pt-2">
          <input
            type="text"
            required
            value={orderNumber}
            onChange={(e) => setOrderNumber(e.target.value)}
            placeholder="Enter Order Number (e.g. GS-2026-8492)"
            className="w-full sm:flex-1 h-12 bg-white/10 border border-white/20 px-4 text-xs sm:text-sm font-mono text-white placeholder-white/40 focus:outline-none focus:border-gold rounded-none uppercase text-center sm:text-left"
          />
          <button
            type="submit"
            className="w-full sm:w-auto h-12 bg-gold hover:bg-gold-light text-white font-sans font-bold text-xs uppercase tracking-[0.2em] px-8 rounded-none transition-all cursor-pointer shadow-sm flex items-center justify-center space-x-2 shrink-0"
          >
            <span>🔍</span>
            <span>Track Order</span>
          </button>
        </form>

      </div>
    </section>
  )
}
