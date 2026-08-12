import React from 'react'
import Link from 'next/link'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import ProductForm from '../../ProductForm'
import { AdminProduct } from '../../ProductsTable'

export default async function AdminEditProductPage({
  params,
}: {
  params: Promise<{ id: string }>
}): Promise<React.JSX.Element> {
  const { id } = await params
  const supabase = await createServerSupabaseClient()

  const { data: rawProduct } = await (supabase.from('products') as any)
    .select('*')
    .eq('id', id)
    .single()

  const product = rawProduct as AdminProduct | null

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center space-y-4">
        <h1 className="font-heading text-3xl font-light text-molasses">Product Not Found</h1>
        <p className="text-xs font-sans text-molasses/60">
          The requested product ID does not exist or has been removed.
        </p>
        <Link
          href="/admin/products"
          className="inline-block bg-[#2D241E] text-cream text-xs font-sans font-bold uppercase tracking-wider px-4 py-2.5 rounded-none"
        >
          ← Return to Products Catalog
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="border-b border-[#2D241E]/15 pb-5">
        <span className="text-[10px] font-sans font-bold uppercase tracking-[0.25em] text-gold block mb-1">
          Catalog Editing
        </span>
        <h1 className="font-heading text-3xl font-light text-molasses">Edit {product.name}</h1>
      </div>

      {/* Product Form */}
      <ProductForm initialProduct={product} isEdit={true} />
    </div>
  )
}
