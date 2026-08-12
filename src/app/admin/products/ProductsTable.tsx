'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

export interface AdminProduct {
  id: string
  name: string
  slug: string
  description?: string | null
  price_250g: number
  price_500g: number
  stock_250g?: number | null
  stock_500g?: number | null
  image_url: string
  is_active: boolean
  created_at?: string
}

interface ProductsTableProps {
  initialProducts: AdminProduct[]
}

export default function ProductsTable({ initialProducts }: ProductsTableProps): React.JSX.Element {
  const [products, setProducts] = useState<AdminProduct[]>(initialProducts)
  const [editingStockId, setEditingStockId] = useState<string | null>(null)
  const [stock250Val, setStock250Val] = useState<number>(0)
  const [stock500Val, setStock500Val] = useState<number>(0)
  const [savingStock, setSavingStock] = useState(false)

  // Soft Delete / Toggle Active Status
  const handleToggleActive = async (productId: string, currentStatus: boolean) => {
    try {
      const supabase = createClient()
      const newStatus = !currentStatus
      const { error } = await (supabase.from('products') as any)
        .update({ is_active: newStatus })
        .eq('id', productId)

      if (error) throw new Error(error.message)

      setProducts((prev) =>
        prev.map((p) => (p.id === productId ? { ...p, is_active: newStatus } : p))
      )
    } catch (err) {
      alert('Failed to update product active status.')
    }
  }

  // Quick Stock Edit Save
  const handleSaveStock = async (productId: string) => {
    setSavingStock(true)
    try {
      const supabase = createClient()
      const { error } = await (supabase.from('products') as any)
        .update({
          stock_250g: stock250Val,
          stock_500g: stock500Val,
        })
        .eq('id', productId)

      if (error) throw new Error(error.message)

      setProducts((prev) =>
        prev.map((p) =>
          p.id === productId ? { ...p, stock_250g: stock250Val, stock_500g: stock500Val } : p
        )
      )
      setEditingStockId(null)
    } catch (err) {
      alert('Failed to update stock numbers.')
    } finally {
      setSavingStock(false)
    }
  }

  // Hard Delete
  const handleDeleteProduct = async (productId: string) => {
    if (!window.confirm('Are you sure you want to permanently delete this product? This cannot be undone.')) return
    try {
      const response = await fetch('/api/admin/products', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: productId }),
      })
      const result = await response.json()
      if (!response.ok) throw new Error(result.error)

      setProducts((prev) => prev.filter((p) => p.id !== productId))
    } catch (err) {
      alert('Failed to delete product.')
    }
  }

  const startEditStock = (product: AdminProduct) => {
    setEditingStockId(product.id)
    setStock250Val(product.stock_250g ?? 50)
    setStock500Val(product.stock_500g ?? 50)
  }

  return (
    <div className="bg-white border border-[#1C1C1A]/15 rounded-none overflow-hidden space-y-4 p-4 sm:p-6 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#1C1C1A]/15 pb-4 gap-3">
        <div>
          <span className="text-[9px] font-sans font-bold uppercase tracking-[0.2em] text-[#8C7A6B] block">
            Catalog Inventory
          </span>
          <h2 className="font-heading text-xl font-bold text-[#1C1C1A]">Products List ({products.length})</h2>
        </div>
        <Link
          href="/admin/products/new"
          className="inline-flex items-center justify-center bg-[#1C1C1A] hover:bg-gold text-white text-xs font-sans font-bold uppercase tracking-widest px-5 py-2.5 rounded-none transition-all whitespace-nowrap w-full sm:w-auto"
        >
          + Add New Product
        </Link>
      </div>

      {products.length === 0 ? (
        <div className="p-8 sm:p-12 text-center text-molasses/60 space-y-3">
          <p className="font-serif text-base sm:text-lg">No products found in catalog.</p>
          <Link
            href="/admin/products/new"
            className="inline-block border border-[#1C1C1A]/30 text-xs font-sans font-bold uppercase tracking-wider px-4 py-2 rounded-none"
          >
            Create First Product →
          </Link>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-sans min-w-[700px]">
            <thead>
              <tr className="border-b-2 border-[#1C1C1A] bg-[#1C1C1A] text-[#F9F6F0] text-[10px] uppercase tracking-wider">
                <th className="py-3.5 px-4 font-bold">Image</th>
                <th className="py-3.5 px-4 font-bold">Product Name & Slug</th>
                <th className="py-3.5 px-4 font-bold">Prices (250g / 500g)</th>
                <th className="py-3.5 px-4 font-bold">Stock Levels (Inline Edit)</th>
                <th className="py-3.5 px-4 font-bold">Status</th>
                <th className="py-3.5 px-4 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1C1C1A]/10">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-[#F9F6F0] transition-colors">
                  {/* Thumbnail Image */}
                  <td className="py-3 px-4">
                    <div className="relative w-12 h-14 bg-[#F9F6F0] border border-[#1C1C1A]/20 rounded-none overflow-hidden flex items-center justify-center">
                      <Image
                        src={product.image_url}
                        alt={product.name}
                        fill
                        sizes="48px"
                        className="object-contain p-1"
                      />
                    </div>
                  </td>

                  {/* Product Name */}
                  <td className="py-3 px-4">
                    <span className="font-bold text-[#1C1C1A] text-sm block">{product.name}</span>
                    <span className="text-[11px] font-mono text-molasses/50">/{product.slug}</span>
                  </td>

                  {/* Prices */}
                  <td className="py-3 px-4 font-mono font-bold text-[#1C1C1A]">
                    ₹{product.price_250g} <span className="text-molasses/40 font-normal">/ 250g</span>
                    <br />
                    ₹{product.price_500g} <span className="text-molasses/40 font-normal">/ 500g</span>
                  </td>

                  {/* Inline Stock Editing */}
                  <td className="py-3 px-4">
                    {editingStockId === product.id ? (
                      <div className="flex items-center space-x-2 bg-[#F9F6F0] p-2 border border-gold">
                        <div className="space-y-1">
                          <label className="text-[9px] uppercase font-bold text-molasses/50 block">250g</label>
                          <input
                            type="number"
                            value={stock250Val}
                            onChange={(e) => setStock250Val(parseInt(e.target.value) || 0)}
                            className="w-16 h-7 bg-white border border-[#1C1C1A]/30 px-1 text-xs font-mono text-molasses"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[9px] uppercase font-bold text-molasses/50 block">500g</label>
                          <input
                            type="number"
                            value={stock500Val}
                            onChange={(e) => setStock500Val(parseInt(e.target.value) || 0)}
                            className="w-16 h-7 bg-white border border-[#1C1C1A]/30 px-1 text-xs font-mono text-molasses"
                          />
                        </div>
                        <button
                          onClick={() => handleSaveStock(product.id)}
                          disabled={savingStock}
                          className="bg-gold text-[#1C1C1A] text-[10px] font-bold uppercase px-2.5 py-1 rounded-none self-end cursor-pointer"
                        >
                          Save
                        </button>
                      </div>
                    ) : (
                      <div
                        onClick={() => startEditStock(product)}
                        className="cursor-pointer hover:bg-gold/10 p-1.5 border border-dashed border-transparent hover:border-gold inline-block group"
                        title="Click to quick-edit stock"
                      >
                        <span className="font-mono text-xs text-[#1C1C1A] font-bold block">
                          250g: {product.stock_250g ?? 50} units
                        </span>
                        <span className="font-mono text-xs text-[#1C1C1A] font-bold block">
                          500g: {product.stock_500g ?? 50} units
                        </span>
                        <span className="text-[9px] font-sans text-gold opacity-0 group-hover:opacity-100 block transition-opacity">
                          ✏️ Click to quick edit
                        </span>
                      </div>
                    )}
                  </td>

                  {/* Status Toggle (Soft Delete) */}
                  <td className="py-3 px-4">
                    <button
                      onClick={() => handleToggleActive(product.id, product.is_active)}
                      className={`text-[9px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-none border cursor-pointer ${
                        product.is_active
                          ? 'bg-forest/15 text-forest border-forest/30'
                          : 'bg-terracotta/15 text-terracotta border-terracotta/30'
                      }`}
                    >
                      {product.is_active ? 'Active' : 'Inactive (Soft Deleted)'}
                    </button>
                  </td>

                  {/* Actions */}
                  <td className="py-3 px-4 text-right space-x-2 whitespace-nowrap">
                    <Link
                      href={`/admin/products/${product.id}/edit`}
                      className="inline-flex items-center justify-center border border-[#1C1C1A]/30 hover:border-[#1C1C1A] hover:bg-[#1C1C1A] hover:text-white text-[#1C1C1A] font-bold text-[10px] uppercase tracking-wider px-3 py-1.5 rounded-none transition-all"
                    >
                      Edit →
                    </Link>
                    <button
                      onClick={() => handleDeleteProduct(product.id)}
                      className="inline-flex items-center justify-center border border-terracotta/30 hover:border-terracotta hover:bg-terracotta hover:text-white text-terracotta font-bold text-[10px] uppercase tracking-wider px-3 py-1.5 rounded-none transition-all cursor-pointer"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
