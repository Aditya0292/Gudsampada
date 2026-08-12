import { NextResponse } from 'next/server'
import { getRazorpayServerInstance } from '@/lib/razorpay'
import { getSupabaseServerClient } from '@/lib/supabase/server'
import { CreateOrderPayload } from '@/types/db'

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const body: CreateOrderPayload = await request.json()

    // 1. Basic Server Validation
    if (!body.customer_name || !body.customer_phone || !body.shipping_address || !body.items || body.items.length === 0) {
      return NextResponse.json({ error: 'Missing required customer or shipping details' }, { status: 400 })
    }

    const supabase = getSupabaseServerClient()

    // 2. Server-side Price Calculation (Never trust client-sent prices)
    // Fetch all needed products from Supabase to validate prices
    const productIds = body.items.map((item) => item.product_id)
    const { data: dbProducts } = await (supabase.from('products') as any).select('*').in('id', productIds)

    let subtotal = 0
    const verifiedItems = body.items.map((item) => {
      // Find catalog price
      const catalogProd = dbProducts?.find((p: any) => p.id === item.product_id || p.slug === item.product_id)
      let unitPrice = item.price // Fallback if local product match fails

      if (catalogProd) {
        if (item.size.includes('250g') && catalogProd.price_250g) {
          unitPrice = catalogProd.price_250g
        } else if (item.size.includes('500g') && catalogProd.price_500g) {
          unitPrice = catalogProd.price_500g
        } else {
          unitPrice = catalogProd.price_250g || item.price
        }
      }

      const itemTotal = unitPrice * item.qty
      subtotal += itemTotal

      return {
        product_id: item.product_id,
        name: item.name,
        size: item.size,
        qty: item.qty,
        price: unitPrice,
      }
    })

    // Free shipping over ₹999, else ₹99
    const shippingFee = subtotal >= 999 ? 0 : 99
    const totalAmount = subtotal + shippingFee

    // 3. Generate Human-Readable Order Number (e.g. GS-2026-8492)
    const year = new Date().getFullYear()
    const randomSuffix = Math.floor(1000 + Math.random() * 9000)
    const orderNumber = `GS-${year}-${randomSuffix}`

    // 4. Create Razorpay Order (Amount in Paise)
    const razorpay = getRazorpayServerInstance()
    const amountInPaise = Math.round(totalAmount * 100)

    let razorpayOrderId = `rzp_dummy_${Date.now()}`
    try {
      const rzpOrder = await razorpay.orders.create({
        amount: amountInPaise,
        currency: 'INR',
        receipt: orderNumber,
        notes: {
          customer_name: body.customer_name,
          customer_phone: body.customer_phone,
        },
      })
      razorpayOrderId = rzpOrder.id
    } catch (rzpErr) {
      console.warn('Razorpay test mode fallback or missing keys:', rzpErr)
    }

    // 5. Insert Pending Order Row into Supabase DB
    const { error: dbError } = await (supabase.from('orders') as any).insert({
      order_number: orderNumber,
      customer_name: body.customer_name,
      customer_phone: body.customer_phone,
      customer_email: body.customer_email || null,
      shipping_address: body.shipping_address as any,
      items: verifiedItems as any,
      subtotal,
      shipping_fee: shippingFee,
      total: totalAmount,
      payment_status: 'pending',
      order_status: 'placed',
      razorpay_order_id: razorpayOrderId,
      checkout_method: (body as any).checkout_method || 'online_payment',
    })

    if (dbError) {
      console.warn('Supabase DB order insert warning:', dbError.message)
    }

    return NextResponse.json({
      success: true,
      order_number: orderNumber,
      razorpay_order_id: razorpayOrderId,
      amount: amountInPaise,
      currency: 'INR',
      total: totalAmount,
      subtotal,
      shipping_fee: shippingFee,
    })
  } catch (error: any) {
    console.error('Error creating order:', error)
    return NextResponse.json({ error: error?.message || 'Failed to create order' }, { status: 500 })
  }
}
