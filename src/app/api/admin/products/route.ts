import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { createServerSupabaseClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
  try {
    const supabaseAuth = await createServerSupabaseClient()
    const { data: { user } } = await supabaseAuth.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const payload = await request.json()
    
    const cleanPayload = {
      name: payload.name,
      slug: payload.slug,
      description: payload.description,
      price_250g: Number(payload.price_250g),
      price_500g: Number(payload.price_500g),
      stock_250g: Number(payload.stock_250g),
      stock_500g: Number(payload.stock_500g),
      original_price_250g: payload.original_price_250g ? Number(payload.original_price_250g) : null,
      original_price_500g: payload.original_price_500g ? Number(payload.original_price_500g) : null,
      image_url: payload.image_url,
      is_active: payload.is_active ?? true,
      tagline: payload.tagline || null,
      how_to_use: payload.how_to_use || null,
      category: payload.category || 'powders',
      badge: payload.badge || null,
      benefits: Array.isArray(payload.benefits) ? JSON.stringify(payload.benefits) : '[]',
      images: payload.images || []
    }

    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    const { data, error } = await supabaseAdmin
      .from('products')
      .insert([cleanPayload])
      .select()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, data })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const supabaseAuth = await createServerSupabaseClient()
    const { data: { user } } = await supabaseAuth.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const payload = await request.json()
    const { id, ...updateData } = payload
    
    if (!id) {
      return NextResponse.json({ error: 'Product ID is required for update' }, { status: 400 })
    }

    const cleanUpdate = {
      name: updateData.name,
      slug: updateData.slug,
      description: updateData.description,
      price_250g: Number(updateData.price_250g),
      price_500g: Number(updateData.price_500g),
      stock_250g: Number(updateData.stock_250g),
      stock_500g: Number(updateData.stock_500g),
      original_price_250g: updateData.original_price_250g ? Number(updateData.original_price_250g) : null,
      original_price_500g: updateData.original_price_500g ? Number(updateData.original_price_500g) : null,
      image_url: updateData.image_url,
      is_active: updateData.is_active ?? true,
      tagline: updateData.tagline || null,
      how_to_use: updateData.how_to_use || null,
      category: updateData.category || 'powders',
      badge: updateData.badge || null,
      benefits: Array.isArray(updateData.benefits) ? JSON.stringify(updateData.benefits) : '[]',
      images: updateData.images || []
    }

    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    const { data, error } = await supabaseAdmin
      .from('products')
      .update(cleanUpdate)
      .eq('id', id)
      .select()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, data })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const supabaseAuth = await createServerSupabaseClient()
    const { data: { user } } = await supabaseAuth.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await request.json()
    
    if (!id) {
      return NextResponse.json({ error: 'Product ID is required for deletion' }, { status: 400 })
    }

    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    const { error } = await supabaseAdmin
      .from('products')
      .delete()
      .eq('id', id)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 })
  }
}
