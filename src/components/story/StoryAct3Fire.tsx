'use client'

import { useRef, useState, useEffect } from 'react'
import Image from 'next/image'
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion'

export default function StoryAct3Fire() {
  const containerRef = useRef<HTMLDivElement>(null)
  const shouldReduceMotion = useReducedMotion()
  const [mounted, setMounted] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    setMounted(true)
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  })

  // Ember glow animation / background shift
  const glowOpacity = useTransform(scrollYProgress, [0.2, 0.6], [0.3, 0.7])
  const imageScale = useTransform(scrollYProgress, [0, 1], [1.0, 1.1])

  const narrationLines = [
    'sugarcane juice.',
    'boiled for hours.',
    'over an open wood fire.',
    'no shortcuts. no chemicals.',
  ]

  return (
    <section
      ref={containerRef}
      className="relative min-h-[130vh] bg-[#1C1410] text-cream flex items-center justify-center overflow-hidden py-24"
    >
      {/* Background Video with Ember Glow Shift */}
      <motion.div
        className="absolute inset-0 w-full h-full"
        style={{ scale: isMobile || shouldReduceMotion ? 1 : imageScale }}
      >
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover scale-[1.08] origin-top-left"
          poster="/images/women-woodfire-jaggery-making.png"
        >
          <source src="/videos/act3-fire.mp4" type="video/mp4" />
          <Image
            src="/images/women-woodfire-jaggery-making.png"
            alt="Kolhapur woman artisan carefully pouring golden sugarcane syrup into traditional wood-fired iron vat"
            fill
            className="object-cover"
            sizes="100vw"
          />
        </video>
        {/* Warm Amber / Fire Tint Scrim */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-[#2A1810]/70 to-[#1C1410] z-10" />

        {/* Ember Pulsing Light Effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-tr from-amber-600/30 via-gold/10 to-transparent z-10"
          style={{ opacity: isMobile || shouldReduceMotion ? 0.4 : glowOpacity }}
        />
      </motion.div>

      {/* Sequential Line-by-Line Narration */}
      <div className="container-main relative z-20 text-center max-w-3xl mx-auto px-4">
        <span className="text-[10px] font-sans font-bold uppercase tracking-[0.3em] text-gold block mb-8">
          Act III — The Fire
        </span>

        <div className="space-y-4 sm:space-y-6">
          {narrationLines.map((line, idx) => (
            <motion.h2
              key={line}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{
                duration: 0.8,
                delay: shouldReduceMotion ? 0 : idx * 0.35,
                ease: [0.16, 1, 0.3, 1],
              }}
              className={`font-heading text-3xl sm:text-5xl md:text-6xl ${
                idx === narrationLines.length - 1
                  ? 'text-gold font-normal italic'
                  : 'text-cream font-light'
              }`}
            >
              {line}
            </motion.h2>
          ))}
        </div>
      </div>
    </section>
  )
}
