'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { getFeaturedProducts, Product } from '@/data/products'
import AnimatedSection from '@/components/ui/AnimatedSection'
import { useCartStore } from '@/store/cartStore'

export default function ProductShowcase() {
  const [featured, setFeatured] = useState<Product[]>([])
  const addItem = useCartStore((state) => state.addItem)

  useEffect(() => {
    async function loadFeatured() {
      const products = await getFeaturedProducts()
      setFeatured(products.slice(0, 3))
    }
    loadFeatured()
  }, [])

  const handleAddToCart = (e: React.MouseEvent, product: Product) => {
    e.preventDefault()
    e.stopPropagation()
    const variant = product.variants[0]
    if (variant) {
      addItem({
        id: product.id,
        variantId: variant.id,
        name: product.name,
        variant: variant.weight,
        price: variant.price,
        image: product.image,
      })
    }
  }

  return (
    <section className="bg-cream py-16 md:py-24" style={{ fontFamily: 'Outfit, sans-serif' }}>
      <div className="container-main max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <AnimatedSection>
          <div style={{ textAlign: 'center', marginBottom: '56px' }}>
            <span style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', color: '#c9a96e', display: 'block', marginBottom: '8px' }}>
              Curated Harvest
            </span>
            <h2 className="text-3xl md:text-4xl" style={{ fontFamily: 'Playfair Display, serif', fontWeight: 500, color: '#010100', margin: 0 }}>
              handpicked <span style={{ fontStyle: 'italic', fontWeight: 400 }}>bestsellers.</span>
            </h2>
            <p style={{ fontSize: '14px', color: '#8a8880', marginTop: '12px', maxWidth: '520px', margin: '12px auto 0', lineHeight: 1.6 }}>
              Discover our signature blends, crafted for the discerning palate. No chemicals, no compromises.
            </p>
          </div>
        </AnimatedSection>

        {/* 3-Column Product Grid (Fully Responsive) */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-8 mb-12">
          {featured.map((product, index) => {
            const variant = product.variants[0]
            const categoryLabel = product.category === 'powders' ? 'Artisanal Blend' : 'Bite-Sized Luxury'
            return (
              <AnimatedSection key={product.id} delay={index * 0.1}>
                <Link href={`/products/${product.handle}`} style={{ textDecoration: 'none', display: 'block' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    
                    {/* Square Image Box */}
                    <div style={{ position: 'relative', width: '100%', aspectRatio: '1/1', background: '#f5f0ef', border: '1px solid rgba(200,193,182,0.45)', overflow: 'hidden' }}>
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-contain p-6"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                    </div>

                    {/* Meta Details */}
                    <div>
                      <span style={{ display: 'block', fontSize: '10px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#8a8880', marginBottom: '6px' }}>
                        {categoryLabel}
                      </span>
                      
                      <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: '18px', fontWeight: 500, color: '#010100', margin: '0 0 10px', lineHeight: 1.3 }}>
                        {product.name}
                      </h3>

                      {/* Original Price / Discount Price Row */}
                      {variant && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                          {variant.originalPrice && (
                            <span style={{ fontSize: '12px', color: '#8a8880', textDecoration: 'line-through', fontFamily: 'Outfit, sans-serif' }}>
                              ₹{variant.originalPrice}
                            </span>
                          )}
                          <span style={{ fontSize: '18px', fontWeight: 500, color: '#ba1a1a', fontFamily: 'Playfair Display, serif' }}>
                            ₹{variant.price}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Flat Outline Add to Cart Button */}
                    <button
                      onClick={(e) => handleAddToCart(e, product)}
                      style={{
                        width: '100%',
                        background: 'transparent',
                        border: '1.5px solid #1c1b1a',
                        color: '#1c1b1a',
                        padding: '12px',
                        fontSize: '11px',
                        fontWeight: 700,
                        letterSpacing: '0.12em',
                        textTransform: 'uppercase',
                        cursor: 'pointer',
                        borderRadius: 0,
                        fontFamily: 'Outfit, sans-serif',
                        transition: 'background 0.15s, color 0.15s',
                        boxSizing: 'border-box',
                        marginTop: '4px',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = '#1c1b1a'
                        e.currentTarget.style.color = '#fff'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'transparent'
                        e.currentTarget.style.color = '#1c1b1a'
                      }}
                    >
                      ADD TO CART
                    </button>

                  </div>
                </Link>
              </AnimatedSection>
            )
          })}
        </div>

        {/* View All Products button */}
        <AnimatedSection>
          <div style={{ textAlign: 'center' }}>
            <Link
              href="/shop"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                color: '#c9a96e',
                fontSize: '15px',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.12em',
                textDecoration: 'none',
                transition: 'color 0.15s',
              }}
              className="group"
            >
              View All Products
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="transition-transform group-hover:translate-x-1 duration-200">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </Link>
          </div>
        </AnimatedSection>

      </div>
    </section>
  )
}
