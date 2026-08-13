'use client'

import { useRef, useEffect, useState } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'

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
  const [activeStep, setActiveStep] = useState(0)
  const [isMobile, setIsMobile] = useState(true)
  const [mounted, setMounted] = useState(false)

  const stepRef0 = useRef<HTMLDivElement>(null)
  const stepRef1 = useRef<HTMLDivElement>(null)
  const stepRef2 = useRef<HTMLDivElement>(null)
  const stepRef3 = useRef<HTMLDivElement>(null)

  const stepRefs = [stepRef0, stepRef1, stepRef2, stepRef3]

  useEffect(() => {
    setMounted(true)
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Intersection Observer to track active step based on scroll visibility of text blocks
  useEffect(() => {
    if (!mounted || isMobile) return

    const observerOptions = {
      root: null,
      rootMargin: '-35% 0px -35% 0px', // Trigger when item enters center 30% of viewport
      threshold: 0.1,
    }

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const index = Number(entry.target.getAttribute('data-step-index'))
          if (!isNaN(index)) {
            setActiveStep(index)
          }
        }
      })
    }

    const observer = new IntersectionObserver(observerCallback, observerOptions)
    
    stepRefs.forEach((ref) => {
      if (ref.current) {
        observer.observe(ref.current)
      }
    })

    return () => {
      stepRefs.forEach((ref) => {
        if (ref.current) {
          observer.unobserve(ref.current)
        }
      })
    }
  }, [mounted, isMobile])

  const scrollToStep = (idx: number) => {
    const ref = stepRefs[idx]
    if (ref && ref.current) {
      ref.current.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }

  if (!mounted) {
    return (
      <section className="py-24 bg-white border-t border-border">
        <div className="container-main">
          <div className="w-full h-[400px] bg-cream-dark/10" />
        </div>
      </section>
    )
  }

  // Sticky Scrollytelling Layout for Desktop (Intersection Observer driven)
  if (!isMobile) {
    return (
      <section className="bg-cream-dark/5 py-24 border-t border-border relative">
        <div className="container-main">
          <div className="grid grid-cols-12 gap-16 items-start">
            
            {/* Left Column - Sticky Image Box (6 Cols) */}
            <div className="col-span-6 sticky top-[15vh] h-[70vh] rounded-none overflow-hidden bg-cream-dark shadow-md">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeStep}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                  className="absolute inset-0"
                >
                  <Image
                    src={galleryItems[activeStep].image}
                    alt={galleryItems[activeStep].title}
                    fill
                    className="object-cover"
                    priority
                    sizes="50vw"
                  />
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Right Column - Scrolling Text Blocks (6 Cols) */}
            <div className="col-span-6 flex flex-col pl-8">
              
              {/* Header block */}
              <div className="mb-16">
                <span className="overline text-[10px] tracking-[0.25em]">Our Farm Operations</span>
                <h2 className="font-heading text-4xl md:text-[3.25rem] font-light text-molasses leading-tight lowercase mt-2">
                  the <span className="italic font-normal text-gold">journey</span> of pure gold.
                </h2>
              </div>

              {/* Scrolling Text Blocks with generous breathing space */}
              <div className="space-y-[30vh] pb-[20vh]">
                {galleryItems.map((item, idx) => (
                  <div
                    key={item.step}
                    ref={stepRefs[idx]}
                    data-step-index={idx}
                    className="min-h-[40vh] flex flex-col justify-center pt-8"
                    style={{ fontFamily: 'Outfit, sans-serif' }}
                  >
                    <span className="font-heading text-6xl text-gold/35 font-light select-none leading-none mb-3">
                      {item.step}
                    </span>
                    <h3 className="font-heading text-2xl md:text-3xl text-molasses lowercase mb-3" style={{ fontFamily: 'Playfair Display, serif' }}>
                      {item.title}
                    </h3>
                    <p className="text-molasses-light text-base font-serif font-light leading-relaxed max-w-md">
                      {item.desc}
                    </p>
                  </div>
                ))}
              </div>

              {/* Floating Bottom Numbers Row (01, 02, 03, 04) */}
              <div className="sticky bottom-8 bg-[#F9F6F0]/90 backdrop-blur-xs py-4 border-t border-molasses/10 flex items-center gap-8 z-10 w-full">
                {galleryItems.map((item, idx) => {
                  const isActive = activeStep === idx
                  return (
                    <button
                      key={item.step}
                      onClick={() => scrollToStep(idx)}
                      className="flex flex-col items-center gap-1 group cursor-pointer bg-transparent border-none p-0"
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
                        className={`h-0.5 rounded-none transition-all duration-300 ${
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
      </section>
    )
  }

  // Graceful Static Fallback for Mobile
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
              <div className="relative aspect-[4/5] rounded-none overflow-hidden bg-cream-dark mb-4 shadow-xs">
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
