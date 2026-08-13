'use client'

import { useState, useEffect } from 'react'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import CartDrawer from '@/components/shop/CartDrawer'
import FilterBar from '@/components/shop/FilterBar'
import ProductGrid from '@/components/shop/ProductGrid'
import AnimatedSection from '@/components/ui/AnimatedSection'
import { getProductsByCategory, Product } from '@/data/products'

export default function ShopPage() {
  const [activeCategory, setActiveCategory] = useState('all')
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadProducts() {
      setIsLoading(true)
      const fetchedProducts = await getProductsByCategory(activeCategory)
      setProducts(fetchedProducts)
      setIsLoading(false)
    }
    loadProducts()
  }, [activeCategory])

  return (
    <>
      <Header />
      <CartDrawer />
      <main style={{ background: '#f9f4f1', minHeight: '100vh', fontFamily: 'Outfit, sans-serif', overflowX: 'hidden', paddingTop: '100px' }}>
        <div style={{ width: '100%', maxWidth: '1135px', marginLeft: 'auto', marginRight: 'auto', paddingLeft: '32px', paddingRight: '32px', paddingBottom: '48px' }}>
          
          {/* Header */}
          <AnimatedSection>
            <div style={{ textAlign: 'center', marginBottom: '40px' }}>
              <span style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#8a8880', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px', marginBottom: '16px' }}>
                <span style={{ width: '40px', height: '1px', backgroundColor: '#e5e5e5' }}></span>
                SHOP
                <span style={{ width: '40px', height: '1px', backgroundColor: '#e5e5e5' }}></span>
              </span>
              <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: '48px', fontWeight: 500, color: '#010100', margin: 0, letterSpacing: '-0.02em' }}>
                our <span style={{ fontStyle: 'italic', fontWeight: 400 }}>collection.</span>
              </h1>
              <p style={{ fontSize: '14px', color: '#474741', marginTop: '16px', maxWidth: '480px', margin: '16px auto 0', lineHeight: 1.6 }}>
                Handcrafted in small batches on our family farms in Kolhapur. Pick your favourites.
              </p>
            </div>
          </AnimatedSection>

          {/* Filters */}
          <FilterBar activeCategory={activeCategory} onCategoryChange={setActiveCategory} />

          {/* Grid */}
          {isLoading ? (
            <div style={{ textAlign: 'center', padding: '80px 0' }}>
              <p style={{ fontSize: '14px', color: '#8a8880' }}>Loading products...</p>
            </div>
          ) : products.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '80px 0' }}>
              <span style={{ fontSize: '32px', display: 'block', marginBottom: '12px' }}>🫙</span>
              <p style={{ fontSize: '14px', color: '#8a8880' }}>No products in this category yet.</p>
            </div>
          ) : (
            <ProductGrid products={products} />
          )}

        </div>
      </main>
      <Footer />
    </>
  )
}
