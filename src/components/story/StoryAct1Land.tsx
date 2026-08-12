'use client'

import React, { useEffect, useState, useRef } from 'react'
import Image from 'next/image'
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion'

export default function StoryAct1Land(): React.JSX.Element {
  const containerRef = useRef<HTMLDivElement>(null)
  const shouldReduceMotion = useReducedMotion()
  const [isMobile, setIsMobile] = useState(false)

  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  })

  // Subtle parallax scale & drift
  const scale = useTransform(scrollYProgress, [0, 1], [1.15, 1.0])
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '15%'])
  const textOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0])
  const textY = useTransform(scrollYProgress, [0, 0.6], ['0px', '50px'])

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen h-[110vh] flex items-center justify-center overflow-hidden bg-molasses"
    >
      {/* Background Parallax Video / Image */}
      <motion.div
        className="absolute inset-0 w-full h-full"
        style={{
          scale: isMobile || shouldReduceMotion ? 1 : scale,
          y: isMobile || shouldReduceMotion ? 0 : y,
        }}
      >
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover scale-[1.08] origin-top-left"
          poster="/images/hero-sugarcane-farm.png"
        >
          <source src="/videos/act1-land.mp4" type="video/mp4" />
        </video>

        {/* Cinematic Scrim Overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-molasses z-10" />
      </motion.div>

      {/* Hero Narrative Text */}
      <motion.div
        className="container-main relative z-20 text-center max-w-4xl mx-auto px-4"
        style={{
          opacity: shouldReduceMotion ? 1 : textOpacity,
          y: shouldReduceMotion ? 0 : textY,
        }}
      >
        <motion.span
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-[10px] sm:text-xs font-sans font-bold uppercase tracking-[0.3em] text-gold block mb-4"
        >
          Act I — The Land
        </motion.span>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="font-heading text-4xl sm:text-6xl md:text-7xl font-light text-cream leading-[1.1] mb-6 tracking-tight"
        >
          before it is sweet, <br />
          <span className="italic font-normal text-amber-200">it is soil.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="font-serif text-base sm:text-xl text-cream/80 font-light max-w-2xl mx-auto leading-relaxed"
        >
          3rd generation farming in the black soil basins of Kolhapur, watered by the Panchganga.
        </motion.p>
      </motion.div>
    </section>
  )
}
