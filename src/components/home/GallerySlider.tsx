'use client'

import { useRef, useEffect, useState } from 'react'
import Image from 'next/image'
import { motion, useScroll, useMotionValueEvent, useReducedMotion, AnimatePresence } from 'framer-motion'

const galleryItems = [
  {
    image: '/images/hero-sugarcane-farm.png',
    title: 'The Sugarcane Farms',
    desc: 'Located in the fertile black soil basins of Kolhapur, watered by the Panchganga river.',
    step: '01',
  },
  {
    image: '/images/jaggery-making-process.png',
    title: 'Traditional Wood Firing',
    desc: 'Reducing sugarcane juice in massive iron pans heated by burning bagasse.',
    step: '02',
  },
  {
    image: '/images/organic-sugarcane-jaggery.png',
    title: 'Liquid Gold Pouring',
    desc: 'Pouring the thickened organic syrup into clean wooden moulds to solidify naturally.',
    step: '03',
  },
  {
    image: '/images/jaggery-block.png',
    title: 'Pure Jaggery Blocks',
    desc: 'Solid blocks packed in gunny bags, completely free from sulfur and chemical clarification.',
    step: '04',
  },
]

export default function GallerySlider() {
  const containerRef = useRef<HTMLDivElement>(null)
  const isReduced = useReducedMotion()
  const [isMobile, setIsMobile] = useState(true)
  const [mounted, setMounted] = useState(false)
  const [activeStep, setActiveStep] = useState(0)

  useEffect(() => {
    setMounted(true)
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  })

  // Dynamically update active index as user scrolls through the 4 steps
  useMotionValueEvent(scrollYProgress, 'change', (latest) => {
    let nextStep = 0
    if (latest < 0.25) nextStep = 0
    else if (latest < 0.50) nextStep = 1
    else if (latest < 0.75) nextStep = 2
    else nextStep = 3

    if (nextStep !== activeStep) {
      setActiveStep(nextStep)
    }
  })

  // Sticky Scrollytelling Layout for Desktop (only if motion is enabled and mounted)
  if (mounted && !isMobile && !isReduced) {
    return (
      <div ref={containerRef} className="relative h-[320vh] bg-cream-dark/20">
        <div className="sticky top-0 h-screen w-full flex items-center overflow-hidden">
          <div className="container-main w-full grid grid-cols-12 gap-12 items-center">
            
            {/* Left Column - Pinned Image with Smooth Crossfade (6 Cols) */}
            <div className="col-span-6 relative aspect-[4/5] rounded-2xl overflow-hidden bg-cream-dark shadow-card">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeStep}
                  initial={{ opacity: 0, scale: 1.04 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute inset-0"
                >
                  <Image
                    src={galleryItems[activeStep].image}
                    alt={galleryItems[activeStep].title}
                    fill
                    className="object-cover"
                    priority
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Right Column - Single Active Text Block (Zero Overlap) & Step Counter (6 Cols) */}
            <div className="col-span-6 flex flex-col pl-8 relative min-h-[380px] justify-between">
              
              {/* Overline header */}
              <div>
                <span className="overline text-[10px] tracking-[0.25em]">Our Farm Operations</span>
                <h2 className="font-heading text-4xl md:text-[3.25rem] font-light text-molasses leading-tight lowercase mt-2">
                  the <span className="italic font-normal text-gold">journey</span> of pure gold.
                </h2>
              </div>

              {/* Single Active Text Content with AnimatePresence mode="wait" - ZERO SUPERIMPOSITION */}
              <div className="relative my-8 min-h-[180px] flex items-center">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeStep}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    className="flex flex-col space-y-3"
                  >
                    <span className="font-heading text-6xl text-gold/35 font-light select-none leading-none">
                      {galleryItems[activeStep].step}
                    </span>
                    <h3 className="font-heading text-2xl md:text-3xl text-molasses lowercase">
                      {galleryItems[activeStep].title}
                    </h3>
                    <p className="text-molasses-light text-base font-serif font-light leading-relaxed max-w-md">
                      {galleryItems[activeStep].desc}
                    </p>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Bottom Numbers Row (01, 02, 03, 04) - Active Number Shifts on Scroll */}
              <div className="flex items-center gap-8 pt-6 border-t border-molasses/10">
                {galleryItems.map((item, idx) => {
                  const isActive = activeStep === idx
                  return (
                    <button
                      key={item.step}
                      onClick={() => {
                        if (!containerRef.current) return
                        const targetPos = containerRef.current.offsetTop + (idx / 3) * (containerRef.current.offsetHeight - window.innerHeight)
                        window.scrollTo({ top: targetPos, behavior: 'smooth' })
                      }}
                      className="flex flex-col items-center gap-1 group cursor-pointer"
                      aria-label={`Jump to step ${item.step}`}
                    >
                      <span
                        className={`font-sans text-sm font-bold tracking-wider transition-all duration-300 ${
                          isActive ? 'text-gold scale-110' : 'text-molasses/30 group-hover:text-molasses/60'
                        }`}
                      >
                        {item.step}
                      </span>
                      <div
                        className={`h-0.5 rounded-full transition-all duration-300 ${
                          isActive ? 'w-6 bg-gold' : 'w-0 bg-transparent'
                        }`}
                      />
                    </button>
                  )
                })}
              </div>

            </div>
          </div>
        </div>
      </div>
    )
  }

  // Graceful Static Fallback for Mobile and prefers-reduced-motion
  return (
    <section className="py-24 bg-white overflow-hidden border-t border-border">
      <div className="container-main">
        <div className="mb-12 flex flex-col space-y-2">
          <span className="overline text-[10px] tracking-[0.25em]">Our Farm Operations</span>
          <h2 className="font-heading text-4xl md:text-[3.25rem] font-light text-molasses leading-tight lowercase">
            the <span className="italic font-normal">journey</span> of pure gold, from root to block.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {galleryItems.map((item, index) => (
            <div key={index} className="flex flex-col">
              <div className="relative aspect-[4/5] rounded-xl overflow-hidden bg-cream-dark mb-4 shadow-xs">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 25vw"
                />
              </div>
              <div className="flex items-baseline gap-2 mb-1">
                <span className="font-serif text-sm italic text-gold">{item.step}</span>
                <h3 className="font-heading text-lg md:text-xl text-molasses lowercase">
                  {item.title}
                </h3>
              </div>
              <p className="text-molasses-lighter text-xs md:text-sm leading-relaxed font-serif font-light">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
