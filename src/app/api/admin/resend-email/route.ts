import { NextResponse } from 'next/server'
import { getSupabaseServerClient } from '@/lib/supabase/server'
import { sendOrderConfirmation } from '@/lib/email/sendOrderConfirmation'

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const { order_id } = await request.json()

    if (!order_id) {
      return NextResponse.json({ error: 'Order ID is required' }, { status: 400 })
    }

    const supabase = getSupabaseServerClient()
    const { data: order, error } = await (supabase.from('orders') as any)
      .select('*')
      .eq('id', order_id)
      .single()

    if (error || !order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    if (!order.customer_email) {
      return NextResponse.json({ error: 'Cannot send email: Customer did not provide an email address for this order.' }, { status: 400 })
    }

    const result = await sendOrderConfirmation(order)

    if (!result.success) {
      return NextResponse.json({ error: result.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, message: `Order confirmation email resent to ${order.customer_email}!` })
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to resend email'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
