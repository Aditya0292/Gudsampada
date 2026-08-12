import React from 'react'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import ProductsTable, { AdminProduct } from './ProductsTable'

export default async function AdminProductsPage(): Promise<React.JSX.Element> {
  const supabase = await createServerSupabaseClient()

  const { data: rawProducts } = await (supabase.from('products') as any)
    .select('*')
    .order('created_at', { ascending: false })

  const products = (rawProducts || []) as AdminProduct[]

  return (
    <div className="w-full bg-[#F4F1EA] min-h-screen">
      <div className="w-full px-6 md:px-10 lg:px-12 py-8 space-y-8">
        {/* Header */}
        <div className="border-b border-[#2D241E]/15 pb-6 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-sans font-bold uppercase tracking-[0.25em] text-gold block mb-1">
              Catalog Management
            </span>
            <h1 className="font-heading text-4xl font-light text-molasses">Products Inventory</h1>
          </div>
        </div>

        {/* Products Interactive Table */}
        <ProductsTable initialProducts={products} />
      </div>
    </div>
  )
}
