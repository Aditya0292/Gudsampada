'use client'

import React, { use, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { getProductByHandle, ProductVariant } from '@/data/products'
import { useCartStore } from '@/store/cartStore'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import CartDrawer from '@/components/shop/CartDrawer'
import AnimatedSection from '@/components/ui/AnimatedSection'
import ProductSpecs from '@/components/product/ProductSpecs'
import ProductInfoTabs from '@/components/product/ProductInfoTabs'
import RelatedProducts from '@/components/product/RelatedProducts'
import Button from '@/components/ui/Button'

export default function ProductDetailPage({
  params,
}: {
  params: Promise<{ handle: string }>
}): React.JSX.Element {
  const { handle } = use(params)
  const addItem = useCartStore((s) => s.addItem)

  const [product, setProduct] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  const [selectedVariant, setSelectedVariant] = useState<ProductVariant>({ id: '', weight: '', weightGrams: 300, price: 0 })
  const [quantity, setQuantity] = useState(1)
  const [addedToCart, setAddedToCart] = useState(false)
  const [activeImageIndex, setActiveImageIndex] = useState(0)

  React.useEffect(() => {
    async function load() {
      const p = await getProductByHandle(handle)
      setProduct(p)
      if (p && p.variants.length > 0) {
        setSelectedVariant(p.variants[0])
      }
      setIsLoading(false)
    }
    load()
  }, [handle])

  if (isLoading) {
    return (
      <>
        <Header />
        <main className="main-page-padding pb-24 min-h-screen bg-cream flex items-center justify-center">
          <div className="animate-pulse w-8 h-8 rounded-full border-2 border-molasses border-t-transparent animate-spin"></div>
        </main>
        <Footer />
      </>
    )
  }

  if (!product) {
    return (
      <>
        <Header />
        <main className="main-page-padding pb-24 min-h-screen bg-cream">
          <div className="container-main text-center py-20">
            <span className="text-5xl mb-5 block">🤔</span>
            <h1 className="font-heading text-2xl text-molasses mb-4">Product Not Found</h1>
            <Link href="/shop" className="text-gold font-medium text-sm">
              ← Back to Shop
            </Link>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addItem({
        id: product.id,
        variantId: selectedVariant.id,
        name: product.name,
        variant: selectedVariant.weight,
        price: selectedVariant.price,
        image: product.image,
      })
    }
    setAddedToCart(true)
    setTimeout(() => setAddedToCart(false), 2000)
    setQuantity(1)
  }

  return (
    <>
      <Header />
      <CartDrawer />
      <main className="main-page-padding pb-32 min-h-screen bg-cream relative max-w-[100vw] overflow-x-hidden">
        <div className="container-main relative z-10">
          {/* Breadcrumb */}
          <nav className="mb-12 text-[10px] font-sans font-bold uppercase tracking-[0.2em] text-molasses-lighter">
            <Link href="/shop" className="transition-colors">
              Shop
            </Link>
            <span className="mx-3 text-molasses-lighter/35">/</span>
            <span className="text-molasses">{product.name}</span>
          </nav>

          {/* Product Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 mb-32 items-center relative">
            {/* Background Typographic Watermark (Centered directly behind the product pouch) - Hidden on mobile */}
            <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 hidden md:flex items-center justify-center pointer-events-none select-none z-0 overflow-visible py-6">
              <span className="font-heading text-4xl sm:text-6xl md:text-7xl lg:text-[5.25rem] font-bold italic tracking-wide text-molasses/[0.07] lowercase whitespace-nowrap text-center py-4 leading-normal">
                {product.name.toLowerCase()}
              </span>
            </div>

            {/* Left Flank: Product Specifications */}
            <div className="col-span-1 lg:col-span-3 flex flex-col order-3 lg:order-1 mt-12 lg:mt-0 relative z-10">
              <ProductSpecs handle={product.handle} />
            </div>

            {/* Center Anchor: Pouch & Shadows (Gallery) */}
            <div className="col-span-1 lg:col-span-6 flex flex-col items-center justify-center order-1 lg:order-2 relative py-8 z-10 w-full">
              {/* Product Image */}
              <div className="relative w-full max-w-[360px] aspect-[3/4] z-10 select-none flex items-center justify-center group">
                <Image
                  src={product.images?.[activeImageIndex] || product.image}
                  alt={product.name}
                  fill
                  priority
                  className="object-contain drop-shadow-xl z-10 relative transition-opacity duration-300"
                  sizes="(max-width: 1024px) 100vw, 40vw"
                />

                {/* Left/Right Navigation overlay for desktop */}
                {product.images && product.images.length > 1 && (
                  <>
                    <button 
                      onClick={() => setActiveImageIndex((prev) => (prev > 0 ? prev - 1 : product.images.length - 1))}
                      className="absolute left-[-2rem] top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-molasses w-10 h-10 rounded-full flex items-center justify-center z-20 shadow-md opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-0 hidden md:flex"
                      aria-label="Previous image"
                    >
                      ←
                    </button>
                    <button 
                      onClick={() => setActiveImageIndex((prev) => (prev < product.images.length - 1 ? prev + 1 : 0))}
                      className="absolute right-[-2rem] top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-molasses w-10 h-10 rounded-full flex items-center justify-center z-20 shadow-md opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-0 hidden md:flex"
                      aria-label="Next image"
                    >
                      →
                    </button>
                  </>
                )}
              </div>

              {/* Ground Shadow (Crucial for 3D depth) */}
              <div className="w-3/4 max-w-[280px] h-4 bg-molasses/30 blur-xl rounded-[50%] absolute bottom-4 z-0"></div>

              {/* Mobile/Desktop Thumbnails & Indicators */}
              {product.images && product.images.length > 1 && (
                <div className="mt-8 flex gap-3 z-10 overflow-x-auto w-full max-w-sm justify-center py-2 px-4 no-scrollbar">
                  {product.images.map((img: string, idx: number) => (
                    <button 
                      key={img}
                      onClick={() => setActiveImageIndex(idx)}
                      className={`relative w-14 h-14 md:w-16 md:h-16 flex-shrink-0 border transition-colors ${activeImageIndex === idx ? 'border-molasses' : 'border-transparent hover:border-molasses/30'} bg-[#fcfaf9] rounded-sm`}
                    >
                      <Image src={img} alt={`Thumbnail ${idx + 1}`} fill className="object-contain p-1" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right Flank: Commerce Controls */}
            <div className="col-span-1 lg:col-span-3 flex flex-col space-y-6 order-2 lg:order-3 relative z-10">
              <div>
                <span className="overline text-[10px] tracking-[0.2em] text-[#8b5a2b] mb-3 block">
                  {product.category}
                </span>
                <h1 className="font-heading text-4xl md:text-[3.25rem] font-semibold text-[#010100] lowercase leading-none mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
                  {product.name}
                </h1>
                <p className="text-molasses-light italic font-serif text-sm leading-relaxed mb-6">
                  {product.tagline}
                </p>

                {/* Price (Playfair Display Red Price Concept) */}
                <div className="flex items-baseline justify-between mb-8 pb-6 border-b border-[rgba(200,193,182,0.3)]">
                  <div className="flex items-baseline gap-3">
                    {selectedVariant.originalPrice && (
                      <span className="text-xl font-sans text-molasses/40 line-through">
                        ₹{selectedVariant.originalPrice}
                      </span>
                    )}
                    <span className="text-3xl font-serif font-bold text-[#ba1a1a]">₹{selectedVariant.price}</span>
                    <span className="text-xs text-molasses-light font-sans uppercase tracking-wider font-semibold">
                      / {selectedVariant.weight}
                    </span>
                  </div>
                </div>

                {/* Variant Selector (Stitch Clean Border Outline Buttons) */}
                {product.variants.length > 1 && (
                  <div className="mb-8">
                    <label className="text-[10px] font-sans font-bold uppercase tracking-[0.15em] text-[#474741] mb-3 block">
                      Select Size
                    </label>
                    <div className="grid grid-cols-2 gap-4">
                      {product.variants.map((v: any) => (
                        <button
                          key={v.id}
                          onClick={() => setSelectedVariant(v)}
                          className={`min-h-[44px] py-3 px-4 rounded-none text-xs font-sans font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer text-center ${
                            selectedVariant.id === v.id
                              ? 'bg-primary text-on-primary border border-primary'
                              : 'bg-transparent text-primary border border-[#c8c7bf] hover:border-primary'
                          }`}
                          id={`variant-${v.id}`}
                        >
                          {v.weight}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Quantity Selector UI (Stitch Clean Box without background & 44px tap targets) */}
                <div className="mb-8">
                  <label className="text-[10px] font-sans font-bold uppercase tracking-[0.15em] text-[#474741] mb-3 block">
                    Quantity
                  </label>
                  <div className="flex items-center border border-[#c8c7bf] rounded-none bg-transparent w-max h-14">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-14 h-full rounded-none flex items-center justify-center text-[#474741] hover:text-primary transition-colors duration-200 text-lg font-bold cursor-pointer select-none bg-transparent border-none p-0"
                      id="qty-decrease"
                      aria-label="Decrease quantity"
                    >
                      -
                    </button>

                    <span className="w-12 text-center text-sm font-bold font-sans text-primary select-none">
                      {quantity}
                    </span>

                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-14 h-full rounded-none flex items-center justify-center text-[#474741] hover:text-primary transition-colors duration-200 text-lg font-bold cursor-pointer select-none bg-transparent border-none p-0"
                      id="qty-increase"
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Add to Cart CTA (Outline by default, solid black with white text on hover or when clicked) */}
                <div className="pt-2">
                  <button
                    onClick={handleAddToCart}
                    className={`w-full h-14 rounded-none font-sans text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 cursor-pointer transition-all duration-200 border ${
                      addedToCart 
                        ? 'bg-primary text-on-primary border-primary' 
                        : 'bg-transparent text-primary border-primary hover:bg-primary hover:text-on-primary'
                    }`}
                    id="add-to-cart-detail"
                  >
                    {addedToCart ? (
                      <>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="mr-1">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                        Added to Cart
                      </>
                    ) : (
                      <>
                        Add to Cart — ₹{(selectedVariant.price * quantity).toLocaleString('en-IN')}
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="ml-1">
                          <circle cx="9" cy="21" r="1" />
                          <circle cx="20" cy="21" r="1" />
                          <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                        </svg>
                      </>
                    )}
                  </button>
                </div>

                {/* Trust Badges */}
                <div className="flex items-center justify-center gap-6 pt-6 text-[11px] font-sans font-medium uppercase tracking-wider text-molasses/60">
                  <span className="flex items-center gap-1.5">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="1" y="3" width="15" height="13" />
                      <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
                      <circle cx="5.5" cy="18.5" r="2.5" />
                      <circle cx="18.5" cy="18.5" r="2.5" />
                    </svg>
                    Free over ₹999
                  </span>
                  <span className="flex items-center gap-1.5">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                    </svg>
                    100% Natural
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Info Tabs */}
          <AnimatedSection>
            <ProductInfoTabs
              description={product.description}
              benefits={product.benefits}
              howToUse={product.howToUse}
            />
          </AnimatedSection>

          {/* Related Recommendations */}
          <AnimatedSection>
            <RelatedProducts productId={product.id} />
          </AnimatedSection>
        </div>
      </main>
      <Footer />
    </>
  )
}
