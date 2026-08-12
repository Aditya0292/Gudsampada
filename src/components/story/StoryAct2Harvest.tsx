'use client'

import { useRef, useState, useEffect } from 'react'
import Image from 'next/image'
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion'

export default function StoryAct2Harvest() {
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
    offset: ['start end', 'end start'],
  })

  // Alternating slide-in transforms
  const leftX = useTransform(scrollYProgress, [0.1, 0.4], ['-40px', '0px'])
  const rightX = useTransform(scrollYProgress, [0.1, 0.4], ['40px', '0px'])
  const opacity = useTransform(scrollYProgress, [0.1, 0.4], [0, 1])

  const stats = [
    { value: '3rd', label: 'Generation Farmers' },
    { value: '50+', label: 'Years of Heritage' },
    { value: '100%', label: 'Natural Sugarcane' },
  ]

  return (
    <section
      ref={containerRef}
      className="py-24 md:py-36 bg-[#F7F4EE] border-t border-molasses/10 min-h-screen overflow-hidden flex items-center"
    >
      <div className="container-main max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-[10px] font-sans font-bold uppercase tracking-[0.25em] text-gold block mb-2">
            Act II — The Harvest
          </span>
          <h2 className="font-heading text-3xl sm:text-5xl font-light text-molasses leading-tight">
            cut by hand. <br />
            <span className="italic font-normal">as it has always been.</span>
          </h2>
        </div>

        {/* Split Image Composition */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-center mb-16">
          {/* Left Card: Sugarcane Cutting by Hand */}
          <motion.div
            className="col-span-1 md:col-span-6 relative aspect-[4/5] rounded-none overflow-hidden border border-molasses/20 bg-cream-dark shadow-md"
            style={{
              x: isMobile || shouldReduceMotion ? 0 : leftX,
              opacity: 1,
            }}
          >
            <Image
              src="/images/sugarcane-cutting.png"
              alt="Farmer hands cutting fresh sugarcane stalks by hand in Kolhapur field"
              fill
              loading="eager"
              className="object-cover transition-transform duration-700 hover:scale-105"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </motion.div>

          {/* Right Card: Sugarcane Bundling & Collecting */}
          <motion.div
            className="col-span-1 md:col-span-6 relative aspect-[4/5] rounded-none overflow-hidden border border-molasses/20 bg-cream-dark shadow-md"
            style={{
              x: isMobile || shouldReduceMotion ? 0 : rightX,
              opacity: 1,
            }}
          >
            <Image
              src="/images/sugarcane-collecting.png"
              alt="Farmers bundling and collecting freshly harvested sugarcane stalks in Kolhapur"
              fill
              loading="eager"
              className="object-cover transition-transform duration-700 hover:scale-105"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </motion.div>
        </div>

        {/* Staggered Stats Callouts */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 pt-8 border-t border-molasses/10 text-center">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.6, delay: i * 0.2 }}
            >
              <p className="font-serif text-3xl sm:text-4xl text-molasses font-normal mb-1">
                {stat.value}
              </p>
              <p className="text-molasses/60 text-[10px] font-sans font-bold uppercase tracking-[0.2em]">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
