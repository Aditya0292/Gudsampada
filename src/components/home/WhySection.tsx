'use client'

import Image from 'next/image'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import AnimatedSection from '@/components/ui/AnimatedSection'
import SectionHeading from '@/components/ui/SectionHeading'

// Clean line icons with zero circular boundaries
const icons = {
  organic: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#c9a96e" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22V12" />
      <path d="M12 12c-2.5 0-5-2-5-4.5s2.5-4.5 5-4.5" />
      <path d="M12 12c2.5 0 5-2 5-4.5S14.5 3 12 3" />
      <path d="m7 12 5-3 5 3" />
    </svg>
  ),
  ginger: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#c9a96e" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2v4" />
      <path d="M12 18v4" />
      <path d="M4.93 4.93l2.83 2.83" />
      <path d="M16.24 16.24l2.83 2.83" />
      <path d="M2 12h4" />
      <path d="M18 12h4" />
      <path d="M19.07 4.93l-2.83 2.83" />
      <path d="M7.76 16.24l-2.83 2.83" />
    </svg>
  ),
  sugarfree: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#c9a96e" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  ),
  woodfire: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#c9a96e" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
    </svg>
  ),
  minerals: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#c9a96e" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
      <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
      <line x1="12" y1="22.08" x2="12" y2="12" />
    </svg>
  ),
  digestive: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#c9a96e" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 5v14" />
      <path d="m19 12-7 7-7-7" />
    </svg>
  ),
}

const features = [
  { id: 'organic', title: '100% Organic Sugarcane', desc: 'Sourced from the fertile soil of Kolhapur, grown naturally without synthetic fertilizers.', icon: icons.organic },
  { id: 'ginger', title: 'Sun-Dried Ginger Spice', desc: 'Infused with fresh ginger root, dried under the sun and ground in small batches.', icon: icons.ginger },
  { id: 'sugarfree', title: 'Zero Refined Sugar', desc: 'No chemical clarification, no added sulfur, and no white sugar additives. Pure molasses nectar.', icon: icons.sugarfree },
  { id: 'woodfire', title: 'Ancestral Wood-Firing', desc: 'Sugarcane juice boiled slowly over wood fire vats using generations-old heirloom cooking methods.', icon: icons.woodfire },
  { id: 'minerals', title: 'Native Minerals & Iron', desc: 'Retains native plant minerals, natural iron, magnesium, and potassium for steady energy release.', icon: icons.minerals },
  { id: 'digestive', title: 'Natural Digestive Power', desc: 'Traditionally enjoyed post-meals to stimulate enzymes, cleanse respiratory tracts, and soothe digestion.', icon: icons.digestive },
]

export default function WhySection(): React.JSX.Element {
  const [activeIdx, setActiveIdx] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIdx((prev) => (prev + 1) % features.length)
    }, 3000)
    return () => clearInterval(timer)
  }, [])

  return (
    <section className="py-36 bg-white overflow-hidden border-t border-border">
      <div className="container-main">
        {/* Title */}
        <AnimatedSection className="w-full flex justify-center">
          <SectionHeading
            label="Product Integrity"
            heading={
              <>
                anatomy of a pouch of <span className="italic">gud.</span>
              </>
            }
            align="center"
            className="mb-16 lg:mb-28"
          />
        </AnimatedSection>

        {/* Desktop 3-Column Grid Layout */}
        <div className="hidden lg:grid grid-cols-3 items-center gap-16 max-w-7xl mx-auto px-4">
          
          {/* Left Column - Features */}
          <div className="flex flex-col gap-20 order-1">
            {features.slice(0, 3).map((feat, idx) => (
              <AnimatedSection key={feat.id} direction="left" delay={0.1 * (idx + 1)}>
                <div className="flex flex-col items-center text-center mx-auto max-w-xs" style={{ fontFamily: 'Outfit, sans-serif' }}>
                  <div className="w-8 h-8 mb-4 flex items-center justify-center">
                    {feat.icon}
                  </div>
                  <h4 className="text-lg md:text-xl font-medium text-[#010100] mb-1.5" style={{ fontFamily: 'Playfair Display, serif' }}>
                    {feat.title}
                  </h4>
                  <p className="text-xs md:text-sm leading-relaxed text-[#8a8880]">
                    {feat.desc}
                  </p>
                </div>
              </AnimatedSection>
            ))}
          </div>
          
          {/* Center Column - Product Image */}
          <div className="flex justify-center relative w-full px-8 order-2">
            <AnimatedSection delay={0.05}>
              <div className="relative w-[420px] aspect-[4/5] transition-transform duration-700 ease-out">
                <Image
                  src="/images/ginger-jaggery-pouch-3d.png"
                  alt="GudSampada Ginger Jaggery Powder packaging pouch front"
                  fill
                  className="object-contain"
                  sizes="420px"
                  priority
                />
              </div>
            </AnimatedSection>
          </div>

          {/* Right Column - Features */}
          <div className="flex flex-col gap-20 order-3">
            {features.slice(3, 6).map((feat, idx) => (
              <AnimatedSection key={feat.id} direction="right" delay={0.1 * (idx + 1)}>
                <div className="flex flex-col items-center text-center mx-auto max-w-xs" style={{ fontFamily: 'Outfit, sans-serif' }}>
                  <div className="w-8 h-8 mb-4 flex items-center justify-center">
                    {feat.icon}
                  </div>
                  <h4 className="text-lg md:text-xl font-medium text-[#010100] mb-1.5" style={{ fontFamily: 'Playfair Display, serif' }}>
                    {feat.title}
                  </h4>
                  <p className="text-xs md:text-sm leading-relaxed text-[#8a8880]">
                    {feat.desc}
                  </p>
                </div>
              </AnimatedSection>
            ))}
          </div>
          
        </div>

        {/* Mobile Layout: Image + Auto-Rotating Text Carousel */}
        <div className="flex flex-col items-center lg:hidden">
          {/* Product Image */}
          <div className="relative w-[300px] md:w-[380px] aspect-[4/5] mb-12">
            <Image
              src="/images/ginger-jaggery-pouch-3d.png"
              alt="GudSampada Ginger Jaggery Powder packaging pouch front"
              fill
              className="object-contain"
              sizes="(max-width: 1024px) 300px, 380px"
              priority
            />
          </div>

          {/* Rotating Feature */}
          <div className="relative w-full h-[200px] flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIdx}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.4 }}
                className="absolute flex flex-col items-center text-center max-w-sm px-6"
                style={{ fontFamily: 'Outfit, sans-serif' }}
              >
                <div className="w-8 h-8 mb-4 flex items-center justify-center">
                  {features[activeIdx].icon}
                </div>
                <h4 className="text-lg font-medium text-[#010100] mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>
                  {features[activeIdx].title}
                </h4>
                <p className="text-xs md:text-sm leading-relaxed text-[#8a8880]">
                  {features[activeIdx].desc}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>
          
          {/* Dots Indicator (Sharp Square Style) */}
          <div className="flex items-center gap-2 mt-4">
            {features.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveIdx(i)}
                className={`w-1.5 h-1.5 transition-colors duration-300 ${
                  i === activeIdx ? 'bg-gold' : 'bg-molasses-lighter/20'
                }`}
                style={{ borderRadius: 0 }}
                aria-label={`Go to feature ${i + 1}`}
              />
            ))}
          </div>
        </div>

      </div>
    </section>
  )
}
