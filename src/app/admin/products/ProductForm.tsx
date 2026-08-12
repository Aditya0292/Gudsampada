'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { uploadProductImage } from '@/lib/supabase/storage'
import { productSchema, ProductFormValues } from '@/lib/validation/productSchema'
import { AdminProduct } from './ProductsTable'

interface ProductFormProps {
  initialProduct?: AdminProduct
  isEdit?: boolean
}

function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9 -]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

export default function ProductForm({ initialProduct, isEdit = false }: ProductFormProps): React.JSX.Element {
  const router = useRouter()
  const [name, setName] = useState(initialProduct?.name || '')
  const [slug, setSlug] = useState(initialProduct?.slug || '')
  const [description, setDescription] = useState(initialProduct?.description || '')
  const [price250g, setPrice250g] = useState<number>(initialProduct?.price_250g || 149)
  const [price500g, setPrice500g] = useState<number>(initialProduct?.price_500g || 279)
  const [stock250g, setStock250g] = useState<number>(initialProduct?.stock_250g ?? 50)
  const [stock500g, setStock500g] = useState<number>(initialProduct?.stock_500g ?? 50)
  const [isActive, setIsActive] = useState<boolean>(initialProduct?.is_active ?? true)
  const [imageUrl, setImageUrl] = useState<string>(initialProduct?.image_url || '')
  
  // Marketing & Classification Fields
  const [tagline, setTagline] = useState((initialProduct as any)?.tagline || '')
  const [category, setCategory] = useState<'powders'|'bites'>((initialProduct as any)?.category || 'powders')
  const [badge, setBadge] = useState((initialProduct as any)?.badge || '')
  const [howToUse, setHowToUse] = useState((initialProduct as any)?.how_to_use || '')
  const [benefits, setBenefits] = useState<string[]>((initialProduct as any)?.benefits || [])

  const handleAddBenefit = () => {
    setBenefits([...benefits, ''])
  }

  const handleBenefitChange = (index: number, value: string) => {
    const newBenefits = [...benefits]
    newBenefits[index] = value
    setBenefits(newBenefits)
  }

  const handleRemoveBenefit = (index: number) => {
    setBenefits(benefits.filter((_, i) => i !== index))
  }

  const [uploadingImage, setUploadingImage] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [validationError, setValidationError] = useState<string | null>(null)

  // Auto-generate slug when name changes on creation
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    setName(val)
    if (!isEdit) {
      setSlug(generateSlug(val))
    }
  }

  // Handle Drag/Drop File Upload to Supabase Storage
  const handleImageFile = async (file: File) => {
    setUploadingImage(true)
    setValidationError(null)
    try {
      const publicUrl = await uploadProductImage(file)
      setImageUrl(publicUrl)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Image upload failed'
      setValidationError(msg)
    } finally {
      setUploadingImage(false)
    }
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files[0]) {
      handleImageFile(files[0])
    }
  }

  // Handle Form Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setValidationError(null)
    setIsSubmitting(true)

    const payload: ProductFormValues = {
      name,
      slug,
      description,
      price_250g: Number(price250g),
      price_500g: Number(price500g),
      stock_250g: Number(stock250g),
      stock_500g: Number(stock500g),
      is_active: isActive,
      image_url: imageUrl,
      tagline,
      how_to_use: howToUse,
      category,
      badge,
      benefits: benefits.filter(b => b.trim() !== '')
    }

    // Zod Validation
    const validation = productSchema.safeParse(payload)
    if (!validation.success) {
      const firstErr = validation.error.issues[0]?.message || 'Form validation failed'
      setValidationError(firstErr)
      setIsSubmitting(false)
      return
    }

    try {
      const dbPayload = { ...payload }

      if (isEdit && initialProduct?.id) {
        // Update existing row
        const response = await fetch('/api/admin/products', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...dbPayload, id: initialProduct.id })
        })
        const result = await response.json()
        if (!response.ok) throw new Error(result.error)
      } else {
        // Insert new row
        const response = await fetch('/api/admin/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(dbPayload)
        })
        const result = await response.json()
        if (!response.ok) throw new Error(result.error)
      }

      router.push('/admin/products')
      router.refresh()
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to save product'
      setValidationError(msg)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8 w-full">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <Link
          href="/admin/products"
          className="text-xs font-sans text-molasses/70 hover:text-gold font-bold uppercase tracking-wider"
        >
          ← Back to Catalog
        </Link>
        <button
          type="submit"
          disabled={isSubmitting || uploadingImage}
          className="inline-flex items-center justify-center bg-[#1C1C1A] hover:bg-gold text-white text-xs font-sans font-bold uppercase tracking-wider px-6 py-3 rounded-none transition-all disabled:opacity-50 cursor-pointer w-full sm:w-auto"
        >
          {isSubmitting ? 'Saving Product...' : isEdit ? 'Update Product' : 'Create Product'}
        </button>
      </div>

      {validationError && (
        <div className="p-4 bg-terracotta/10 border border-terracotta/40 text-terracotta text-xs font-sans rounded-none">
          ⚠️ {validationError}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
        {/* Left Column (8 cols): Main Form Fields */}
        <div className="lg:col-span-8 space-y-6 bg-white border border-[#1C1C1A]/15 p-4 sm:p-6 rounded-none shadow-sm">
          <h2 className="font-heading text-xl font-bold text-[#1C1C1A] border-b border-[#1C1C1A]/10 pb-3">
            Product General Details
          </h2>

          {/* Name */}
          <div>
            <label className="block text-[10px] font-sans font-bold uppercase tracking-[0.2em] text-[#8C7A6B] mb-2">
              Product Name *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={handleNameChange}
              placeholder="e.g. Ginger Jaggery Powder"
              className="w-full h-11 bg-[#F9F6F0] border border-[#1C1C1A]/20 px-3 text-sm font-sans text-[#1C1C1A] focus:outline-none focus:border-gold rounded-none"
            />
          </div>

          {/* Slug */}
          <div>
            <label className="block text-[10px] font-sans font-bold uppercase tracking-[0.2em] text-[#8C7A6B] mb-2">
              URL Slug *
            </label>
            <input
              type="text"
              required
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="ginger-jaggery-powder"
              className="w-full h-11 bg-[#F9F6F0] border border-[#1C1C1A]/20 px-3 text-sm font-mono text-[#1C1C1A] focus:outline-none focus:border-gold rounded-none"
            />
          </div>

          {/* Tagline */}
          <div>
            <label className="block text-[10px] font-sans font-bold uppercase tracking-[0.2em] text-[#8C7A6B] mb-2">
              Tagline (Optional)
            </label>
            <input
              type="text"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              placeholder="e.g. Sweet Cravings, The Gud Way"
              className="w-full h-11 bg-[#F9F6F0] border border-[#1C1C1A]/20 px-3 text-sm font-sans text-[#1C1C1A] focus:outline-none focus:border-gold rounded-none"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-[10px] font-sans font-bold uppercase tracking-[0.2em] text-[#8C7A6B] mb-2">
              Product Description *
            </label>
            <textarea
              rows={4}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe origin, flavor profile, and health benefits..."
              className="w-full bg-[#F9F6F0] border border-[#1C1C1A]/20 p-3 text-sm font-sans text-[#1C1C1A] focus:outline-none focus:border-gold rounded-none"
            />
          </div>

          {/* How To Use */}
          <div>
            <label className="block text-[10px] font-sans font-bold uppercase tracking-[0.2em] text-[#8C7A6B] mb-2">
              How To Use (Optional)
            </label>
            <textarea
              rows={2}
              value={howToUse}
              onChange={(e) => setHowToUse(e.target.value)}
              placeholder="e.g. Add 1-2 TSP daily or as required to hot tea..."
              className="w-full bg-[#F9F6F0] border border-[#1C1C1A]/20 p-3 text-sm font-sans text-[#1C1C1A] focus:outline-none focus:border-gold rounded-none"
            />
          </div>

          {/* Category & Badge */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-sans font-bold uppercase tracking-[0.2em] text-[#8C7A6B] mb-2">
                Category *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as 'powders'|'bites')}
                className="w-full h-11 bg-[#F9F6F0] border border-[#1C1C1A]/20 px-3 text-sm font-sans text-[#1C1C1A] focus:outline-none focus:border-gold rounded-none"
              >
                <option value="powders">Powders</option>
                <option value="bites">Bites</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-sans font-bold uppercase tracking-[0.2em] text-[#8C7A6B] mb-2">
                Badge (Optional)
              </label>
              <input
                type="text"
                value={badge}
                onChange={(e) => setBadge(e.target.value)}
                placeholder="e.g. Popular, New"
                className="w-full h-11 bg-[#F9F6F0] border border-[#1C1C1A]/20 px-3 text-sm font-sans text-[#1C1C1A] focus:outline-none focus:border-gold rounded-none"
              />
            </div>
          </div>

          {/* Benefits Array */}
          <div className="border-t border-[#1C1C1A]/10 pt-4">
            <div className="flex items-center justify-between mb-2">
              <label className="block text-[10px] font-sans font-bold uppercase tracking-[0.2em] text-[#8C7A6B]">
                Health Benefits
              </label>
              <button type="button" onClick={handleAddBenefit} className="text-[10px] font-bold text-gold uppercase tracking-wider">
                + Add Benefit
              </button>
            </div>
            <div className="space-y-2">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={benefit}
                    onChange={(e) => handleBenefitChange(index, e.target.value)}
                    placeholder={`Benefit ${index + 1}`}
                    className="flex-grow h-11 bg-[#F9F6F0] border border-[#1C1C1A]/20 px-3 text-sm font-sans text-[#1C1C1A] focus:outline-none focus:border-gold rounded-none"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveBenefit(index)}
                    className="h-11 px-3 border border-[#1C1C1A]/20 bg-[#F9F6F0] hover:bg-terracotta hover:text-white transition-colors"
                  >
                    ✕
                  </button>
                </div>
              ))}
              {benefits.length === 0 && (
                <p className="text-xs text-molasses/50 italic py-2">No benefits added yet.</p>
              )}
            </div>
          </div>

          {/* Prices Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-[#1C1C1A]/10 pt-4">
            <div>
              <label className="block text-[10px] font-sans font-bold uppercase tracking-[0.2em] text-[#8C7A6B] mb-2">
                Price 250g (₹) *
              </label>
              <input
                type="number"
                step="1"
                required
                value={price250g}
                onChange={(e) => setPrice250g(parseFloat(e.target.value) || 0)}
                className="w-full h-11 bg-[#F9F6F0] border border-[#1C1C1A]/20 px-3 text-sm font-mono text-[#1C1C1A] focus:outline-none focus:border-gold rounded-none"
              />
            </div>
            <div>
              <label className="block text-[10px] font-sans font-bold uppercase tracking-[0.2em] text-[#8C7A6B] mb-2">
                Price 500g (₹) *
              </label>
              <input
                type="number"
                step="1"
                required
                value={price500g}
                onChange={(e) => setPrice500g(parseFloat(e.target.value) || 0)}
                className="w-full h-11 bg-[#F9F6F0] border border-[#1C1C1A]/20 px-3 text-sm font-mono text-[#1C1C1A] focus:outline-none focus:border-gold rounded-none"
              />
            </div>
          </div>

          {/* Stock Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-[#1C1C1A]/10 pt-4">
            <div>
              <label className="block text-[10px] font-sans font-bold uppercase tracking-[0.2em] text-[#8C7A6B] mb-2">
                Stock Quantity (250g) *
              </label>
              <input
                type="number"
                required
                value={stock250g}
                onChange={(e) => setStock250g(parseInt(e.target.value) || 0)}
                className="w-full h-11 bg-[#F9F6F0] border border-[#1C1C1A]/20 px-3 text-sm font-mono text-[#1C1C1A] focus:outline-none focus:border-gold rounded-none"
              />
            </div>
            <div>
              <label className="block text-[10px] font-sans font-bold uppercase tracking-[0.2em] text-[#8C7A6B] mb-2">
                Stock Quantity (500g) *
              </label>
              <input
                type="number"
                required
                value={stock500g}
                onChange={(e) => setStock500g(parseInt(e.target.value) || 0)}
                className="w-full h-11 bg-[#F9F6F0] border border-[#1C1C1A]/20 px-3 text-sm font-mono text-[#1C1C1A] focus:outline-none focus:border-gold rounded-none"
              />
            </div>
          </div>
        </div>

        {/* Right Column (4 cols): Media Upload & Visibility */}
        <div className="lg:col-span-4 space-y-6">
          {/* Image Upload Area */}
          <div className="bg-white border border-[#1C1C1A]/15 p-4 sm:p-6 rounded-none space-y-4 shadow-sm">
            <h3 className="font-heading text-lg font-bold text-[#1C1C1A] border-b border-[#1C1C1A]/10 pb-2">
              Product Image Media
            </h3>

            {/* Live Preview Box */}
            <div className="relative w-full h-56 bg-[#F9F6F0] border border-[#1C1C1A]/20 flex flex-col items-center justify-center rounded-none overflow-hidden group">
              {imageUrl ? (
                <>
                  <Image src={imageUrl} alt="Product Preview" fill sizes="(max-width: 768px) 100vw, 300px" className="object-contain p-4" />
                  <button
                    type="button"
                    onClick={() => setImageUrl('')}
                    className="absolute top-2 right-2 bg-terracotta text-white text-[9px] font-bold uppercase px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity rounded-none"
                  >
                    Remove Image
                  </button>
                </>
              ) : (
                <div className="text-center p-4 space-y-2">
                  <span className="text-3xl">📷</span>
                  <p className="text-xs font-sans text-molasses/60">No image uploaded yet</p>
                </div>
              )}
            </div>

            {/* Drag & Drop Upload Input */}
            <div className="border-2 border-dashed border-[#1C1C1A]/30 p-4 text-center hover:border-gold transition-colors bg-[#F9F6F0] rounded-none relative">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileInputChange}
                disabled={uploadingImage}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
              />
              <p className="text-xs font-sans font-bold text-[#1C1C1A]">
                {uploadingImage ? 'Compressing & Uploading...' : 'Click or Drag Image to Upload'}
              </p>
              <p className="text-[10px] font-sans text-molasses/50 mt-1">PNG, JPG, WEBP (Auto compressed)</p>
            </div>
          </div>

          {/* Visibility Controls */}
          <div className="bg-white border border-[#1C1C1A]/15 p-4 sm:p-6 rounded-none space-y-4 shadow-sm">
            <h3 className="font-heading text-lg font-bold text-[#1C1C1A] border-b border-[#1C1C1A]/10 pb-2">
              Visibility Status
            </h3>
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="w-4 h-4 text-gold border-[#1C1C1A]/40 focus:ring-0 rounded-none cursor-pointer"
              />
              <span className="text-xs font-sans font-bold text-[#1C1C1A] uppercase tracking-wider">
                Active in Storefront Catalog
              </span>
            </label>
          </div>
        </div>
      </div>
    </form>
  )
}
