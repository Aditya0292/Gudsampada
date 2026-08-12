'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Recipe } from '@/data/recipes'

interface RecipeCardProps {
  recipe: Recipe
}

export default function RecipeCard({ recipe }: RecipeCardProps) {
  return (
    <div className="bg-[#F7F4EE] hover:bg-[#F3EFE7] border border-molasses/10 rounded-none p-4 sm:p-5 h-full flex flex-col justify-between transition-all duration-500 shadow-xs hover:shadow-card group">
      <div>
        {/* Image Container (Sharp 90-degree Corners) */}
        <div className="relative w-full aspect-[16/10] bg-[#EBE7DF] rounded-none overflow-hidden mb-4">
          <Image
            src={recipe.image}
            alt={recipe.title}
            fill
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>

        {/* Made with PDP Micro-Badge */}
        <div className="mb-2.5 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-none bg-gold/10 border border-gold/20 text-gold text-[10px] font-sans font-semibold tracking-[0.18em] uppercase">
          <span>🫙</span>
          <span>Made with:</span>
          <Link
            href={`/products/${recipe.relatedProductSlug}`}
            className="font-bold underline hover:text-molasses transition-colors"
          >
            {recipe.relatedProductName}
          </Link>
        </div>

        {/* Title in Restrained Title Casing & Serif Font */}
        <h3 className="font-serif text-base md:text-lg font-normal text-molasses leading-snug tracking-tight mb-2">
          {recipe.title}
        </h3>

        {/* Description */}
        <p className="text-molasses/70 text-xs font-sans leading-relaxed mb-4">
          {recipe.description}
        </p>
      </div>

      {/* Baseline Metadata Row */}
      <div className="pt-3 border-t border-molasses/10 flex items-center justify-between text-[10px] font-sans font-medium uppercase tracking-wider text-molasses/60 mt-auto">
        <span>⏱️ {recipe.prepTime}</span>
        <span>🍽️ {recipe.servings}</span>
      </div>
    </div>
  )
}
