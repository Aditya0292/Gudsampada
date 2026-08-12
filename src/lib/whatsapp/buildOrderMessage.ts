import { CartItem } from '@/store/cartStore'

export interface CustomerDetails {
 name: string
 phone: string
 email?: string
 addressLine1: string
 addressLine2?: string
 city: string
 state: string
 pincode: string
 paymentPreference: 'cod' | 'online'
 notes?: string
}

export interface OrderPayload {
 orderId: string
 items: CartItem[]
 customer: CustomerDetails
 subtotal: number
 deliveryCharge: number
 total: number
}

export function buildWhatsAppMessage(order: OrderPayload): string {
 const itemLines = order.items
 .map(
 (item) =>
 `• ${item.name} ${item.variant} × ${item.quantity} — ₹${(
 item.price * item.quantity
 ).toLocaleString('en-IN')}`
 )
 .join('\n')

 const paymentLabel =
 order.customer.paymentPreference === 'cod'
 ? 'Cash on Delivery'
 : 'Online Payment (UPI / Bank Transfer)'

 const addressBlock = [
 order.customer.addressLine1,
 order.customer.addressLine2,
 order.customer.city,
 order.customer.pincode,
 order.customer.state,
 ]
 .filter(Boolean)
 .join(', ')

 const message = `🛒 *New Order — GudSampada*
Order ID: ${order.orderId}

━━━━━━━━━━━━━━━━━━━━━━━━
🛍️ *ORDER ITEMS*
━━━━━━━━━━━━━━━━━━━━━━━━
${itemLines}

━━━━━━━━━━━━━━━━━━━━━━━━
💰 *PAYMENT*
━━━━━━━━━━━━━━━━━━━━━━━━
Subtotal: ₹${order.subtotal.toLocaleString('en-IN')}
Delivery: ₹${order.deliveryCharge}
*Total: ₹${order.total.toLocaleString('en-IN')}*

Payment preference: ${paymentLabel}

━━━━━━━━━━━━━━━━━━━━━━━━
📦 *DELIVERY ADDRESS*
━━━━━━━━━━━━━━━━━━━━━━━━
Name: ${order.customer.name}
Phone: ${order.customer.phone}
Address: ${addressBlock}
${order.customer.notes ? `\nNote: ${order.customer.notes}` : ''}
━━━━━━━━━━━━━━━━━━━━━━━━
Please confirm my order. Thank you! 🙏`

 return message
}

export function buildWhatsAppURL(
 message: string,
 businessPhone: string
): string {
 const encodedMessage = encodeURIComponent(message)
 return `https://wa.me/${businessPhone}?text=${encodedMessage}`
}

export function generateOrderId(): string {
 const date = new Date()
 const year = date.getFullYear()
 const random = Math.floor(1000 + Math.random() * 9000)
 return `GS-${year}-${random}`
}

export const DELIVERY_CHARGE = 60
export const FREE_DELIVERY_THRESHOLD = 999
export const BUSINESS_WHATSAPP = '919876543210'
