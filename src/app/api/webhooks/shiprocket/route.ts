import { NextResponse } from 'next/server'
import { getSupabaseServerClient } from '@/lib/supabase/server'

interface ShiprocketWebhookPayload {
  order_id: string
  shipment_id?: string
  awb?: string
  current_status?: string
  courier_name?: string
  tracking_url?: string
  etd?: string
}

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const rawBody = await request.text()
    const signature = request.headers.get('x-shiprocket-one-click-signature')
    const secret = process.env.SHIPROCKET_WEBHOOK_SECRET

    // Optional verification if secret is configured
    if (secret && signature && signature !== secret) {
      return NextResponse.json({ error: 'Invalid Shiprocket webhook signature' }, { status: 401 })
    }

    const payload: ShiprocketWebhookPayload = JSON.parse(rawBody)
    const { order_id, current_status, awb, courier_name, tracking_url } = payload

    if (!order_id) {
      return NextResponse.json({ error: 'Missing order_id in webhook payload' }, { status: 400 })
    }

    console.log(`[ShiprocketWebhook] Received status update for Order #${order_id}: ${current_status}`)

    const supabase = getSupabaseServerClient()

    // Map Shiprocket status to GudSampada Order & Shipment Status
    let mappedOrderStatus: 'placed' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled' = 'shipped'
    const statusUpper = (current_status || '').toUpperCase()

    if (statusUpper.includes('DELIVERED')) {
      mappedOrderStatus = 'delivered'
    } else if (statusUpper.includes('CANCEL') || statusUpper.includes('RTO')) {
      mappedOrderStatus = 'cancelled'
    } else if (statusUpper.includes('SHIPPED') || statusUpper.includes('IN TRANSIT') || statusUpper.includes('OUT FOR DELIVERY')) {
      mappedOrderStatus = 'shipped'
    }

    const updateFields: any = {
      shipment_status: current_status?.toLowerCase() || 'in_transit',
      order_status: mappedOrderStatus,
    }

    if (awb) updateFields.awb_number = awb
    if (courier_name) updateFields.courier_name = courier_name
    if (tracking_url) updateFields.tracking_url = tracking_url

    const { data: updatedOrder } = await (supabase.from('orders') as any)
      .update(updateFields)
      .eq('order_number', order_id)
      .select('*')
      .single()

    if (updatedOrder) {
      console.log(`[ShiprocketWebhook] Order #${order_id} updated successfully. Status: ${mappedOrderStatus}`)
    }

    return NextResponse.json({ status: 'ok', received: true })
  } catch (error: unknown) {
    console.error('Shiprocket Webhook Exception:', error)
    const msg = error instanceof Error ? error.message : 'Webhook error'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
