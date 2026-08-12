import { z } from 'zod'

export const productSchema = z.object({
  name: z.string().min(2, 'Product name must be at least 2 characters'),
  slug: z.string().min(2, 'Slug must be at least 2 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  price_250g: z.number().min(0, 'Price for 250g cannot be negative'),
  price_500g: z.number().min(0, 'Price for 500g cannot be negative'),
  stock_250g: z.number().min(0, 'Stock for 250g cannot be negative'),
  stock_500g: z.number().min(0, 'Stock for 500g cannot be negative'),
  is_active: z.boolean().default(true),
  image_url: z.string().min(1, 'Product image URL is required'),
  tagline: z.string().optional(),
  benefits: z.array(z.string()).default([]),
  how_to_use: z.string().optional(),
  category: z.enum(['powders', 'bites']).default('powders'),
  badge: z.string().optional(),
})

export type ProductFormValues = z.infer<typeof productSchema>
