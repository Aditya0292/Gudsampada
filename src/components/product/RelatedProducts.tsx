'use client'

import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { getProductsByCategory, Product } from '@/data/products'

interface RelatedProductsProps {
  productId: string
}

export default function RelatedProducts({ productId }: RelatedProductsProps): React.JSX.Element {
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([])

  useEffect(() => {
    async function load() {
      const allProducts = await getProductsByCategory('all')
      setRelatedProducts(allProducts.filter((p) => p.id !== productId).slice(0, 3))
    }
    load()
  }, [productId])

  return (
    <div className="border-t border-molasses/10 pt-20 mt-20">
      <div className="text-center mb-10">
        <span className="text-[10px] font-sans font-bold uppercase tracking-[0.25em] text-gold block mb-1">
          Recommendations
        </span>
        <h2 className="font-heading text-xl md:text-2xl font-light text-molasses lowercase">
          you might also like
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
        {relatedProducts.map((p) => (
          <Link href={`/products/${p.handle}`} key={p.id} className="group block">
            <div className="bg-[#F7F4EE] hover:bg-[#F3EFE7] border border-molasses/10 hover:border-gold/40 p-3.5 flex flex-col justify-between transition-all duration-300">
              <div className="relative aspect-[4/5] bg-[#EBE7DF] overflow-hidden mb-3">
                <Image
                  src={p.image}
                  alt={p.name}
                  fill
                  className="object-contain p-4 transition-transform duration-700 ease-out group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, 25vw"
                />
              </div>
              <div>
                <div className="text-[9px] font-sans font-semibold tracking-[0.18em] uppercase text-[#8C7A6B] mb-1">
                  {p.category}
                </div>
                <h3 className="font-serif text-sm font-normal text-molasses leading-snug tracking-tight mb-2">
                  {p.name.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.slice(1).toLowerCase())}
                </h3>
                <div className="pt-2 border-t border-molasses/10 flex items-baseline justify-between">
                  <span className="text-sm font-sans font-semibold tabular-nums text-[#2D241E]">
                    ₹{p.variants[0].price}
                  </span>
                  <span className="text-[9px] font-sans text-molasses/50 uppercase tracking-wider">
                    / {p.variants[0].weight}
                  </span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
