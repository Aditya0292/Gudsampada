'use client'

import React, { useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { useCartStore } from '@/store/cartStore'
import { FREE_DELIVERY_THRESHOLD } from '@/lib/whatsapp/buildOrderMessage'

export default function CartDrawer(): React.JSX.Element {
  const { items, isOpen, closeCart, updateQuantity, subtotal } = useCartStore()
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
            className="fixed inset-0 bg-black/30 backdrop-blur-[1px] z-[60]"
          />

          {/* Drawer Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed top-0 right-0 h-full w-full max-w-[100vw] sm:max-w-[400px] bg-[#fdf8f7] z-[70] shadow-xl flex flex-col"
            style={{ fontFamily: 'Outfit, sans-serif' }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-6 border-b border-[rgba(200,193,182,0.45)]">
              <span className="w-6">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#010100" strokeWidth="1.5">
                  <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <path d="M16 10a4 4 0 0 1-8 0" />
                </svg>
              </span>
              <h2 className="text-xl font-medium text-[#010100] text-center flex-1" style={{ fontFamily: 'Playfair Display, serif' }}>
                Your Cart
              </h2>
              <button
                onClick={closeCart}
                className="w-6 h-6 flex items-center justify-center text-[#8a8880] hover:text-[#010100] transition-colors cursor-pointer border-none bg-transparent"
                aria-label="Close cart"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            {/* Scrollable Items Container */}
            <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
              {/* Delivery threshold reminder */}
              <div style={{ border: '1px solid rgba(200,193,182,0.6)', padding: '12px 16px', background: '#fff' }}>
                <p style={{ fontSize: '11px', color: '#8a8880', margin: 0, textAlign: 'center', lineHeight: 1.5 }}>
                  Complimentary delivery on orders over ₹{FREE_DELIVERY_THRESHOLD}.{' '}
                  {remainingForFree > 0
                    ? `Just ₹${remainingForFree} to go.`
                    : "You've unlocked complimentary delivery!"}
                </p>
              </div>

              {/* Cart List */}
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#8a8880" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" className="mb-4 text-molasses-light/40">
                    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                    <line x1="3" y1="6" x2="21" y2="6" />
                    <path d="M16 10a4 4 0 0 1-8 0" />
                  </svg>
                  <p className="text-lg font-medium text-[#010100] mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>
                    Your cart is empty
                  </p>
                  <p className="text-xs text-[#8a8880] mb-6 max-w-xs leading-relaxed">
                    Explore our unrefined organic jaggery collection and add some sweetness.
                  </p>
                  <Link
                    href="/shop"
                    onClick={closeCart}
                    style={{
                      display: 'inline-block',
                      background: '#1c1b1a',
                      color: '#fff',
                      fontSize: '11px',
                      fontWeight: 700,
                      letterSpacing: '0.12em',
                      textTransform: 'uppercase',
                      padding: '12px 28px',
                      textDecoration: 'none',
                      borderRadius: 0,
                    }}
                  >
                    Start Shopping
                  </Link>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  {items.map((item) => (
                    <div
                      key={`${item.id}-${item.variantId}`}
                      style={{
                        display: 'flex',
                        alignItems: 'start',
                        gap: '16px',
                        paddingBottom: '20px',
                        borderBottom: '1px solid rgba(200,193,182,0.3)',
                      }}
                    >
                      {/* Thumbnail */}
                      <div style={{ position: 'relative', width: '64px', height: '80px', background: '#f5f0ef', border: '1px solid rgba(200,193,182,0.4)', flexShrink: 0 }}>
                        <Image src={item.image} alt={item.name} fill className="object-contain p-1" sizes="64px" />
                      </div>

                      {/* Info Panel */}
                      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: '80px' }}>
                        <div>
                          <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: '16px', fontWeight: 500, color: '#010100', margin: '0 0 2px', lineHeight: 1.3 }}>
                            {item.name}
                          </h3>
                          <span style={{ fontSize: '11px', color: '#8a8880', textTransform: 'uppercase', fontWeight: 600 }}>
                            {item.variant}
                          </span>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '12px' }}>
                          {/* Quantity Selector - sharp bordered rectangle */}
                          <div style={{ display: 'flex', alignItems: 'center', border: '1px solid rgba(200,193,182,0.8)', background: '#fff' }}>
                            <button
                              onClick={() => updateQuantity(item.id, item.variantId, item.quantity - 1)}
                              style={{ width: '26px', height: '26px', border: 'none', background: 'transparent', cursor: 'pointer', fontSize: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#8a8880' }}
                            >
                              —
                            </button>
                            <span style={{ fontSize: '12px', fontWeight: 600, width: '22px', textAlign: 'center', color: '#010100', fontFamily: 'Outfit, sans-serif' }}>
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.id, item.variantId, item.quantity + 1)}
                              style={{ width: '26px', height: '26px', border: 'none', background: 'transparent', cursor: 'pointer', fontSize: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#8a8880' }}
                            >
                              +
                            </button>
                          </div>

                          <p style={{ fontFamily: 'Playfair Display, serif', fontSize: '16px', fontWeight: 500, color: '#010100', margin: 0 }}>
                            ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer Panel */}
            {items.length > 0 && (
              <div className="px-6 py-6 border-t border-[rgba(200,193,182,0.45)] bg-white space-y-4">
                <div className="flex justify-between items-baseline">
                  <span style={{ fontSize: '13px', color: '#8a8880', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.04em' }}>Subtotal</span>
                  <span style={{ fontFamily: 'Playfair Display, serif', fontSize: '20px', fontWeight: 500, color: '#010100' }}>
                    ₹{sub.toLocaleString('en-IN')}
                  </span>
                </div>

                <Link
                  href="/checkout"
                  onClick={closeCart}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    width: '100%',
                    background: '#1c1b1a',
                    color: '#fff',
                    padding: '16px',
                    fontSize: '11px',
                    fontWeight: 700,
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    textDecoration: 'none',
                    borderRadius: 0,
                    boxSizing: 'border-box',
                  }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="2" y="5" width="20" height="14" rx="0" />
                    <line x1="2" y1="10" x2="22" y2="10" />
                  </svg>
                  <span>Proceed to Checkout : ₹{sub.toLocaleString('en-IN')}</span>
                </Link>

                <div className="text-center">
                  <Link
                    href="/checkout"
                    onClick={closeCart}
                    style={{ fontSize: '11px', color: '#8a8880', textDecoration: 'underline', textUnderlineOffset: '3px' }}
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
