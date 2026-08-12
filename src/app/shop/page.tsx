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
 <main className="main-page-padding pb-32 min-h-screen bg-cream">
 <div className="container-main">
 <AnimatedSection>
 <div className="flex flex-col items-center text-center mb-14">
 <span className="overline text-center block">Shop</span>
 <h1 className="font-heading text-4xl md:text-[3.25rem] font-light text-molasses mt-4 mb-5 leading-tight lowercase">
 our <span className="italic font-normal">collection.</span>
 </h1>
 <p className="text-molasses-lighter text-[15px] max-w-xl mx-auto leading-relaxed text-center">
 Handcrafted in small batches on our family farms in Kolhapur. Pick your favourites.
 </p>
 </div>
 </AnimatedSection>

 <FilterBar
 activeCategory={activeCategory}
 onCategoryChange={setActiveCategory}
 />

 <ProductGrid products={products} />

 {isLoading ? (
 <div className="text-center py-20">
 <div className="animate-pulse w-8 h-8 rounded-full border-2 border-molasses border-t-transparent animate-spin mx-auto mb-4"></div>
 <p className="text-molasses-lighter text-sm">Loading products...</p>
 </div>
 ) : products.length === 0 ? (
 <div className="text-center py-20">
 <span className="text-4xl mb-4 block">🫙</span>
 <p className="text-molasses-lighter text-sm">
 No products in this category yet.
 </p>
 </div>
 ) : null}
 </div>
 </main>
 <Footer />
 </>
 )
}
