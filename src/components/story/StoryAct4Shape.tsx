'use client'

import { useRef } from 'react'
import Image from 'next/image'
import { motion, useReducedMotion } from 'framer-motion'

export default function StoryAct4Shape() {
  const containerRef = useRef<HTMLDivElement>(null)
  const shouldReduceMotion = useReducedMotion()

  return (
    <section
      ref={containerRef}
      className="relative min-h-[100vh] bg-molasses text-cream flex items-center justify-center overflow-hidden py-24"
    >
      <div className="container-main max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left: Video Photo Frame Box */}
        <div className="lg:col-span-6 relative aspect-square w-full rounded-none overflow-hidden border border-cream/20 shadow-2xl bg-[#1C1410]">
          <video
            autoPlay
            loop
            muted
            playsInline
            preload="none"
            className="w-full h-full object-cover scale-[1.08] origin-top-left"
            poster="/images/jaggery-block.png"
          >
            <source src="/videos/act4-shape.mp4" type="video/mp4" />
          </video>
        </div>

        {/* Right: Narrative Text */}
        <div className="lg:col-span-6 text-center lg:text-left space-y-6">
          <span className="text-[10px] font-sans font-bold uppercase tracking-[0.3em] text-gold block">
            Act IV — The Shape
          </span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="font-heading text-4xl sm:text-6xl font-light text-cream leading-tight"
          >
            and then — <br />
            <span className="italic font-normal text-gold">it becomes gold.</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="font-serif text-base sm:text-lg text-cream/70 font-light leading-relaxed max-w-md"
          >
            Poured into cooling wooden frames without chemical hardeners, setting slowly under Kolhapur breezes.
          </motion.p>
        </div>
      </div>
    </section>
  )
}
