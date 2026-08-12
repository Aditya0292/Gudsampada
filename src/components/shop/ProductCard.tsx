'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, useMotionValue, useSpring, useReducedMotion } from 'framer-motion'
import { Product } from '@/data/products'

interface ProductCardProps {
  product: Product
  index: number
}

function toTitleCase(str: string) {
  return str.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.slice(1).toLowerCase())
}

export default function ProductCard({ product, index }: ProductCardProps): React.JSX.Element {
  const shouldReduceMotion = useReducedMotion()
  const [isHovered, setIsHovered] = useState(false)
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const springX = useSpring(mouseX, { stiffness: 500, damping: 28 })
  const springY = useSpring(mouseY, { stiffness: 500, damping: 28 })

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    mouseX.set(e.clientX - rect.left)
    mouseY.set(e.clientY - rect.top)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{
        duration: shouldReduceMotion ? 0.1 : 0.5,
        delay: shouldReduceMotion ? 0 : index * 0.08,
        ease: [0.16, 1, 0.3, 1],
      }}
      className="w-full h-full"
    >
      <Link className="group block w-full h-full cursor-pointer relative" href={`/products/${product.handle}`}>
        
        {/* Sharp Brutalist-Editorial Card Container (rounded-none, 90-degree right angles) */}
        <div className="bg-[#F7F4EE] hover:bg-[#F3EFE7] rounded-none p-4 sm:p-5 h-full flex flex-col justify-between transition-all duration-500 shadow-xs hover:shadow-card">
          
          {/* Image Container with Sharp Corners & Hover Micro-Interactions */}
          <div 
            className="relative w-full aspect-[4/5] bg-[#EBE7DF] rounded-none overflow-hidden mb-4"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onMouseMove={handleMouseMove}
          >
            <Image 
              className="object-contain p-6 drop-shadow-xl transition-transform duration-700 ease-out group-hover:scale-105" 
              fill 
              src={product.image}
              alt={product.name}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            />

            {/* Custom Following Cursor Sticker (Circular Badge) */}
            <motion.div 
              className="pointer-events-none absolute left-0 top-0 z-50 w-24 h-24 bg-molasses text-cream rounded-full flex items-center justify-center text-[10px] font-bold uppercase tracking-widest shadow-xl hidden sm:flex"
              style={{
                x: springX,
                y: springY,
                translateX: "-50%",
                translateY: "-50%"
              }}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ 
                opacity: isHovered ? 1 : 0, 
                scale: isHovered ? 1 : 0.5 
              }}
              transition={{ type: "tween", ease: "easeOut", duration: 0.2 }}
            >
              View Item
            </motion.div>
          </div>

          {/* Typography & Price Hierarchy */}
          <div className="flex flex-col flex-grow justify-between w-full">
            <div>
              {/* Category Micro-Label (Anchors top of detail block) */}
              <div className="text-[11px] font-sans font-semibold tracking-[0.2em] uppercase text-[#8C7A6B] mb-1.5 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-gold rounded-none"></span>
                {product.category}
              </div>

              {/* Title in Restrained Title Case Typography */}
              <h3 className="font-serif text-base md:text-lg font-normal text-molasses leading-snug tracking-tight mb-3">
                {toTitleCase(product.name)}
              </h3>
            </div>
            
            {/* Elevated Price Tag Row (Tabular Numbers & Baseline Alignment) */}
            <div className="flex items-baseline justify-between pt-3 mt-auto w-full">
              <span className="text-base md:text-lg font-sans font-medium tabular-nums text-[#2D241E]">
                <span className="text-xs font-semibold mr-0.5 text-molasses/60">₹</span>
                {product.variants[0].price}
              </span>
              <span className="text-[10px] font-sans font-medium uppercase tracking-[0.18em] text-molasses/50">
                / {product.variants[0].weight}
              </span>
            </div>
          </div>

        </div>
      </Link>
    </motion.div>
  )
}
