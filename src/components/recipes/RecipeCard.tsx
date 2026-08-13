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
    <div className="p-4 sm:p-5" style={{ height: '100%', border: '1px solid rgba(200,193,182,0.5)', background: '#fff', display: 'flex', flexDirection: 'column', gap: '16px', fontFamily: 'Outfit, sans-serif' }}>
      
      {/* Image Container */}
      <div style={{ position: 'relative', width: '100%', aspectRatio: '16/10', background: '#f5f0ef', border: '1px solid rgba(200,193,182,0.3)', overflow: 'hidden' }}>
        <Image
          src={recipe.image}
          alt={recipe.title}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 100vw, 50vw"
        />
      </div>

      {/* Made with Badge */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '10px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#8a8880' }}>
        <span>🫙</span>
        <span>Made with:</span>
        <Link
          href={`/products/${recipe.relatedProductSlug}`}
          style={{ color: '#c9a96e', textDecoration: 'underline', textUnderlineOffset: '2px' }}
        >
          {recipe.relatedProductName}
        </Link>
      </div>

      {/* Title */}
      <h3 className="text-lg sm:text-xl" style={{ fontFamily: 'Playfair Display, serif', fontWeight: 500, color: '#010100', margin: 0, lineHeight: 1.3 }}>
        {recipe.title}
      </h3>

      {/* Description */}
      <p className="text-[13px] leading-relaxed" style={{ color: '#474741', margin: 0 }}>
        {recipe.description}
      </p>

      {/* Metadata Footer */}
      <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid rgba(200,193,182,0.3)', paddingTop: '12px', fontSize: '11px', fontWeight: 600, letterSpacing: '0.04em', color: '#8a8880', textTransform: 'uppercase', marginTop: 'auto' }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          ⏱ {recipe.prepTime}
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          🍽 {recipe.servings}
        </span>
      </div>

    </div>
  )
}
