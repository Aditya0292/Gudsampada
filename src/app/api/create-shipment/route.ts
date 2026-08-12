import { NextResponse } from 'next/server'
import { getSupabaseServerClient } from '@/lib/supabase/server'
import { createShiprocketOrder, generateShiprocketAWB } from '@/lib/shiprocket/client'

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const { order_id } = await request.json()

    if (!order_id) {
      return NextResponse.json({ error: 'Order ID is required' }, { status: 400 })
    }

    const supabase = getSupabaseServerClient()

    // 1. Fetch Order Record
    const { data: order, error: orderError } = await (supabase.from('orders') as any)
      .select('*')
      .eq('id', order_id)
      .single()

    if (orderError || !order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    // Check if shipment already created
    if (order.shiprocket_order_id) {
      return NextResponse.json({
        success: true,
        message: 'Shiprocket shipment already exists for this order.',
        shiprocket_order_id: order.shiprocket_order_id,
        awb_number: order.awb_number,
      })
    }

    const shippingAddress = order.shipping_address || {}
    const items = order.items || []

    // 2. Format Order Items for Shiprocket
    let totalWeightKg = 0
    const shiprocketItems = items.map((item: any, idx: number) => {
      const qty = item.qty || 1
      // Estimate item weight: 250g item = 0.3kg gross weight, 500g item = 0.55kg gross weight
      const unitWeight = item.size?.toLowerCase().includes('500') ? 0.55 : 0.3
      totalWeightKg += unitWeight * qty

      return {
        name: item.name || 'Jaggery Product',
        sku: item.product_id || `SKU-${idx + 1}`,
        units: qty,
        selling_price: item.price || 149,
        discount: 0,
        tax: 0,
        hsn: '17029090', // HSN code for Jaggery
      }
    })

    const pickupLocation = process.env.SHIPROCKET_PICKUP_LOCATION || 'Primary'

    // 3. Create Shiprocket Order
    const shiprocketResult = await createShiprocketOrder({
      order_id: order.order_number,
      order_date: new Date(order.created_at).toISOString().replace('T', ' ').substring(0, 19),
      pickup_location: pickupLocation,
      billing_customer_name: order.customer_name,
      billing_address: shippingAddress.line1 || 'Address Line 1',
      billing_city: shippingAddress.city || 'Kolhapur',
      billing_pincode: String(shippingAddress.pincode || '416001'),
      billing_state: shippingAddress.state || 'Maharashtra',
      billing_country: 'India',
      billing_email: order.customer_email || 'orders@gudsampada.com',
      billing_phone: order.customer_phone,
      shipping_is_billing: true,
      order_items: shiprocketItems,
      payment_method: 'Prepaid',
      shipping_charges: Number(order.shipping_fee || 0),
      sub_total: Number(order.subtotal || 0),
      length: 15,
      breadth: 15,
      height: 15,
      weight: Math.max(0.3, Number(totalWeightKg.toFixed(2))),
    })

    let awbNumber = shiprocketResult.awb_code
    let courierName = shiprocketResult.courier_name

    // 4. If AWB not auto-generated, attempt AWB assignment API
    if (!awbNumber && shiprocketResult.shipment_id) {
      try {
        const awbResult = await generateShiprocketAWB(shiprocketResult.shipment_id)
        if (awbResult.awb_code) {
          awbNumber = awbResult.awb_code
          courierName = awbResult.courier_name
        }
      } catch (awbErr) {
        console.warn('[CreateShipment] Optional AWB auto-assignment warning:', awbErr)
      }
    }

    const trackingUrl = awbNumber ? `https://shiprocket.co/tracking/${awbNumber}` : null

    // 5. Update Order Record in Supabase
    await (supabase.from('orders') as any)
      .update({
        order_status: 'shipped',
        shipment_status: awbNumber ? 'shipped' : 'order_created',
        shiprocket_order_id: shiprocketResult.shiprocket_order_id,
        shiprocket_shipment_id: shiprocketResult.shipment_id,
        awb_number: awbNumber || null,
        courier_name: courierName || null,
        tracking_url: trackingUrl,
        tracking_number: awbNumber || null,
      })
      .eq('id', order.id)

    return NextResponse.json({
      success: true,
      message: 'Shiprocket shipment created successfully!',
      shiprocket_order_id: shiprocketResult.shiprocket_order_id,
      shipment_id: shiprocketResult.shipment_id,
      awb_number: awbNumber || 'Pending AWB Assignment',
      courier_name: courierName || 'Assigned Courier',
      tracking_url: trackingUrl,
    })
  } catch (err: unknown) {
    console.error('Shiprocket Shipment Error:', err)
    const errorMsg = err instanceof Error ? err.message : 'Failed to create shipment'
    return NextResponse.json({ error: errorMsg }, { status: 500 })
  }
}
