import { createClient } from '@/lib/supabase/client'

export interface ProductVariant {
 id: string
 weight: string
 weightGrams: number
 price: number
 originalPrice?: number
}

export interface Product {
 id: string
 handle: string
 name: string
 tagline: string
 description: string
 benefits: string[]
 howToUse: string
 category: 'powders' | 'bites'
 badge?: string
 image: string
 variants: ProductVariant[]
 featured: boolean
}

export const categories = [
 { id: 'all', label: 'All Products' },
 { id: 'powders', label: 'Powders' },
 { id: 'bites', label: 'Bites' },
] as const

// Helper to map DB format to Frontend format
function mapDBProductToFrontend(dbProduct: any): Product {
  const variants: ProductVariant[] = []
  if (dbProduct.price_250g) {
    variants.push({
      id: `${dbProduct.id}_250g`,
      weight: '250g',
      weightGrams: 250,
      price: dbProduct.price_250g,
      originalPrice: Math.round(dbProduct.price_250g * 1.35)
    })
  }
  if (dbProduct.price_500g) {
    variants.push({
      id: `${dbProduct.id}_500g`,
      weight: '500g',
      weightGrams: 500,
      price: dbProduct.price_500g,
      originalPrice: Math.round(dbProduct.price_500g * 1.35)
    })
  }

  return {
    id: dbProduct.id,
    handle: dbProduct.slug,
    name: dbProduct.name,
    tagline: dbProduct.tagline || 'Sweet Cravings, The Gud Way',
    description: dbProduct.description || '',
    benefits: dbProduct.benefits && dbProduct.benefits.length > 0
      ? dbProduct.benefits
      : [
          'Provides a sustained release of energy throughout the day.',
          'Naturally stimulates digestive enzymes.',
          'Rich in vital minerals like potassium and magnesium.'
        ],
    howToUse: dbProduct.how_to_use || 'Add 1-2 TSP daily or as required to hot tea, warm milk, or beverages.',
    category: dbProduct.category || (dbProduct.slug.includes('bite') ? 'bites' : 'powders'),
    badge: dbProduct.badge || undefined,
    image: dbProduct.image_url || '/images/aaa-removebg-preview.png',
    variants,
    featured: dbProduct.is_active !== false, // Hide if not active
  }
}

export async function getProductByHandle(handle: string): Promise<Product | undefined> {
  const supabase = createClient()
  const { data } = await supabase.from('products').select('*').eq('slug', handle).single()
  if (!data) return undefined
  return mapDBProductToFrontend(data)
}

export async function getFeaturedProducts(): Promise<Product[]> {
  const supabase = createClient()
  const { data } = await supabase.from('products').select('*')
  if (!data) return []
  return data.map(mapDBProductToFrontend)
}

export async function getProductsByCategory(category: string): Promise<Product[]> {
  const supabase = createClient()
  const { data } = await supabase.from('products').select('*')
  if (!data) return []
  
  const allProducts = data.map(mapDBProductToFrontend)
  if (category === 'all') return allProducts
  return allProducts.filter(p => p.category === category)
}
