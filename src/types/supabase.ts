export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded'
export type OrderStatus = 'placed' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled'
export type CheckoutMethod = 'online_payment' | 'whatsapp'
export type B2BEnquiryType = 'bulk_temple' | 'dealership' | 'export' | 'wholesale_discount'
export type B2BStatus = 'new' | 'contacted' | 'closed'

export interface Database {
  public: {
    Tables: {
      products: {
        Row: {
          id: string
          name: string
          slug: string
          description: string | null
          price_250g: number
          price_500g: number
          stock_250g: number
          stock_500g: number
          weight_grams: number
          image_url: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          description?: string | null
          price_250g: number
          price_500g: number
          stock_250g?: number
          stock_500g?: number
          weight_grams?: number
          image_url?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          description?: string | null
          price_250g?: number
          price_500g?: number
          stock_250g?: number
          stock_500g?: number
          weight_grams?: number
          image_url?: string | null
          created_at?: string
        }
      }
      orders: {
        Row: {
          id: string
          order_number: string
          customer_name: string
          customer_phone: string
          customer_email: string | null
          shipping_address: Json
          items: Json
          subtotal: number
          shipping_fee: number
          total: number
          payment_status: PaymentStatus
          order_status: OrderStatus
          razorpay_order_id: string | null
          razorpay_payment_id: string | null
          checkout_method: CheckoutMethod
          email_sent: boolean
          email_sent_at: string | null
          shiprocket_order_id: string | null
          shiprocket_shipment_id: string | null
          awb_number: string | null
          courier_name: string | null
          tracking_url: string | null
          shipment_status: string | null
          created_at: string
        }
        Insert: {
          id?: string
          order_number: string
          customer_name: string
          customer_phone: string
          customer_email?: string | null
          shipping_address: Json
          items: Json
          subtotal: number
          shipping_fee?: number
          total: number
          payment_status?: PaymentStatus
          order_status?: OrderStatus
          razorpay_order_id?: string | null
          razorpay_payment_id?: string | null
          checkout_method?: CheckoutMethod
          email_sent?: boolean
          email_sent_at?: string | null
          shiprocket_order_id?: string | null
          shiprocket_shipment_id?: string | null
          awb_number?: string | null
          courier_name?: string | null
          tracking_url?: string | null
          shipment_status?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          order_number?: string
          customer_name?: string
          customer_phone?: string
          customer_email?: string | null
          shipping_address?: Json
          items?: Json
          subtotal?: number
          shipping_fee?: number
          total?: number
          payment_status?: PaymentStatus
          order_status?: OrderStatus
          razorpay_order_id?: string | null
          razorpay_payment_id?: string | null
          checkout_method?: CheckoutMethod
          email_sent?: boolean
          email_sent_at?: string | null
          shiprocket_order_id?: string | null
          shiprocket_shipment_id?: string | null
          awb_number?: string | null
          courier_name?: string | null
          tracking_url?: string | null
          shipment_status?: string | null
          created_at?: string
        }
      }
      shiprocket_auth: {
        Row: {
          id: number
          token: string
          expires_at: string
        }
        Insert: {
          id?: number
          token: string
          expires_at: string
        }
        Update: {
          id?: number
          token?: string
          expires_at?: string
        }
      }
      b2b_enquiries: {
        Row: {
          id: string
          enquiry_type: B2BEnquiryType
          company_name: string
          contact_name: string
          phone: string
          email: string | null
          city: string
          estimated_quantity: string | null
          message: string | null
          status: B2BStatus
          created_at: string
        }
        Insert: {
          id?: string
          enquiry_type: B2BEnquiryType
          company_name: string
          contact_name: string
          phone: string
          email?: string | null
          city: string
          estimated_quantity?: string | null
          message?: string | null
          status?: B2BStatus
          created_at?: string
        }
        Update: {
          id?: string
          enquiry_type?: B2BEnquiryType
          company_name?: string
          contact_name?: string
          phone?: string
          email?: string | null
          city?: string
          estimated_quantity?: string | null
          message?: string | null
          status?: B2BStatus
          created_at?: string
        }
      }
    }
  }
}
