import { Resend } from 'resend'
import { getSupabaseServerClient } from '@/lib/supabase/server'
import { generateOrderConfirmationHtml } from './templates/OrderConfirmationEmail'

export async function sendOrderConfirmation(order: {
  id: string
  order_number: string
  customer_name: string
  customer_phone: string
  customer_email?: string | null
  shipping_address: any
  items: any[]
  subtotal: number
  shipping_fee: number
  total: number
  email_sent?: boolean
}): Promise<{ success: boolean; message: string }> {
  // 1. Skip gracefully if customer email is missing/empty
  if (!order.customer_email || !order.customer_email.trim()) {
    console.log(`[OrderConfirmationEmail] Skipping email for Order #${order.order_number}: No customer email provided.`)
    return { success: false, message: 'No customer email provided' }
  }

  const recipientEmail = order.customer_email.trim()

  try {
    const resendApiKey = process.env.RESEND_API_KEY
    if (!resendApiKey) {
      console.warn('[OrderConfirmationEmail] Warning: RESEND_API_KEY is not configured in environment variables.')
      return { success: false, message: 'RESEND_API_KEY not configured' }
    }

    const resend = new Resend(resendApiKey)
    const fromAddress = process.env.RESEND_FROM_EMAIL || 'GudSampada Orders <onboarding@resend.dev>'

    const htmlContent = generateOrderConfirmationHtml({
      orderNumber: order.order_number,
      customerName: order.customer_name,
      shippingAddress: order.shipping_address,
      items: order.items || [],
      subtotal: Number(order.subtotal || 0),
      shippingFee: Number(order.shipping_fee || 0),
      total: Number(order.total || 0),
    })

    const { data, error } = await resend.emails.send({
      from: fromAddress,
      to: [recipientEmail],
      subject: `Order Confirmation #${order.order_number} — GudSampada`,
      html: htmlContent,
    })

    if (error) {
      console.error(`[OrderConfirmationEmail] Resend API Error for Order #${order.order_number}:`, error)
      return { success: false, message: error.message }
    }

    console.log(`[OrderConfirmationEmail] Email sent successfully for Order #${order.order_number} (Message ID: ${data?.id})`)

    // Update order record in database with email sent status
    const supabase = getSupabaseServerClient()
    await (supabase.from('orders') as any)
      .update({
        email_sent: true,
        email_sent_at: new Date().toISOString(),
      })
      .eq('id', order.id)

    return { success: true, message: 'Email sent successfully' }
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Unknown email error'
    console.error(`[OrderConfirmationEmail] Exception while sending email for Order #${order.order_number}:`, errorMsg)
    // IMPORTANT: Failures are caught and logged so order processing is NEVER blocked
    return { success: false, message: errorMsg }
  }
}
