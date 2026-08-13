import React from 'react'
import Link from 'next/link'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import ProductsTable, { AdminProduct } from './ProductsTable'

export default async function AdminProductsPage(): Promise<React.JSX.Element> {
  const supabase = await createServerSupabaseClient()
  const { data: rawProducts } = await (supabase.from('products') as any)
    .select('*')
    .order('created_at', { ascending: false })

  const products = (rawProducts || []) as AdminProduct[]

  return (
    <div style={{ background: '#f9f4f1', minHeight: '100vh', fontFamily: 'Outfit, sans-serif' }}>
      <div className="px-4 sm:px-8 lg:px-12 py-8 md:py-12">

        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-10 pb-6 border-b border-[rgba(200,193,182,0.45)]">
          <div>
            <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: '34px', fontWeight: 500, color: '#010100', margin: 0 }}>
              Products Inventory
            </h1>
            <p style={{ fontSize: '14px', color: '#8a8880', marginTop: '6px', margin: '6px 0 0' }}>
              Manage your artisanal jaggery catalog.
            </p>
          </div>
          <Link href="/admin/products/new" style={{
            display: 'inline-flex', alignItems: 'center', gap: '6px',
            background: '#1c1b1a', color: '#f9f4f1',
            padding: '10px 22px', fontSize: '11px', fontWeight: 700,
            letterSpacing: '0.1em', textTransform: 'uppercase',
            textDecoration: 'none', fontFamily: 'Outfit, sans-serif',
          }}>
            + Add Product
          </Link>
        </div>

        <ProductsTable initialProducts={products} />
      </div>
    </div>
  )
}
