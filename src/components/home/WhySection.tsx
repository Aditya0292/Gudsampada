'use client'

import Image from 'next/image'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import AnimatedSection from '@/components/ui/AnimatedSection'
import SectionHeading from '@/components/ui/SectionHeading'

// SVG Icons for the 6 characteristics
const icons = {
 organic: (
 <svg className="w-6 h-6 text-gold" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
 <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v18M3 12h18M19.5 9.75a3 3 0 11-6 0v-4.5h6v4.5zM4.5 14.25a3 3 0 106 0v-4.5h-6v4.5z" />
 </svg>
 ),
 ginger: (
 <svg className="w-6 h-6 text-gold" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
 <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m0-12.728l.707.707m12.022 12.022l.707-.707M12 7a5 5 0 100 10 5 5 0 000-10z" />
 </svg>
 ),
 sugarfree: (
 <svg className="w-6 h-6 text-gold" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
 <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
 </svg>
 ),
 woodfire: (
 <svg className="w-6 h-6 text-gold" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
 <path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.361-6.867 8.21 8.21 0 003 2.48z" />
 </svg>
 ),
 minerals: (
 <svg className="w-6 h-6 text-gold" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
 <path strokeLinecap="round" strokeLinejoin="round" d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />
 </svg>
 ),
 digestive: (
 <svg className="w-6 h-6 text-gold" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
 <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75l3 3 6-6M20.25 14.15v3.02c0 1.09-.818 2.008-1.912 2.018A48.394 48.394 0 0112 19.5c-2.203 0-4.361-.15-6.338-.44a2.01 2.01 0 01-1.912-2.018v-3.02M12 3v16.5" />
 </svg>
 )
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
 <div className="flex flex-col items-center text-center mx-auto max-w-xs">
 <div className="w-8 h-8 mb-4 flex items-center justify-center">
 {feat.icon}
 </div>
 <h4 className="font-heading text-lg md:text-xl font-normal text-molasses mb-1.5">
 {feat.title}
 </h4>
 <p className="text-xs md:text-sm leading-relaxed text-molasses-lighter font-sans">
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
 <div className="flex flex-col items-center text-center mx-auto max-w-xs">
 <div className="w-8 h-8 mb-4 flex items-center justify-center">
 {feat.icon}
 </div>
 <h4 className="font-heading text-lg md:text-xl font-normal text-molasses mb-1.5">
 {feat.title}
 </h4>
 <p className="text-xs md:text-sm leading-relaxed text-molasses-lighter font-sans">
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
 className="object-contain drop-shadow-2xl"
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
 >
 <div className="w-8 h-8 mb-4 flex items-center justify-center">
 {features[activeIdx].icon}
 </div>
 <h4 className="font-heading text-lg font-normal text-molasses mb-2">
 {features[activeIdx].title}
 </h4>
 <p className="text-xs md:text-sm leading-relaxed text-molasses-lighter font-sans">
 {features[activeIdx].desc}
 </p>
 </motion.div>
 </AnimatePresence>
 </div>
 
 {/* Dots Indicator */}
 <div className="flex items-center gap-2 mt-4">
 {features.map((_, i) => (
 <button
 key={i}
 onClick={() => setActiveIdx(i)}
 className={`w-1.5 h-1.5 rounded-full transition-colors duration-300 ${
 i === activeIdx ? 'bg-gold' : 'bg-molasses-lighter/20'
 }`}
 aria-label={`Go to feature ${i + 1}`}
 />
 ))}
 </div>
 </div>

 </div>
 </section>
 )
}
