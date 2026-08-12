import { NextResponse } from 'next/server'
import { getSupabaseServerClient } from '@/lib/supabase/server'

// Rate limit map (max 10 track queries per 15 min per IP)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>()

export async function POST(request: Request): Promise<NextResponse> {
  try {
    // 1. IP Rate Limiting Check
    const clientIp = request.headers.get('x-forwarded-for') || '127.0.0.1'
    const now = Date.now()
    const rateLimit = rateLimitMap.get(clientIp)

    if (rateLimit && now < rateLimit.resetTime) {
      if (rateLimit.count >= 10) {
        return NextResponse.json(
          { error: 'Too many tracking attempts. Please wait a few minutes before trying again.' },
          { status: 429 }
        )
      }
      rateLimit.count += 1
    } else {
      rateLimitMap.set(clientIp, { count: 1, resetTime: now + 15 * 60 * 1000 })
    }

    // 2. Parse payload
    const { order_number, phone } = await request.json()

    if (!order_number || !phone) {
      return NextResponse.json(
        { error: 'Please enter both Order Number and Phone Number.' },
        { status: 400 }
      )
    }

    const cleanOrderNum = String(order_number).trim().toUpperCase()
    const cleanPhone = String(phone).trim()

    // 3. Database Lookup
    const supabase = getSupabaseServerClient()
    const { data: order, error } = await (supabase.from('orders') as any)
      .select('*')
      .eq('order_number', cleanOrderNum)
      .single()

    // Generic error response to prevent order enumeration attacks
    const genericNotFound = 'Order details not found. Please check your Order Number and Phone Number or contact WhatsApp support.'

    if (error || !order) {
      return NextResponse.json({ error: genericNotFound }, { status: 404 })
    }

    // Verify phone number match (check last 10 digits to handle +91 prefix differences)
    const dbPhoneDigits = String(order.customer_phone || '').replace(/\D/g, '').slice(-10)
    const inputPhoneDigits = cleanPhone.replace(/\D/g, '').slice(-10)

    if (!dbPhoneDigits || !inputPhoneDigits || dbPhoneDigits !== inputPhoneDigits) {
      return NextResponse.json({ error: genericNotFound }, { status: 404 })
    }

    // 4. Return Sanity-Filtered Tracking Data
    return NextResponse.json({
      success: true,
      order: {
        order_number: order.order_number,
        customer_name: order.customer_name,
        created_at: order.created_at,
        order_status: order.order_status,
        payment_status: order.payment_status,
        shipping_address: order.shipping_address,
        items: order.items,
        total: order.total,
        courier_name: order.courier_name || null,
        awb_number: order.awb_number || order.tracking_number || null,
        tracking_url: order.tracking_url || (order.awb_number ? `https://shiprocket.co/tracking/${order.awb_number}` : null),
        shipment_status: order.shipment_status || 'pending',
      },
    })
  } catch (err: unknown) {
    console.error('Track Order API Error:', err)
    const msg = err instanceof Error ? err.message : 'Tracking service unavailable'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
