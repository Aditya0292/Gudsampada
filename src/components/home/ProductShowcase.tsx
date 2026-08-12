'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { getFeaturedProducts, Product } from '@/data/products'
import AnimatedSection from '@/components/ui/AnimatedSection'

export default function ProductShowcase() {
 const [featured, setFeatured] = useState<Product[]>([])

 useEffect(() => {
   async function loadFeatured() {
     const products = await getFeaturedProducts()
     setFeatured(products.slice(0, 3))
   }
   loadFeatured()
 }, [])

 return (
 <section className="section-padding bg-cream">
 <div className="container-main">
 <AnimatedSection>
 <div className="flex flex-col items-center justify-center text-center w-full mb-24 md:mb-28">
 <span className="overline">Our Collection</span>
 <h2 className="font-heading text-4xl md:text-[3.25rem] font-light text-molasses mt-4 mb-5 leading-tight lowercase text-balance">
 handpicked <span className="italic font-normal">bestsellers.</span>
 </h2>
 <p className="text-molasses-lighter text-[15px] max-w-2xl mx-auto leading-relaxed text-center font-serif font-light">
 Every product is crafted with care on our family farms in Kolhapur. No chemicals, no compromises.
 </p>
 </div>
 </AnimatedSection>

 <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-14">
 {featured.map((product, index) => (
 <AnimatedSection key={product.id} delay={index * 0.12}>
 <Link href={`/products/${product.handle}`} className="group block">
 <div className="relative flex flex-col">
 {/* Badge */}
 {product.badge && (
 <div className="absolute top-3.5 left-3.5 z-10 pointer-events-none">
 <span className="bg-molasses text-white text-[9px] font-semibold px-2.5 py-1 uppercase tracking-wider">
 {product.badge}
 </span>
 </div>
 )}

 {/* Image — 4:5 aspect ratio */}
 <div className="relative aspect-[4/5] bg-cream-dark overflow-hidden rounded-lg mb-3 flex items-center justify-center">
 {product.handle === 'ginger-jaggery-powder' ? (
 <div className="relative w-full h-full flex items-center justify-center">
 <Image
 src={product.image}
 alt={product.name}
 fill
 className="object-contain p-6 transition-transform duration-700 "
 sizes="(max-width: 768px) 100vw, 33vw"
 />
 </div>
 ) : (
 <Image
 src={product.image}
 alt={product.name}
 fill
 className="object-cover transition-transform duration-700 "
 sizes="(max-width: 768px) 100vw, 33vw"
 />
 )}
 </div>

 {/* Details */}
 <div className="px-1">
 <h3 className="font-serif text-base text-molasses tracking-tight font-normal mb-1">
 {product.name.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.slice(1).toLowerCase())}
 </h3>
 <p className="font-sans text-xs text-molasses/70 font-medium">
 ₹{product.variants[0].price}
 </p>
 </div>
 </div>
 </Link>
 </AnimatedSection>
 ))}
 </div>

 <AnimatedSection>
 <div className="text-center">
 <Link
 href="/shop"
 className="inline-flex items-center gap-2 text-gold font-medium text-sm transition-colors duration-300 group"
 >
 View All Products
 <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="transition-transform ">
 <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
 </svg>
 </Link>
 </div>
 </AnimatedSection>
 </div>
 </section>
 )
}
