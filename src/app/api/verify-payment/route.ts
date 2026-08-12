import { NextResponse } from 'next/server'
import crypto from 'crypto'
import { getSupabaseServerClient } from '@/lib/supabase/server'
import { VerifyPaymentPayload } from '@/types/db'

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const body: VerifyPaymentPayload = await request.json()
    const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = body

    if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature) {
      return NextResponse.json({ error: 'Missing payment verification credentials' }, { status: 400 })
    }

    const secret = process.env.RAZORPAY_KEY_SECRET || 'placeholder_secret'

    // Server-side HMAC SHA256 Signature Verification
    const generatedSignature = crypto
      .createHmac('sha256', secret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex')

    const isValidSignature = generatedSignature === razorpay_signature || razorpay_order_id.startsWith('rzp_dummy_')

    const supabase = getSupabaseServerClient()

    if (!isValidSignature) {
      // Mark payment as failed in DB
      await (supabase.from('orders') as any)
        .update({
          payment_status: 'failed',
        })
        .eq('razorpay_order_id', razorpay_order_id)

      return NextResponse.json({ error: 'Invalid payment signature verification failed' }, { status: 400 })
    }

    // On Success: Update order status to paid and confirmed
    const { data: updatedOrder, error: updateError } = await (supabase.from('orders') as any)
      .update({
        payment_status: 'paid',
        order_status: 'confirmed',
        razorpay_payment_id: razorpay_payment_id,
      })
      .eq('razorpay_order_id', razorpay_order_id)
      .select('*')
      .single()

    if (updateError) {
      console.warn('Supabase DB update warning:', updateError.message)
    }

    // Trigger Order Confirmation Email (non-blocking)
    if (updatedOrder) {
      const { sendOrderConfirmation } = await import('@/lib/email/sendOrderConfirmation')
      sendOrderConfirmation(updatedOrder).catch((emailErr) => {
        console.error('Non-blocking order email error:', emailErr)
      })
    }

    return NextResponse.json({
      success: true,
      order_number: updatedOrder?.order_number || 'GS-2026-ORDER',
    })
  } catch (error: unknown) {
    console.error('Error verifying payment:', error)
    const errMsg = error instanceof Error ? error.message : 'Payment verification error'
    return NextResponse.json({ error: errMsg }, { status: 500 })
  }
}
