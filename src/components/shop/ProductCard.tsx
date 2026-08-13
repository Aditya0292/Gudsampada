'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, useMotionValue, useSpring, useReducedMotion } from 'framer-motion'
import { Product } from '@/data/products'
import { useCartStore } from '@/store/cartStore'

interface ProductCardProps {
  product: Product
  index: number
}

function toTitleCase(str: string) {
  return str.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.slice(1).toLowerCase())
}

export default function ProductCard({ product, index }: ProductCardProps): React.JSX.Element {
  const primaryVariant = product.variants[0]
  const addItem = useCartStore((state) => state.addItem)
  const [wishlisted, setWishlisted] = useState(false)

  // Framer motion mouse tracking for desktop hover sticker
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

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (primaryVariant) {
      addItem({
        id: product.id,
        variantId: primaryVariant.id,
        name: product.name,
        variant: primaryVariant.weight,
        price: primaryVariant.price,
        image: product.image,
      })
    }
  }

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setWishlisted(!wishlisted)
  }

  // Calculate discount dynamically for mobile pricing block
  const discountPercent = primaryVariant?.originalPrice
    ? Math.round(((primaryVariant.originalPrice - primaryVariant.price) / primaryVariant.originalPrice) * 100)
    : 0

  // Mock review values for realistic Myntra-style rating badge
  const mockRating = product.category === 'powders' ? '4.8' : '4.7'
  const mockReviews = product.category === 'powders' ? '34' : '18'

  return (
    <>
      {/* ──────────────────────────────────────────────────────── */}
      {/* 1. DESKTOP VIEW (Visible on tablet & desktop, hidden on mobile) */}
      {/* ──────────────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{
          duration: shouldReduceMotion ? 0.1 : 0.5,
          delay: shouldReduceMotion ? 0 : index * 0.08,
          ease: [0.16, 1, 0.3, 1],
        }}
        className="hidden md:block w-full h-full"
      >
        <Link className="group block w-full h-full cursor-pointer relative" href={`/products/${product.handle}`}>
          <div className="bg-transparent border-0 p-0 h-full flex flex-col transition-all duration-500">
            
            {/* Image Container with Sharp Corners & Hover Micro-Interactions */}
            <div 
              className="relative w-full aspect-[4/5] bg-[#F5F0EF] rounded-none overflow-hidden mb-6 transition-opacity duration-300 group-hover:opacity-95"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              onMouseMove={handleMouseMove}
            >
              <div className="relative w-full h-full">
                <Image 
                  className={`object-contain p-6 transition-all duration-700 ease-out group-hover:scale-105 ${product.images && product.images.length > 1 ? 'group-hover:opacity-0' : ''}`} 
                  fill 
                  src={product.images?.[0] || product.image}
                  alt={product.name}
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                />
                {product.images && product.images.length > 1 && (
                  <Image 
                    className="object-contain p-6 transition-all duration-700 ease-out scale-95 opacity-0 group-hover:scale-105 group-hover:opacity-100 absolute inset-0" 
                    fill 
                    src={product.images[1]}
                    alt={`${product.name} Alternate View`}
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />
                )}
              </div>

              {/* Custom Following Cursor Sticker (Circular Badge) */}
              <motion.div 
                className="pointer-events-none absolute left-0 top-0 z-50 w-24 h-24 bg-[#010100] text-white rounded-full flex items-center justify-center text-[10px] font-bold uppercase tracking-widest shadow-xl hidden sm:flex"
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
                {/* Category Micro-Label */}
                <div className="text-[9px] font-sans font-bold tracking-[0.15em] uppercase text-[#8a8880] mb-3 flex items-center gap-2">
                  <span className="w-[6px] h-[6px] bg-[#c9a96e] rounded-none inline-block"></span>
                  {product.category}
                </div>

                {/* Title in Restrained Title Case Typography */}
                <h3 className="font-heading text-xl md:text-[22px] font-medium text-[#010100] leading-snug tracking-tight mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
                  {toTitleCase(product.name)}
                </h3>
              </div>
              
              {/* Elevated Price Tag Row (Tabular Numbers & Baseline Alignment) */}
              <div className="flex items-end pt-2 mt-auto w-full font-sans">
                <div className="flex flex-col gap-1">
                  {primaryVariant.originalPrice && (
                    <span className="text-[11px] text-[#8a8880] line-through font-normal tabular-nums leading-none">
                      ₹{primaryVariant.originalPrice}
                    </span>
                  )}
                  <span className="text-base font-bold tabular-nums text-[#b04a29] leading-none">
                    ₹{primaryVariant.price}
                  </span>
                </div>
                
                <span className="text-[10px] font-medium uppercase tracking-[0.1em] text-[#8a8880] ml-auto pb-[2px]">
                  / {primaryVariant.weight}
                </span>
              </div>
            </div>

          </div>
        </Link>
      </motion.div>

      {/* ──────────────────────────────────────────────────────── */}
      {/* 2. MOBILE VIEW (Visible on mobile screens, hidden on tablet/PC) */}
      {/* ──────────────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-20px' }}
        transition={{ duration: 0.4, delay: index * 0.05 }}
        className="block md:hidden w-full h-full font-sans"
      >
        <Link href={`/products/${product.handle}`} className="no-underline block h-full">
          <div className="bg-transparent border-0 p-0 flex flex-col gap-2 h-full box-border relative">
            
            {/* Image container: Full-bleed on mobile (3:4 aspect) */}
            <div className="relative w-full aspect-[3/4] bg-[#f5f0ef] overflow-hidden rounded-none">
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-contain p-2 transition-transform duration-500"
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              />

              {/* Myntra-style Rating Badge Overlay */}
              <div className="absolute bottom-2 left-2 bg-white/90 backdrop-blur-xs px-1.5 py-0.5 text-[9px] font-bold text-molasses flex items-center gap-1 shadow-xs rounded-none z-10 border border-black/5">
                <span>{mockRating}</span>
                <span className="text-gold text-[10px]">★</span>
                <span className="text-molasses-light/40 font-normal">|</span>
                <span className="text-molasses-light font-normal">{mockReviews}</span>
              </div>
            </div>

            {/* Details & Pricing */}
            <div className="flex-1 flex flex-col justify-between gap-1 text-left relative">
              <div>
                {/* Title: truncated on mobile */}
                <h3 className="font-heading text-sm font-medium text-[#010100] mt-1 leading-tight truncate" style={{ fontFamily: 'Playfair Display, serif' }}>
                  {toTitleCase(product.name)}
                </h3>

                {/* Subtitle / Weight */}
                <p className="text-[11px] text-[#8a8880] font-normal m-0 truncate">
                  {product.category === 'powders' ? 'Artisanal spice blend' : 'Bite-sized paan bites'} • {primaryVariant.weight}
                </p>
              </div>

              {/* Price section - compact horizontal row matching Myntra style */}
              <div className="flex flex-col gap-1 pt-1">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-sm font-semibold text-molasses font-serif" style={{ color: '#1c1b1a' }}>
                    ₹{primaryVariant.price}
                  </span>
                  {primaryVariant.originalPrice && (
                    <>
                      <span className="text-xs text-[#8a8880] line-through font-normal">
                        ₹{primaryVariant.originalPrice}
                      </span>
                      <span className="text-[10px] font-bold text-[#ba1a1a]">
                        ({discountPercent}% OFF)
                      </span>
                    </>
                  )}
                </div>
              </div>

              {/* Wishlist Heart Icon */}
              <button
                onClick={handleWishlist}
                className="absolute right-0.5 bottom-1 bg-transparent border-none p-1 cursor-pointer transition-colors text-molasses-light hover:text-[#ba1a1a]"
                aria-label="Add to wishlist"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill={wishlisted ? '#ba1a1a' : 'none'}
                  stroke={wishlisted ? '#ba1a1a' : 'currentColor'}
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="transition-all duration-300"
                >
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
              </button>
            </div>

          </div>
        </Link>
      </motion.div>
    </>
  )
}
