import { NextResponse } from 'next/server'
import crypto from 'crypto'
import { getSupabaseServerClient } from '@/lib/supabase/server'

interface RazorpayWebhookPayload {
  event: string
  payload?: {
    payment?: {
      entity?: {
        id: string
        order_id: string
      }
    }
  }
}

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const rawBody = await request.text()
    const signature = request.headers.get('x-razorpay-signature')
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET || 'placeholder_secret'

    if (signature && webhookSecret !== 'placeholder_secret') {
      const expectedSignature = crypto
        .createHmac('sha256', webhookSecret)
        .update(rawBody)
        .digest('hex')

      if (expectedSignature !== signature) {
        return NextResponse.json({ error: 'Invalid webhook signature' }, { status: 400 })
      }
    }

    const event = JSON.parse(rawBody) as RazorpayWebhookPayload
    const payload = event.payload?.payment?.entity

    if (payload) {
      const rzpOrderId = payload.order_id
      const rzpPaymentId = payload.id
      const supabase = getSupabaseServerClient()

      if (event.event === 'payment.captured') {
        const { data: updatedOrder } = await (supabase.from('orders') as any)
          .update({
            payment_status: 'paid',
            order_status: 'confirmed',
            razorpay_payment_id: rzpPaymentId,
          })
          .eq('razorpay_order_id', rzpOrderId)
          .select('*')
          .single()

        if (updatedOrder && !updatedOrder.email_sent) {
          const { sendOrderConfirmation } = await import('@/lib/email/sendOrderConfirmation')
          sendOrderConfirmation(updatedOrder).catch((emailErr) => {
            console.error('Non-blocking webhook order email error:', emailErr)
          })
        }
      } else if (event.event === 'payment.failed') {
        await (supabase.from('orders') as any)
          .update({
            payment_status: 'failed',
          })
          .eq('razorpay_order_id', rzpOrderId)
      }
    }

    return NextResponse.json({ status: 'ok', received: true })
  } catch (error: unknown) {
    console.error('Razorpay Webhook Error:', error)
    const errMsg = error instanceof Error ? error.message : 'Webhook processing failed'
    return NextResponse.json({ error: errMsg }, { status: 500 })
  }
}
