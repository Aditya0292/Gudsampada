'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { useRef } from 'react'

const heroProduct = {
 name: 'Ginger Jaggery Powder',
 image: '/images/aaa-removebg-preview.png',
 link: '/products/ginger-jaggery-powder'
}

export default function HeroSection(): React.JSX.Element {
 const containerRef = useRef<HTMLDivElement>(null)
 const { scrollY } = useScroll()
 
 // Parallax translation for background image
 const y = useTransform(scrollY, [0, 1000], [0, 200])
 const textOpacity = useTransform(scrollY, [0, 600], [1, 0])
 const textY = useTransform(scrollY, [0, 600], [0, 80])

 return (
 <section 
 ref={containerRef}
 className="relative h-screen min-h-[700px] flex items-center pt-20 overflow-hidden bg-molasses"
 >
  {/* Background Media with Parallax */}
  <motion.div 
    style={{ y }} 
    className="absolute inset-0 z-0 scale-[1.15] md:scale-[1.12] origin-center pointer-events-none"
  >
    {/* Video for Tablet & Desktop (Hidden on mobile) */}
    <video
      autoPlay
      loop
      muted
      playsInline
      className="hidden md:block w-full h-full object-cover object-center"
      poster="/images/hero-sugarcane-farm.png"
    >
      <source src="/videos/hero-bg-loop.mp4" type="video/mp4" />
    </video>

    {/* Static Image for Mobile (Hidden on md and up) */}
    <div className="block md:hidden absolute inset-0">
      <Image
        src="/images/hero-sugarcane-farm.png"
        alt="Kolhapur sugarcane farm fields at sunrise"
        fill
        priority
        loading="eager"
        sizes="(max-width: 768px) 100vw, 0px"
        className="object-cover object-center"
      />
    </div>
  </motion.div>
 <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent z-1" />
 <div className="absolute inset-0 bg-black/30 z-1" />

 {/* Content - Two-column grid on desktop */}
 <div className="container-main relative z-10 w-full">
 <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center w-full">
 <motion.div 
 style={{ opacity: textOpacity, y: textY }}
 className="col-span-12 lg:col-span-7 max-w-3xl"
 >
 <motion.div
 initial={{ opacity: 0, y: 15 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
 className="inline-flex items-center gap-2 mb-6"
 >
 <span className="w-1.5 h-1.5 bg-gold rounded-full animate-pulse" />
 <span className="text-white/80 text-[10px] uppercase tracking-[0.25em] font-semibold">
 Farm Direct from Kolhapur
 </span>
 </motion.div>

 <motion.h1
 initial={{ opacity: 0, y: 25 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ duration: 1, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
 className="font-heading text-4xl sm:text-5xl md:text-6xl lg:text-[5.5rem] font-light text-white leading-[1.05] tracking-tight mb-6 break-words"
 >
 pure. <span className="italic font-normal text-[#EAD8C0]">unrefined.</span>
 <br />
 from kolhapur&apos;s <span className="italic font-normal">finest</span> lands.
 </motion.h1>

 <motion.p
 initial={{ opacity: 0, y: 20 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ duration: 1, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
 className="text-cream text-base md:text-lg font-semibold drop-shadow-lg max-w-xl leading-relaxed mb-8"
 >
 Traditionally crafted unrefined jaggery, made using heirloom techniques. No chemical additives. Just pure, organic sugarcane nectar.
 </motion.p>

  <motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 1, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
  style={{ marginTop: '32px' }}
  >
  <Link
  href="/shop"
  style={{
    display: 'inline-block',
    background: 'transparent',
    border: '1.5px solid #fff',
    color: '#fff',
    padding: '16px 32px',
    fontSize: '13px',
    fontWeight: 700,
    letterSpacing: '0.12em',
    textTransform: 'uppercase',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    fontFamily: 'Outfit, sans-serif'
  }}
  className="hover:bg-white hover:text-black"
  >
  Explore Shop →
  </Link>
  </motion.div>
 </motion.div>

 {/* Right side product showcase */}
 <div className="col-span-12 lg:col-span-5 flex items-center justify-center lg:justify-end pr-0 lg:pr-12 relative min-h-[300px] lg:min-h-[500px] mt-8 lg:mt-0 pb-16 lg:pb-0">
 <motion.div
 initial={{ opacity: 0, scale: 0.9, y: 15 }}
 animate={{ opacity: 1, scale: 1, y: 0 }}
 transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
 className="relative w-full max-w-[220px] sm:max-w-[280px] lg:max-w-[460px] xl:max-w-[560px] aspect-[3/4] flex flex-col items-center justify-center group"
 >
 {/* 3D Brownish Soil Gradient Sphere behind the product */}
 <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 bg-gradient-to-tr from-[#5d4037]/60 to-[#8d6e63]/40 blur-[80px] rounded-full z-0" />

 {/* Floating Shadow under product */}
 <div className="absolute bottom-6 w-3/4 h-8 bg-black/60 blur-2xl rounded-[50%] z-0" />
 
 {/* Product Link wrapper */}
 <Link href={heroProduct.link} className="relative w-full h-full z-10 flex flex-col items-center justify-center">
 <div className="relative w-full h-[85%] aspect-[4/5] select-none flex items-center justify-center">
 <Image
 src={heroProduct.image}
 alt={heroProduct.name}
 fill
 priority
 loading="eager"
 className="object-contain drop-shadow-[0_45px_45px_rgba(0,0,0,0.6)]"
 sizes="(max-width: 768px) 100vw, 560px"
 />
 </div>
 
 {/* Small product tag */}
 <div className="mt-2 text-center">
 <span className="text-[10px] font-sans font-bold uppercase tracking-[0.25em] text-white/50 block mb-1">
 Featured Collection
 </span>
 <span className="font-serif text-[17px] text-white lowercase tracking-tight">
 {heroProduct.name}
 </span>
 </div>
 </Link>
 </motion.div>
 </div>
 </div>
 </div>

 {/* Bottom subtle edge shadow to blend with body cream */}
 <div className="absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-t from-cream to-transparent z-10 pointer-events-none" />

 {/* Scroll indicator */}
 <div className="absolute bottom-8 right-8 z-10 hidden md:block">
 <div className="flex items-center gap-3">
 <span className="text-white/30 text-[9px] uppercase tracking-[0.25em]">Scroll Down</span>
 <div className="w-[1px] h-8 bg-white/20 relative overflow-hidden">
 <motion.div 
 animate={{ y: [-32, 32] }}
 transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
 className="absolute top-0 left-0 right-0 h-4 bg-gold"
 />
 </div>
 </div>
 </div>
 </section>
 )
}
