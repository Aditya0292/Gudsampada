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
  original_price_250g?: number | null
  price_500g: number
  original_price_500g?: number | null
  stock_250g?: number | null
  stock_500g?: number | null
  image_url: string
  images?: string[] | null
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

  const handleToggleActive = (productId: string, currentStatus: boolean) => {
    const newStatus = !currentStatus
    setProducts((prev) => prev.map((p) => (p.id === productId ? { ...p, is_active: newStatus } : p)))
  }

  const handleSaveStock = async (productId: string) => {
    setSavingStock(true)
    try {
      const supabase = createClient()
      const { error } = await (supabase.from('products') as any)
        .update({ stock_250g: stock250Val, stock_500g: stock500Val })
        .eq('id', productId)
      if (error) throw new Error(error.message)
      setProducts((prev) =>
        prev.map((p) => (p.id === productId ? { ...p, stock_250g: stock250Val, stock_500g: stock500Val } : p))
      )
      setEditingStockId(null)
    } catch {
      alert('Failed to update stock numbers.')
    } finally {
      setSavingStock(false)
    }
  }

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
    } catch {
      alert('Failed to delete product.')
    }
  }

  const startEditStock = (product: AdminProduct) => {
    setEditingStockId(product.id)
    setStock250Val(product.stock_250g ?? 50)
    setStock500Val(product.stock_500g ?? 50)
  }

  return (
    <div style={{ fontFamily: 'Outfit, sans-serif' }}>
      {products.length === 0 ? (
        <div className="p-12 text-center text-[#474741]">
          <p className="text-base font-medium mb-3">No products in catalog yet.</p>
          <Link href="/admin/products/new"
            className="inline-block border border-[#1c1c1a] text-[#1c1c1a] text-[11px] font-bold uppercase tracking-wider px-4 py-2 hover:bg-[#1c1c1a] hover:text-white transition-colors">
            Create First Product →
          </Link>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[700px]">
            <thead>
              <tr className="border-b border-[#c8c7bf]/30 text-[11px] font-bold uppercase tracking-wider text-[#474741]">
                <th className="py-5 pr-6 font-semibold">Image</th>
                <th className="py-5 px-4 font-semibold">Product</th>
                <th className="py-5 px-4 font-semibold">Stock Level</th>
                <th className="py-5 px-4 font-semibold">Status</th>
                <th className="py-5 pl-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#c8c7bf]/15">
              {products.map((product) => (
                <tr key={product.id} className="group hover:bg-[#f7f3f2]/50 transition-colors">
                  <td className="py-5 pr-6">
                    <div className="relative w-14 h-16 bg-[#f1edec] overflow-hidden shrink-0">
                      <Image src={product.image_url} alt={product.name} fill sizes="56px" className="object-contain p-1" />
                    </div>
                  </td>
                  <td className="py-5 px-4">
                    <p className="text-base font-semibold text-[#010100]" style={{ fontFamily: 'Playfair Display, serif' }}>{product.name}</p>
                    <p className="text-xs text-[#474741] font-mono mt-0.5">/{product.slug}</p>
                    <p className="text-xs text-[#474741] mt-1">
                      ₹{product.price_250g} <span className="text-[#777771]">/ 250g</span>
                      &nbsp;&nbsp;·&nbsp;&nbsp;
                      ₹{product.price_500g} <span className="text-[#777771]">/ 500g</span>
                    </p>
                  </td>
                  <td className="py-5 px-4 align-top pt-6">
                    {editingStockId === product.id ? (
                      <div className="flex items-end gap-2">
                        <div>
                          <label className="text-[9px] uppercase font-bold text-[#474741] block mb-1">250g</label>
                          <input type="number" value={stock250Val} onChange={(e) => setStock250Val(parseInt(e.target.value) || 0)}
                            className="w-16 h-8 border-b border-[#735c00] bg-transparent px-1 text-xs font-mono text-[#010100] focus:outline-none" />
                        </div>
                        <div>
                          <label className="text-[9px] uppercase font-bold text-[#474741] block mb-1">500g</label>
                          <input type="number" value={stock500Val} onChange={(e) => setStock500Val(parseInt(e.target.value) || 0)}
                            className="w-16 h-8 border-b border-[#735c00] bg-transparent px-1 text-xs font-mono text-[#010100] focus:outline-none" />
                        </div>
                        <button onClick={() => handleSaveStock(product.id)} disabled={savingStock}
                          className="bg-[#735c00] text-white text-[10px] font-bold uppercase px-3 py-1.5 rounded-none cursor-pointer hover:bg-[#1c1c1a] transition-colors">
                          Save
                        </button>
                      </div>
                    ) : (
                      <div onClick={() => startEditStock(product)} className="cursor-pointer group/stock" title="Click to quick-edit stock">
                        <p className="text-sm text-[#474741]">{product.stock_250g ?? 50} units <span className="text-xs text-[#777771]">/ 250g</span></p>
                        <p className="text-sm text-[#474741]">{product.stock_500g ?? 50} units <span className="text-xs text-[#777771]">/ 500g</span></p>
                        <p className="text-[10px] text-[#735c00] opacity-0 group-hover/stock:opacity-100 transition-opacity mt-0.5">✏ Edit stock</p>
                      </div>
                    )}
                  </td>
                  <td className="py-5 px-4 align-top pt-6">
                    <button onClick={() => handleToggleActive(product.id, product.is_active)}
                      className={`inline-flex items-center px-2.5 py-1 rounded-none text-[11px] font-semibold border cursor-pointer transition-colors ${
                        product.is_active
                          ? 'bg-[#E8F5E9] text-[#2E7D32] border-[#2E7D32]/20 hover:bg-[#FFEBEE] hover:text-[#ba1a1a] hover:border-[#ba1a1a]/20'
                          : 'bg-[#FFEBEE] text-[#ba1a1a] border-[#ba1a1a]/20 hover:bg-[#E8F5E9] hover:text-[#2E7D32] hover:border-[#2E7D32]/20'
                      }`}>
                      {product.is_active ? 'Active' : 'Inactive'}
                    </button>
                  </td>
                  <td className="py-5 pl-4 align-top pt-6 text-right whitespace-nowrap">
                    <Link
                      href={`/admin/products/${product.id}/edit`}
                      style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#c9a96e', textDecoration: 'none', marginRight: '20px', fontFamily: 'Outfit, sans-serif' }}
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDeleteProduct(product.id)}
                      style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#ba1a1a', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'Outfit, sans-serif' }}
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
