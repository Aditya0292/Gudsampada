import { PaymentStatus, OrderStatus, CheckoutMethod, B2BEnquiryType, B2BStatus } from './supabase'

export interface ShippingAddress {
  line1: string
  city: string
  state: string
  pincode: string
}

export interface OrderItemPayload {
  product_id: string
  name: string
  size: '250G' | '500G' | string
  qty: number
  price: number
}

export interface CreateOrderPayload {
  customer_name: string
  customer_phone: string
  customer_email?: string
  shipping_address: ShippingAddress
  items: OrderItemPayload[]
}

export interface VerifyPaymentPayload {
  razorpay_payment_id: string
  razorpay_order_id: string
  razorpay_signature: string
}

export interface B2BEnquiryPayload {
  enquiry_type: B2BEnquiryType
  company_name: string
  contact_name: string
  phone: string
  email?: string
  city: string
  estimated_quantity?: string
  message?: string
}
