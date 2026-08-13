'use client'

import React from 'react'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import CartDrawer from '@/components/shop/CartDrawer'
import AnimatedSection from '@/components/ui/AnimatedSection'
import RecipeCard from '@/components/recipes/RecipeCard'
import { recipes } from '@/data/recipes'

export default function RecipesPage() {
  return (
    <>
      <Header />
      <CartDrawer />
      <main style={{ background: '#f9f4f1', minHeight: '100vh', fontFamily: 'Outfit, sans-serif', paddingTop: '100px' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }} className="px-4 sm:px-8 md:px-12 pb-12">
          
          {/* Header */}
          <AnimatedSection className="w-full flex flex-col items-center justify-center">
            <div style={{ textAlign: 'center', marginBottom: '40px' }}>
              <span style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', color: '#c9a96e', display: 'block', marginBottom: '8px' }}>
                Heritage Kitchen
              </span>
              <h1 className="text-3xl sm:text-[38px]" style={{ fontFamily: 'Playfair Display, serif', fontWeight: 500, color: '#010100', margin: 0 }}>
                artisan <span style={{ fontStyle: 'italic', fontWeight: 400 }}>recipes.</span>
              </h1>
              <p className="text-sm max-w-[520px]" style={{ color: '#8a8880', margin: '12px auto 0', lineHeight: 1.6 }}>
                Discover authentic Kolhapuri brews, immunity elixirs, and sweet delicacies made with GudSampada unrefined jaggery.
              </p>
            </div>
          </AnimatedSection>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-8 mb-10">
            {recipes.map((recipe, index) => (
              <AnimatedSection key={recipe.id} delay={index * 0.1}>
                <RecipeCard recipe={recipe} />
              </AnimatedSection>
            ))}
          </div>

        </div>
      </main>
      <Footer />
    </>
  )
}
