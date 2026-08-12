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
      <main className="main-page-padding py-20 min-h-screen bg-cream">
        <div className="container-main max-w-5xl mx-auto w-full">
          <AnimatedSection className="w-full flex flex-col items-center justify-center">
            <div className="w-full max-w-2xl text-center mb-16 flex flex-col items-center justify-center mx-auto">
              <span className="text-[10px] font-sans font-bold uppercase tracking-[0.25em] text-gold block mb-2 text-center w-full">
                Heritage Kitchen
              </span>
              <h1 className="font-heading text-4xl md:text-5xl font-light text-molasses leading-tight mb-4 text-center w-full">
                artisan <span className="italic font-normal">recipes.</span>
              </h1>
              <p className="w-full text-center text-molasses/75 text-base md:text-lg font-serif font-light leading-relaxed max-w-xl mx-auto block">
                Discover authentic Kolhapuri brews, immunity elixirs, and sweet delicacies made with GudSampada unrefined jaggery.
              </p>
            </div>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16 w-full">
            {recipes.map((recipe, index) => (
              <AnimatedSection key={recipe.id} delay={index * 0.1} className="w-full">
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
