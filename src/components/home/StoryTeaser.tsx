'use client'

import Image from 'next/image'
import { useRef, useState, useEffect } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import AnimatedSection from '@/components/ui/AnimatedSection'

export default function StoryTeaser() {
 const containerRef = useRef<HTMLDivElement>(null)
 const [mounted, setMounted] = useState(false)

 useEffect(() => {
   setMounted(true)
 }, [])

 const { scrollYProgress } = useScroll(
   mounted
     ? {
         target: containerRef,
         offset: ['start end', 'end start'],
       }
     : {}
 )

 // Smooth parallax translation on Y-axis
 const y = useTransform(scrollYProgress, [0, 1], [-80, 80])

 return (
 <section 
 ref={containerRef}
 id="story" 
 className="py-36 bg-cream overflow-hidden border-t border-border"
 >
 <div className="container-main">
 {/* Asymmetric Split Layout: Left 40% Text, Right 60% Image */}
 <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-20 items-center">
 {/* Text Column - 5 cols */}
 <div className="col-span-1 md:col-span-5 flex flex-col space-y-6 pr-4">
 <AnimatedSection direction="left" className="flex flex-col space-y-6">
 <span className="overline text-[10px] tracking-[0.25em]">Our Roots</span>
 <h2 className="font-heading text-4xl md:text-[3.25rem] font-light text-molasses leading-tight lowercase text-balance">
 from sugarcane fields
 <br />
 to <span className="italic font-normal">your table.</span>
 </h2>
 <div className="space-y-6 text-molasses-light font-serif text-[15px] leading-[1.8] font-light max-w-prose">
 <p>
 Three generations ago, our family started making jaggery in a
 small village near Kolhapur, Maharashtra. The process was
 simple — crush the sugarcane, boil the juice in iron vats
 over wood fire, and pour the golden liquid into moulds.
 </p>
 <p>
 Today, while the world has moved to refined sugar and
 artificial sweeteners, we still make our jaggery the same
 way. Because some traditions are worth preserving.
 </p>
 </div>

 {/* Stats */}
 <div className="flex gap-12 pt-6 border-t border-border">
 {[
 { value: '3rd', label: 'Generation' },
 { value: '50+', label: 'Years' },
 { value: '100%', label: 'Natural' },
 ].map((stat) => (
 <div key={stat.label}>
 <p className="font-serif text-3xl text-molasses font-light">
 {stat.value}
 </p>
 <p className="text-molasses-lighter/70 text-[9px] font-sans font-bold uppercase tracking-wider mt-1.5">
 {stat.label}
 </p>
 </div>
 ))}
 </div>
 </AnimatedSection>
 </div>

        {/* Parallax Image Column - 7 cols */}
        <div className="col-span-1 md:col-span-7 h-[320px] md:h-[580px] overflow-hidden relative mt-12 md:mt-0 rounded-none border border-molasses/10 shadow-xs">
          <motion.div 
            style={{ y }}
            className="absolute inset-0 -top-20 -bottom-20"
          >
            <Image
              src="/images/women-woodfire-jaggery-making.png"
              alt="Kolhapur woman artisan carefully pouring golden sugarcane syrup into traditional wood-fired iron vat"
              fill
              className="object-cover scale-[1.05]"
              sizes="(max-width: 1024px) 100vw, 55vw"
            />
          </motion.div>
        </div>
 </div>
 </div>
 </section>
 )
}
