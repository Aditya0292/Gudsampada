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

            {/* Center Anchor: Pouch & Shadows */}
            <div className="col-span-1 lg:col-span-6 flex flex-col items-center justify-center order-1 lg:order-2 relative py-8 z-10">
              {/* Product Image */}
              <div className="relative w-full max-w-[360px] aspect-[3/4] z-10 select-none">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  priority
                  className="object-contain drop-shadow-xl z-10 relative"
                  sizes="(max-width: 1024px) 100vw, 40vw"
                />
              </div>

              {/* Ground Shadow (Crucial for 3D depth) */}
              <div className="w-3/4 h-4 bg-molasses/30 blur-xl rounded-[50%] absolute -bottom-4 z-0"></div>
            </div>

            {/* Right Flank: Commerce Controls */}
            <div className="col-span-1 lg:col-span-3 flex flex-col space-y-6 order-2 lg:order-3 relative z-10">
              <div>
                <span className="overline text-[10px] tracking-[0.22em] text-gold mb-2 block">
                  {product.category}
                </span>
                <h1 className="font-serif text-3xl md:text-4xl font-light text-molasses lowercase tracking-tight mb-2">
                  {product.name}
                </h1>
                <p className="text-molasses-lighter italic font-serif text-sm leading-relaxed mb-6">
                  {product.tagline}
                </p>

                {/* Price */}
                <div className="flex items-baseline gap-2 mb-6 pb-5 border-b border-border">
                  <span className="text-3xl font-sans font-bold text-molasses">₹{selectedVariant.price}</span>
                  <span className="text-xs text-molasses/60 font-sans uppercase tracking-wider font-semibold">
                    / {selectedVariant.weight}
                  </span>
                </div>

                {/* Variant Selector (Strict Zero-Curve Geometry) */}
                {product.variants.length > 1 && (
                  <div className="mb-6">
                    <label className="text-[10px] font-sans font-bold uppercase tracking-[0.2em] text-molasses/60 mb-2.5 block">
                      Select Size
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      {product.variants.map((v: any) => (
                        <button
                          key={v.id}
                          onClick={() => setSelectedVariant(v)}
                          className={`min-h-[44px] py-3 px-4 rounded-none text-xs font-sans font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer text-center ${
                            selectedVariant.id === v.id
                              ? 'bg-molasses text-cream shadow-sm scale-[1.02]'
                              : 'bg-cream-dark/30 text-molasses border border-molasses/20 hover:border-gold hover:bg-cream-dark'
                          }`}
                          id={`variant-${v.id}`}
                        >
                          {v.weight}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Quantity Selector UI (Strict Zero-Curve Geometry & Minimum 44px tap targets) */}
                <div className="mb-6">
                  <label className="text-[10px] font-sans font-bold uppercase tracking-[0.2em] text-molasses/60 mb-2.5 block">
                    Quantity
                  </label>
                  <div className="flex items-center border border-molasses/20 rounded-none bg-cream-dark/20 p-1 w-max">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-11 h-11 rounded-none flex items-center justify-center text-molasses hover:bg-molasses hover:text-cream transition-colors duration-200 text-lg font-bold cursor-pointer select-none"
                      id="qty-decrease"
                      aria-label="Decrease quantity"
                    >
                      -
                    </button>

                    <span className="w-12 text-center text-sm font-bold font-sans text-molasses select-none">
                      {quantity}
                    </span>

                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-11 h-11 rounded-none flex items-center justify-center text-molasses hover:bg-molasses hover:text-cream transition-colors duration-200 text-lg font-bold cursor-pointer select-none"
                      id="qty-increase"
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Add to Cart CTA (Strict Zero-Curve Geometry) */}
                <div className="pt-2">
                  <Button
                    onClick={handleAddToCart}
                    variant="primary"
                    className={`w-full py-4.5 md:py-5 ${addedToCart ? 'bg-forest hover:bg-forest text-white' : ''}`}
                    id="add-to-cart-detail"
                  >
                    {addedToCart ? (
                      <span className="flex items-center gap-2">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                        Added to Cart
                      </span>
                    ) : (
                      <span className="flex items-center gap-2 whitespace-nowrap">
                        Add to Cart — ₹{(selectedVariant.price * quantity).toLocaleString('en-IN')}
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="transition-transform ml-1">
                          <line x1="5" y1="12" x2="19" y2="12" />
                          <polyline points="12 5 19 12 12 19" />
                        </svg>
                      </span>
                    )}
                  </Button>
                </div>

                {/* Trust Badges */}
                <div className="flex items-center justify-center gap-6 pt-4 text-[11px] font-sans font-medium uppercase tracking-wider text-molasses/60">
                  <span className="flex items-center gap-1.5">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="1" y="3" width="15" height="13" />
                      <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
                      <circle cx="5.5" cy="18.5" r="2.5" />
                      <circle cx="18.5" cy="18.5" r="2.5" />
                    </svg>
                    Free over ₹999
                  </span>
                  <span className="flex items-center gap-1.5">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
