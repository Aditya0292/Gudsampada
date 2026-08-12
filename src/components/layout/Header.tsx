'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useCartStore } from '@/store/cartStore'
import { motion, AnimatePresence } from 'framer-motion'

export default function Header(): React.JSX.Element {
  const pathname = usePathname()
  const isHomepage = pathname === '/'
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const totalItems = useCartStore((s) => s.totalItems)
  const openCart = useCartStore((s) => s.openCart)

  useEffect(() => {
    setMounted(true)
    const handleScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close mobile menu on route changes
  useEffect(() => {
    setMobileMenuOpen(false)
  }, [pathname])

  const itemCount = mounted ? totalItems() : 0
  const isHeaderActive = scrolled || !isHomepage

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/shop', label: 'Shop' },
    { href: '/our-story', label: 'Our Story' },
    { href: '/recipes', label: 'Recipes' },
    { href: '/business', label: 'B2B & Bulk' },
    { href: '/track-order', label: 'Track Order' },
  ]

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isHeaderActive
          ? 'bg-cream/95 backdrop-blur-md border-b border-border py-4'
          : 'bg-transparent py-6'
      }`}
    >
      <div className="container-main flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <span
            className={`font-heading text-2xl font-bold tracking-tight transition-colors duration-300 ${
              isHeaderActive ? 'text-molasses' : 'text-white'
            }`}
          >
            gud<span className="font-normal italic">sampada.</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-12">
          {navLinks.map((link) => {
            const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href))
            return (
              <Link
                key={link.label}
                href={link.href}
                className={`relative group text-[10px] font-semibold uppercase tracking-[0.22em] transition-colors duration-300 py-1 ${
                  isHeaderActive
                    ? isActive ? 'text-molasses' : 'text-molasses-light hover:text-molasses'
                    : isActive ? 'text-white' : 'text-white/80 hover:text-white'
                }`}
              >
                {link.label}
                <span
                  className={`absolute -bottom-1 left-0 w-full h-[1.5px] transition-transform duration-300 origin-left ${
                    isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                  } ${isHeaderActive ? 'bg-gold' : 'bg-gold'}`}
                />
              </Link>
            )
          })}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          {/* Cart Trigger */}
          <button
            onClick={openCart}
            className={`relative min-w-[44px] min-h-[44px] flex items-center justify-center rounded-none transition-all duration-300 ${
              isHeaderActive ? 'text-molasses' : 'text-white'
            }`}
            aria-label="Open cart"
            id="cart-button"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 0 1-8 0" />
            </svg>
            <AnimatePresence>
              {itemCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="absolute -top-0.5 -right-0.5 w-[18px] h-[18px] bg-gold text-white text-[10px] font-bold rounded-none flex items-center justify-center leading-none"
                >
                  {itemCount}
                </motion.span>
              )}
            </AnimatePresence>
          </button>

          {/* Hamburger Menu Toggle (Zero Curve, 44px tap target) */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`md:hidden min-w-[44px] min-h-[44px] flex items-center justify-center rounded-none transition-colors ${
              isHeaderActive ? 'text-molasses' : 'text-white'
            }`}
            aria-label="Toggle menu"
            id="mobile-menu-toggle"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              {mobileMenuOpen ? (
                <>
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </>
              ) : (
                <>
                  <line x1="4" y1="7" x2="20" y2="7" />
                  <line x1="4" y1="12" x2="20" y2="12" />
                  <line x1="4" y1="17" x2="20" y2="17" />
                </>
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Drawer (Strict Zero-Curve, slide-in overlay menu) */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.35, ease: 'easeInOut' }}
            className="md:hidden bg-cream border-t border-[#2D241E]/10 overflow-hidden"
          >
            <nav className="container-main py-6 flex flex-col gap-1">
              {navLinks.map((link) => {
                const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href))
                return (
                  <Link
                    key={link.label}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`font-sans font-bold text-xs uppercase tracking-[0.2em] py-4.5 px-3 rounded-none transition-colors ${
                      isActive ? 'bg-[#2D241E] text-cream' : 'text-molasses hover:bg-[#2D241E]/5'
                    }`}
                  >
                    {link.label}
                  </Link>
                )
              })}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
