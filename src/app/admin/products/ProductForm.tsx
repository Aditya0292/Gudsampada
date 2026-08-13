'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
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

const S = {
  label: {
    display: 'block',
    fontSize: '10px',
    fontWeight: 700,
    letterSpacing: '0.12em',
    textTransform: 'uppercase' as const,
    color: '#8a8880',
    fontFamily: 'Outfit, sans-serif',
    marginBottom: '8px',
  },
  input: {
    width: '100%',
    border: 'none',
    borderBottom: '1px solid rgba(200,193,182,0.8)',
    background: 'transparent',
    padding: '10px 0',
    fontSize: '14px',
    color: '#010100',
    outline: 'none',
    fontFamily: 'Outfit, sans-serif',
    borderRadius: 0,
  },
  sectionTitle: {
    fontFamily: 'Playfair Display, serif',
    fontSize: '22px',
    fontWeight: 500,
    color: '#010100',
    marginBottom: '32px',
  }
}

export default function ProductForm({ initialProduct, isEdit = false }: ProductFormProps): React.JSX.Element {
  const router = useRouter()
  const [name, setName] = useState(initialProduct?.name || '')
  const [slug, setSlug] = useState(initialProduct?.slug || '')
  const [description, setDescription] = useState(initialProduct?.description || '')
  const [price250g, setPrice250g] = useState<number>(initialProduct?.price_250g || 149)
  const [originalPrice250g, setOriginalPrice250g] = useState<number | ''>(initialProduct?.original_price_250g || '')
  const [price500g, setPrice500g] = useState<number>(initialProduct?.price_500g || 279)
  const [originalPrice500g, setOriginalPrice500g] = useState<number | ''>(initialProduct?.original_price_500g || '')
  const [stock250g, setStock250g] = useState<number>(initialProduct?.stock_250g ?? 50)
  const [stock500g, setStock500g] = useState<number>(initialProduct?.stock_500g ?? 50)
  const [isActive, setIsActive] = useState<boolean>(initialProduct?.is_active ?? true)
  const initialImages = initialProduct?.images?.length ? initialProduct.images : (initialProduct?.image_url ? [initialProduct.image_url] : [])
  const [images, setImages] = useState<string[]>(initialImages)
  
  const [tagline, setTagline] = useState((initialProduct as any)?.tagline || '')
  const [category, setCategory] = useState<'powders'|'bites'>((initialProduct as any)?.category || 'powders')
  const [badge, setBadge] = useState((initialProduct as any)?.badge || '')
  const [howToUse, setHowToUse] = useState((initialProduct as any)?.how_to_use || '')

  // Parse benefits if it comes as a JSON string from the db
  const parsedBenefits = (() => {
    const b = (initialProduct as any)?.benefits
    if (Array.isArray(b)) return b
    if (typeof b === 'string' && b.trim().length > 0) {
      try {
        const parsed = JSON.parse(b)
        if (Array.isArray(parsed)) return parsed
      } catch (e) {
        return [b]
      }
    }
    return ['']
  })()
  const [benefits, setBenefits] = useState<string[]>(parsedBenefits)

  const [uploadingImage, setUploadingImage] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [validationError, setValidationError] = useState<string | null>(null)

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    setName(val)
    if (!isEdit) {
      setSlug(generateSlug(val))
    }
  }

  const handleFileInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      setUploadingImage(true)
      setValidationError(null)
      try {
        const uploadPromises = Array.from(files).map(file => uploadProductImage(file))
        const urls = await Promise.all(uploadPromises)
        setImages(prev => [...prev, ...urls])
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Image upload failed'
        setValidationError(msg)
      } finally {
        setUploadingImage(false)
        // Reset the input value so the same files can be selected again if needed
        e.target.value = ''
      }
    }
  }

  const handleRemoveImage = (indexToRemove: number) => {
    setImages(prev => prev.filter((_, i) => i !== indexToRemove))
  }

  const handleMoveImage = (index: number, direction: 'left' | 'right') => {
    if (direction === 'left' && index > 0) {
      setImages(prev => {
        const newImages = [...prev]
        const temp = newImages[index - 1]
        newImages[index - 1] = newImages[index]
        newImages[index] = temp
        return newImages
      })
    } else if (direction === 'right' && index < images.length - 1) {
      setImages(prev => {
        const newImages = [...prev]
        const temp = newImages[index + 1]
        newImages[index + 1] = newImages[index]
        newImages[index] = temp
        return newImages
      })
    }
  }

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setValidationError(null)
    setIsSubmitting(true)

    const payload: ProductFormValues = {
      name,
      slug,
      description,
      price_250g: Number(price250g),
      original_price_250g: originalPrice250g === '' ? null : Number(originalPrice250g),
      price_500g: Number(price500g),
      original_price_500g: originalPrice500g === '' ? null : Number(originalPrice500g),
      stock_250g: Number(stock250g),
      stock_500g: Number(stock500g),
      is_active: isActive,
      image_url: images[0] || '',
      images,
      tagline,
      how_to_use: howToUse,
      category,
      badge,
      benefits: benefits.filter(b => b.trim() !== '')
    }

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
        const response = await fetch('/api/admin/products', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...dbPayload, id: initialProduct.id })
        })
        const result = await response.json()
        if (!response.ok) throw new Error(result.error)
      } else {
        const response = await fetch('/api/admin/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(dbPayload)
        })
        const result = await response.json()
        if (!response.ok) throw new Error(result.error)
      }
      
      alert(isEdit ? 'Product updated successfully!' : 'Product created successfully!')
      router.push('/admin/products')
      router.refresh()
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to save product'
      setValidationError(msg)
      alert(`Error: ${msg}`) // Show alert so they don't miss the error at the top
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full" style={{ fontFamily: 'Outfit, sans-serif' }}>
      <div className="w-full">
        
        {/* Top Header */}
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '40px', paddingBottom: '24px', borderBottom: '1px solid rgba(200,193,182,0.45)' }}>
          <Link href="/admin/products" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: 600, color: '#474741', textDecoration: 'none' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m15 18-6-6 6-6"/></svg>
            {isEdit ? 'Edit Product' : 'Create Product'}
          </Link>
        </div>

        {validationError && (
          <div style={{ padding: '16px', background: 'rgba(186,26,26,0.08)', border: '1px solid rgba(186,26,26,0.3)', color: '#ba1a1a', fontSize: '13px', marginBottom: '32px' }}>
            ⚠️ {validationError}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-[minmax(0,2fr)_minmax(320px,1fr)] gap-8 lg:gap-12 items-start">
          
          {/* Left Column: General Details */}
          <div className="flex flex-col gap-9">
            <div>
              <h2 style={S.sectionTitle}>General Details</h2>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
                <div>
                  <label style={S.label}>Product Name *</label>
                  <input type="text" required value={name} onChange={handleNameChange} placeholder="Artisan Palm Jaggery Block" style={S.input} />
                </div>

                <div>
                  <label style={S.label}>URL Slug *</label>
                  <input type="text" required value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="artisan-palm-jaggery-block" style={S.input} />
                </div>

                <div>
                  <label style={S.label}>Full Description *</label>
                  <textarea rows={4} required value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Describe origin, flavor profile, and health benefits..." style={{ ...S.input, resize: 'vertical' }} />
                </div>

                <div>
                  <label style={S.label}>Tagline (Optional)</label>
                  <input type="text" value={tagline} onChange={(e) => setTagline(e.target.value)} placeholder="Sweet Cravings, The Gud Way" style={S.input} />
                </div>

                <div>
                  <label style={S.label}>How To Use (Optional)</label>
                  <textarea rows={2} value={howToUse} onChange={(e) => setHowToUse(e.target.value)} placeholder="e.g. Add 1-2 TSP daily or as required to hot tea..." style={{ ...S.input, resize: 'vertical' }} />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                  <div>
                    <label style={S.label}>Category *</label>
                    <select value={category} onChange={(e) => setCategory(e.target.value as 'powders'|'bites')} style={S.input}>
                      <option value="powders">Powders</option>
                      <option value="bites">Bites</option>
                    </select>
                  </div>
                  <div>
                    <label style={S.label}>Badge (Optional)</label>
                    <input type="text" value={badge} onChange={(e) => setBadge(e.target.value)} placeholder="Popular, New" style={S.input} />
                  </div>
                </div>
              </div>
            </div>

            {/* Prices & Stock Section */}
            <div>
              <h2 style={S.sectionTitle}>Pricing &amp; Inventory</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
                {/* 250g Variant */}
                <div style={{ padding: '20px', border: '1px solid rgba(200,193,182,0.3)', background: '#fff' }}>
                  <h3 style={{ fontSize: '13px', fontWeight: 600, color: '#010100', marginBottom: '16px', letterSpacing: '0.05em', textTransform: 'uppercase' }}>250g Variant</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <div>
                      <label style={S.label}>Actual Price (₹) *</label>
                      <input type="number" required value={price250g} onChange={(e) => setPrice250g(Number(e.target.value))} style={S.input} />
                    </div>
                    <div>
                      <label style={S.label}>Original Price (MRP)</label>
                      <input type="number" value={originalPrice250g} onChange={(e) => setOriginalPrice250g(e.target.value ? Number(e.target.value) : '')} placeholder="Optional" style={S.input} />
                    </div>
                    <div>
                      <label style={S.label}>Stock Quantity *</label>
                      <input type="number" required value={stock250g} onChange={(e) => setStock250g(Number(e.target.value))} style={S.input} />
                    </div>
                  </div>
                </div>

                {/* 500g Variant */}
                <div style={{ padding: '20px', border: '1px solid rgba(200,193,182,0.3)', background: '#fff' }}>
                  <h3 style={{ fontSize: '13px', fontWeight: 600, color: '#010100', marginBottom: '16px', letterSpacing: '0.05em', textTransform: 'uppercase' }}>500g Variant</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <div>
                      <label style={S.label}>Actual Price (₹) *</label>
                      <input type="number" required value={price500g} onChange={(e) => setPrice500g(Number(e.target.value))} style={S.input} />
                    </div>
                    <div>
                      <label style={S.label}>Original Price (MRP)</label>
                      <input type="number" value={originalPrice500g} onChange={(e) => setOriginalPrice500g(e.target.value ? Number(e.target.value) : '')} placeholder="Optional" style={S.input} />
                    </div>
                    <div>
                      <label style={S.label}>Stock Quantity *</label>
                      <input type="number" required value={stock500g} onChange={(e) => setStock500g(Number(e.target.value))} style={S.input} />
                    </div>
                  </div>
                </div>
              </div>
              </div>
            </div>

            {/* Benefits */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h2 style={{ ...S.sectionTitle, marginBottom: 0 }}>Health Benefits</h2>
                <button type="button" onClick={handleAddBenefit} style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#c9a96e', background: 'none', border: 'none', cursor: 'pointer' }}>
                  + Add Benefit
                </button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {benefits.map((benefit, index) => (
                  <div key={index} style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <input type="text" value={benefit} onChange={(e) => handleBenefitChange(index, e.target.value)} placeholder={`Benefit ${index + 1}`} style={S.input} />
                    <button type="button" onClick={() => handleRemoveBenefit(index)} style={{ background: 'none', border: 'none', color: '#ba1a1a', cursor: 'pointer', fontSize: '16px', padding: '0 8px' }}>✕</button>
                  </div>
                ))}
                {benefits.length === 0 && (
                  <p style={{ fontSize: '13px', color: '#8a8880', fontStyle: 'italic' }}>No benefits added yet.</p>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Imagery & Controls */}
          <div className="flex flex-col gap-9 lg:sticky lg:top-28">
            <div>
              <h2 style={S.sectionTitle}>Imagery</h2>
              
              <div style={{ border: '1px solid rgba(200,193,182,0.5)', background: '#fff', padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {/* Image Gallery Grid */}
                {images.length > 0 ? (
                  <div className="grid grid-cols-3 gap-3">
                    {images.map((imgUrl, idx) => (
                      <div key={imgUrl} className="relative aspect-square border border-[#c8c7bf]/50 bg-[#fcfaf9] group">
                        <Image src={imgUrl} alt={`Product Image ${idx + 1}`} fill className="object-contain p-2" />
                        
                        {/* Primary Badge */}
                        {idx === 0 && (
                          <div className="absolute top-2 left-2 bg-[#1c1b1a] text-white text-[9px] font-bold tracking-wider uppercase px-2 py-1 z-10">
                            Primary
                          </div>
                        )}

                        {/* Controls Overlay */}
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-2">
                          <div className="flex justify-between w-full">
                            <div className="flex gap-1">
                              {idx > 0 && (
                                <button type="button" onClick={() => handleMoveImage(idx, 'left')} className="w-7 h-7 bg-white text-black flex items-center justify-center text-xs hover:bg-[#c9a96e] transition-colors">
                                  ←
                                </button>
                              )}
                              {idx < images.length - 1 && (
                                <button type="button" onClick={() => handleMoveImage(idx, 'right')} className="w-7 h-7 bg-white text-black flex items-center justify-center text-xs hover:bg-[#c9a96e] transition-colors">
                                  →
                                </button>
                              )}
                            </div>
                            <button type="button" onClick={() => handleRemoveImage(idx)} className="w-7 h-7 bg-[#ba1a1a] text-white flex items-center justify-center text-xs hover:bg-red-700 transition-colors">
                              ✕
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{ width: '100%', height: '200px', background: '#fcfaf9', border: '1.5px dashed rgba(200,193,182,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ textAlign: 'center', color: '#8a8880' }}>
                      <p style={{ fontSize: '28px', margin: 0 }}>📷</p>
                      <p style={{ fontSize: '12px', marginTop: '8px' }}>No images uploaded yet</p>
                    </div>
                  </div>
                )}

                {/* Upload Trigger Button */}
                <div style={{ position: 'relative', border: '1.5px solid #1c1b1a', textAlign: 'center', padding: '12px', cursor: 'pointer', background: '#fdf8f7' }}>
                  <input type="file" multiple accept="image/*" onChange={handleFileInputChange} disabled={uploadingImage} style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer', width: '100%', height: '100%' }} />
                  <span style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#1c1b1a' }}>
                    {uploadingImage ? 'Uploading...' : '+ Add Images'}
                  </span>
                </div>
              </div>
            </div>

            {/* Visibility Controls */}
            <div style={{ border: '1px solid rgba(200,193,182,0.5)', background: '#fff', padding: '24px' }}>
              <h3 style={{ ...S.sectionTitle, fontSize: '16px', marginBottom: '20px' }}>Visibility Status</h3>
              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                <input type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} style={{ width: '16px', height: '16px', border: '1.5px solid #1c1b1a', borderRadius: 0, outline: 'none', cursor: 'pointer' }} />
                <span style={{ fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#1c1b1a' }}>
                  Active in storefront catalog
                </span>
              </label>
            </div>

            {/* Main Submit Action Button */}
            <button
              type="submit"
              disabled={isSubmitting || uploadingImage}
              style={{
                width: '100%',
                background: '#1c1b1a',
                color: '#fff',
                border: 'none',
                padding: '16px',
                fontSize: '12px',
                fontWeight: 700,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                cursor: 'pointer',
                opacity: isSubmitting || uploadingImage ? 0.6 : 1,
                transition: 'opacity 0.15s',
                marginBottom: '56px',
              }}
            >
              {isSubmitting ? 'Saving Changes...' : isEdit ? 'Update Product' : 'Create Product'}
            </button>
          </div>

        </div>
      </div>
    </form>
  )
}
