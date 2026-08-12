'use client'

import React, { useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { useCartStore } from '@/store/cartStore'
import { FREE_DELIVERY_THRESHOLD } from '@/lib/whatsapp/buildOrderMessage'

export default function CartDrawer(): React.JSX.Element {
  const { items, isOpen, closeCart, removeItem, updateQuantity, subtotal } =
    useCartStore()
  const sub = subtotal()
  const remainingForFree = FREE_DELIVERY_THRESHOLD - sub

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 bg-black/40 backdrop-blur-[2px] z-[60]"
          />

          {/* Drawer Container */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 32, stiffness: 350 }}
            className="fixed top-0 right-0 h-full w-full max-w-[100vw] sm:max-w-[400px] bg-cream z-[70] shadow-2xl flex flex-col font-serif text-molasses"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 relative">
              <div className="w-8 flex items-center justify-start">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.2"
                  className="text-molasses"
                >
                  <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <path d="M16 10a4 4 0 0 1-8 0" />
                </svg>
              </div>

              <h2 className="font-heading text-2xl font-normal text-molasses text-center flex-1">
                Your Cart
              </h2>

              <div className="w-8 flex items-center justify-end">
                <button
                  onClick={closeCart}
                  className="w-8 h-8 flex items-center justify-center text-molasses/70 hover:text-molasses transition-colors cursor-pointer"
                  aria-label="Close cart"
                  id="close-cart"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Scrollable Content Container */}
            <div className="flex-1 overflow-y-auto px-6 py-2 space-y-4">
              {/* Delivery Message */}
              <div className="border border-molasses/15 rounded-none p-3.5 text-center bg-transparent">
                <p className="text-xs font-serif text-molasses/80 leading-relaxed">
                  Complimentary delivery on orders over ₹{FREE_DELIVERY_THRESHOLD}.{' '}
                  {remainingForFree > 0
                    ? `Just ₹${remainingForFree} to go.`
                    : "You've unlocked complimentary delivery!"}
                </p>
              </div>

              {/* Cart Items List */}
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <span className="text-4xl mb-3">🛍️</span>
                  <p className="font-heading text-xl font-normal text-molasses mb-1.5">
                    Your cart is empty
                  </p>
                  <p className="text-xs font-serif text-molasses/60 mb-5 max-w-xs">
                    Explore our unrefined organic jaggery collection and add some sweetness.
                  </p>
                  <Link
                    href="/shop"
                    onClick={closeCart}
                    className="inline-block rounded-none bg-molasses text-cream font-sans font-bold text-xs uppercase tracking-[0.2em] px-8 py-3 hover:bg-gold transition-colors"
                  >
                    Start Shopping
                  </Link>
                </div>
              ) : (
                <div className="space-y-4 pt-1">
                  {items.map((item) => (
                    <div
                      key={`${item.id}-${item.variantId}`}
                      className="flex items-start space-x-3.5 pb-4 border-b border-molasses/10 last:border-0"
                    >
                      {/* Square Product Thumbnail */}
                      <div className="relative w-16 h-20 bg-cream-dark border border-molasses/10 rounded-none overflow-hidden flex-shrink-0">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover"
                          sizes="64px"
                        />
                      </div>

                      {/* Tight & Vertically Integrated Details */}
                      <div className="flex-1 min-w-0 flex flex-col justify-between h-20 py-0.5">
                        {/* Title */}
                        <div className="flex justify-between items-baseline">
                          <h3 className="font-heading text-base font-normal text-molasses leading-tight truncate pr-2">
                            {item.name}
                          </h3>
                        </div>

                        {/* Inline Variant + Quantity Selector + Price */}
                        <div className="flex items-center justify-between mt-auto">
                          <div className="flex items-center space-x-6">
                            <span className="text-xs font-sans text-molasses/60">
                              {item.variant}
                            </span>

                            {/* Quantity Controls */}
                            <div className="flex items-center space-x-1">
                              <button
                                onClick={() => updateQuantity(item.id, item.variantId, item.quantity - 1)}
                                className="w-11 h-11 flex items-center justify-center text-molasses/70 hover:text-molasses transition-colors cursor-pointer"
                                aria-label="Decrease quantity"
                              >
                                —
                              </button>
                              <span className="font-sans text-xs font-normal text-molasses w-4 text-center">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => updateQuantity(item.id, item.variantId, item.quantity + 1)}
                                className="w-11 h-11 flex items-center justify-center text-molasses/70 hover:text-molasses transition-colors cursor-pointer"
                                aria-label="Increase quantity"
                              >
                                +
                              </button>
                            </div>
                          </div>

                          {/* Far-Right Price */}
                          <p className="font-heading text-lg sm:text-xl font-normal text-molasses">
                            ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer Block */}
            {items.length > 0 && (
              <div className="px-6 py-4 border-t border-molasses/10 bg-cream space-y-3">
                {/* Subtotal Row */}
                <div className="flex justify-between items-center">
                  <span className="font-serif text-sm text-molasses/80">Subtotal</span>
                  <span className="font-heading text-lg font-normal text-molasses">
                    ₹{sub.toLocaleString('en-IN')}
                  </span>
                </div>

                {/* Proceed to Checkout — navigates to /checkout page */}
                <Link
                  href="/checkout"
                  onClick={closeCart}
                  className="w-full bg-[#2C221E] hover:bg-gold text-cream font-heading text-base sm:text-lg font-medium py-4 rounded-none shadow-md transition-colors duration-300 cursor-pointer flex items-center justify-center space-x-3"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <rect x="2" y="5" width="20" height="14" rx="1" />
                    <line x1="2" y1="10" x2="22" y2="10" />
                  </svg>
                  <span>Proceed to Checkout: ₹{sub.toLocaleString('en-IN')}</span>
                </Link>

                {/* WhatsApp Sub-link */}
                <div className="text-center">
                  <Link
                    href="/checkout"
                    onClick={closeCart}
                    className="text-[11px] font-sans text-molasses/70 hover:text-gold underline underline-offset-4 transition-colors inline-block"
                  >
                    Need help? Order via WhatsApp
                  </Link>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
