'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useCartStore } from '@/store/cartStore'
import {
  buildWhatsAppMessage,
  buildWhatsAppURL,
  generateOrderId,
  DELIVERY_CHARGE,
  FREE_DELIVERY_THRESHOLD,
  BUSINESS_WHATSAPP,
  type CustomerDetails,
} from '@/lib/whatsapp/buildOrderMessage'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import CartDrawer from '@/components/shop/CartDrawer'
import AnimatedSection from '@/components/ui/AnimatedSection'
import SectionHeading from '@/components/ui/SectionHeading'
import CheckoutForm from '@/components/shop/CheckoutForm'
import CheckoutSummary from '@/components/shop/CheckoutSummary'

interface RazorpayResponse {
  razorpay_payment_id?: string
  razorpay_order_id?: string
  razorpay_signature?: string
}

interface WindowWithRazorpay extends Window {
  Razorpay?: new (options: Record<string, unknown>) => {
    open: () => void
    on: (event: string, handler: (response: any) => void) => void
  }
}

const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Delhi', 'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand',
  'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
  'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab', 'Rajasthan',
  'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh',
  'Uttarakhand', 'West Bengal', 'Jammu & Kashmir', 'Ladakh', 'Puducherry',
]

export default function CheckoutPage(): React.JSX.Element {
  const router = useRouter()
  const { items, subtotal, clearCart } = useCartStore()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [customer, setCustomer] = useState<CustomerDetails>({
    name: '',
    phone: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: 'Maharashtra',
    pincode: '',
    paymentPreference: 'cod',
    notes: '',
  })

  const [errorMessage, setErrorMessage] = useState('')

  const sub = subtotal()
  const delivery = sub >= FREE_DELIVERY_THRESHOLD ? 0 : DELIVERY_CHARGE
  // Calculate taxes (e.g. 5% GST included)
  const estimatedTax = Math.round(sub * 0.05)
  const total = sub + delivery

  const loadRazorpayScript = (): Promise<boolean> => {
    return new Promise((resolve) => {
      const win = window as WindowWithRazorpay
      if (typeof window !== 'undefined' && win.Razorpay) {
        resolve(true)
        return
      }
      const script = document.createElement('script')
      script.src = 'https://checkout.razorpay.com/v1/checkout.js'
      script.onload = () => resolve(true)
      script.onerror = () => resolve(false)
      document.body.appendChild(script)
    })
  }

  const handlePlaceOrder = async () => {
    if (
      !customer.name ||
      !customer.phone ||
      !customer.addressLine1 ||
      !customer.pincode
    ) {
      alert('Please fill in all required fields')
      return
    }
    if (customer.phone.length !== 10) {
      alert('Please enter a valid 10-digit mobile number')
      return
    }
    if (customer.pincode.length !== 6) {
      alert('Please enter a valid 6-digit pincode')
      return
    }

    setIsSubmitting(true)
    setErrorMessage('')

    if (customer.paymentPreference === 'online') {
      try {
        const scriptLoaded = await loadRazorpayScript()
        if (!scriptLoaded && !process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID?.startsWith('rzp_test_')) {
          setErrorMessage('Failed to load Razorpay SDK. Please check your connection.')
          setIsSubmitting(false)
          return
        }

        // Step A: Create order server-side
        const res = await fetch('/api/create-order', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            customer_name: customer.name,
            customer_phone: customer.phone,
            customer_email: customer.email || undefined,
            shipping_address: {
              line1: customer.addressLine1 + (customer.addressLine2 ? `, ${customer.addressLine2}` : ''),
              city: customer.city,
              state: customer.state,
              pincode: customer.pincode,
            },
            items: items.map((i) => ({
              product_id: i.id,
              name: i.name,
              size: i.variant,
              qty: i.quantity,
              price: i.price,
            })),
          }),
        })

        const data = await res.json()
        if (!res.ok || !data.success) {
          throw new Error(data.error || 'Could not initialize order')
        }

        const razorpayKey = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_placeholder'
        const options = {
          key: razorpayKey,
          amount: data.amount,
          currency: data.currency,
          name: 'GudSampada',
          description: `Order ${data.order_number}`,
          image: '/images/ginger-jaggery-powder.png',
          order_id: data.razorpay_order_id.startsWith('rzp_dummy_') ? undefined : data.razorpay_order_id,
          handler: async function (response: RazorpayResponse) {
            try {
              const verifyRes = await fetch('/api/verify-payment', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  razorpay_payment_id: response.razorpay_payment_id || `pay_dummy_${Date.now()}`,
                  razorpay_order_id: data.razorpay_order_id,
                  razorpay_signature: response.razorpay_signature || 'test_sig',
                }),
              })

              const verifyData = await verifyRes.json()
              if (verifyRes.ok && verifyData.success) {
                clearCart()
                router.push(`/order-confirmed/${data.order_number}`)
              } else {
                setErrorMessage(verifyData.error || 'Payment verification failed.')
              }
            } catch (err: unknown) {
              const errMsg = err instanceof Error ? err.message : 'Payment verification request failed.'
              setErrorMessage(errMsg)
            }
          },
          prefill: {
            name: customer.name,
            contact: customer.phone,
            email: customer.email,
          },
          theme: {
            color: '#1C1C1A',
          },
          modal: {
            ondismiss: function () {
              setErrorMessage('Payment modal was closed or cancelled. Your details are saved — click "Pay Online" to retry.')
              setIsSubmitting(false)
            },
          },
        }

        const win = window as WindowWithRazorpay
        if (win.Razorpay && !data.razorpay_order_id.startsWith('rzp_dummy_')) {
          const paymentObject = new win.Razorpay(options)
          
          paymentObject.on('payment.failed', function (resp: any) {
            const reason = resp.error?.description || resp.error?.reason || 'Payment could not be completed'
            setErrorMessage(`Payment Failed: ${reason}. Please try again or select WhatsApp COD.`)
            setIsSubmitting(false)
          })

          paymentObject.open()
        } else {
          // Fallback flow if no Razorpay script or in dummy test mode
          console.warn('Dummy payment mode or Razorpay script unavailable. Simulating success.')
          setTimeout(() => {
            clearCart()
            router.push(`/order-confirmed/${data.order_number}`)
          }, 1500)
        }
      } catch (err: unknown) {
        const errMsg = err instanceof Error ? err.message : 'Checkout failed.'
        setErrorMessage(errMsg)
        setIsSubmitting(false)
      }
    } else {
      // WhatsApp Cash on Delivery flow
      try {
        const localOrderId = generateOrderId()
        const payload: Parameters<typeof buildWhatsAppMessage>[0] = {
          orderId: localOrderId,
          customer,
          items: items,
          subtotal: sub,
          deliveryCharge: delivery,
          total,
        }

        const messageText = buildWhatsAppMessage(payload)
        const whatsappURL = buildWhatsAppURL(messageText, BUSINESS_WHATSAPP)

        // Insert WhatsApp order row to DB
        await fetch('/api/create-order', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            checkout_method: 'whatsapp',
            customer_name: customer.name,
            customer_phone: customer.phone,
            customer_email: customer.email || undefined,
            shipping_address: {
              line1: customer.addressLine1 + (customer.addressLine2 ? `, ${customer.addressLine2}` : ''),
              city: customer.city,
              state: customer.state,
              pincode: customer.pincode,
            },
            items: items.map((i) => ({
              product_id: i.id,
              name: i.name,
              size: i.variant,
              qty: i.quantity,
              price: i.price,
            })),
          }),
        })

        // Open WhatsApp in a new tab
        window.open(whatsappURL, '_blank')
        clearCart()
        router.push(`/order-confirmed/${localOrderId}`)
      } catch (err: unknown) {
        const errMsg = err instanceof Error ? err.message : 'Failed to process WhatsApp order.'
        alert(errMsg)
      } finally {
        setIsSubmitting(false)
      }
    }
  }

  return (
    <>
      <Header />
      <CartDrawer />
      <main className="main-page-padding py-20 min-h-screen bg-cream">
        <div className="container-main max-w-6xl mx-auto">
          {/* Header */}
          <AnimatedSection className="w-full flex flex-col items-center justify-center">
            <SectionHeading
              label="Secure Checkout"
              heading={
                <>
                  Review & Finalize <span className="italic font-normal">Your Order.</span>
                </>
              }
              align="center"
              className="mb-14"
            />
          </AnimatedSection>

          {/* Cart Empty State */}
          {items.length === 0 ? (
            <AnimatedSection delay={0.1}>
              <div className="bg-[#F7F4EE] border border-[#2D241E]/20 rounded-none p-12 text-center max-w-md mx-auto">
                <span className="text-4xl mb-4 block">🛒</span>
                <h2 className="font-heading text-xl text-molasses lowercase tracking-tight mb-2">
                  your cart is empty
                </h2>
                <p className="text-sm font-serif font-light text-molasses/60 mb-6">
                  Please add some unrefined Kolhapuri sweetness to your cart before checking out.
                </p>
                <Link
                  href="/shop"
                  className="inline-block bg-[#2C221E] hover:bg-gold text-cream font-sans font-bold text-xs uppercase tracking-[0.2em] py-4 px-10 rounded-none transition-colors duration-300 shadow-sm"
                >
                  Continue Shopping
                </Link>
              </div>
            </AnimatedSection>
          ) : (
            /* Spacious Layout Grid */
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
              {/* Form Column - Left (7 cols) */}
              <div className="lg:col-span-7 space-y-8">
                {errorMessage && (
                  <div className="p-4 bg-terracotta/10 border border-terracotta/20 text-terracotta text-sm font-serif">
                    {errorMessage}
                  </div>
                )}
                <CheckoutForm
                  customer={customer}
                  setCustomer={setCustomer}
                  indianStates={INDIAN_STATES}
                />
              </div>

              {/* Sidebar Order Summary Column - Right (5 cols) */}
              <div className="lg:col-span-5 sticky top-28">
                <CheckoutSummary
                  items={items}
                  subtotal={sub}
                  delivery={delivery}
                  estimatedTax={estimatedTax}
                  total={total}
                  paymentPreference={customer.paymentPreference}
                  isSubmitting={isSubmitting}
                  onPlaceOrder={handlePlaceOrder}
                />
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}
