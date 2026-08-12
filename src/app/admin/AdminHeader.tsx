'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

interface AdminHeaderProps {
  userEmail?: string
}

export default function AdminHeader({ userEmail }: AdminHeaderProps): React.JSX.Element {
  const pathname = usePathname()
  const router = useRouter()
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false)

  // Close mobile menu on route change
  React.useEffect(() => {
    setMobileMenuOpen(false)
  }, [pathname])

  // Do not render admin header on login page
  if (pathname === '/admin/login') {
    return <></>
  }

  const handleLogout = async () => {
    // 1. Delete admin session cookie
    document.cookie = 'admin_session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax'
    // 2. Sign out from Supabase Auth
    const supabase = createClient()
    await supabase.auth.signOut()
    // 3. Redirect to Admin Login
    router.push('/admin/login')
    router.refresh()
  }

  const navItems = [
    { href: '/admin', label: 'Dashboard' },
    { href: '/admin/orders', label: 'Orders' },
    { href: '/admin/products', label: 'Products' },
    { href: '/admin/enquiries', label: 'B2B Enquiries' },
  ]

  return (
    <header className="bg-[#1C1C1A] text-[#F9F6F0] border-b border-white/10 sticky top-0 z-40 w-full shadow-md">
      <div className="w-full px-4 sm:px-6 md:px-10 h-16 md:h-20 flex items-center justify-between gap-4">
        {/* Brand & Admin Badge (Left) */}
        <div className="flex items-center gap-3 shrink-0">
          <Link href="/admin" className="flex items-center gap-2.5">
            <span className="font-heading text-xl md:text-2xl font-bold tracking-tight text-white">
              gud<span className="font-normal italic text-gold">sampada.</span>
            </span>
            <span className="bg-gold/20 text-gold border border-gold/40 text-[9px] md:text-[10px] font-sans font-bold uppercase tracking-[0.2em] px-2 py-0.5 md:px-2.5 md:py-1 rounded-none">
              Admin
            </span>
          </Link>
        </div>

        {/* Desktop Navigation Links (Center) */}
        <nav className="hidden md:flex items-center gap-6 lg:gap-8">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href))
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`text-xs font-sans font-bold uppercase tracking-[0.2em] transition-all rounded-none px-4 py-2 whitespace-nowrap inline-block ${
                  isActive
                    ? 'bg-gold text-[#1C1C1A] shadow-sm'
                    : 'text-[#F9F6F0]/70 hover:text-white hover:bg-white/10'
                }`}
              >
                {item.label}
              </Link>
            )
          })}
        </nav>

        {/* Desktop User Info & Actions (Right) */}
        <div className="hidden md:flex items-center gap-4 lg:gap-5 shrink-0">
          {userEmail && (
            <span className="hidden xl:inline text-xs font-mono text-white/50 border-r border-white/15 pr-4">
              {userEmail}
            </span>
          )}
          <Link
            href="/"
            target="_blank"
            className="inline-flex items-center justify-center border border-white/30 hover:border-gold hover:text-gold text-white text-xs font-sans font-bold uppercase tracking-[0.18em] px-4 py-2 rounded-none transition-all whitespace-nowrap"
          >
            Live Store ↗
          </Link>
          <button
            onClick={handleLogout}
            className="inline-flex items-center justify-center bg-terracotta/20 border border-terracotta/60 hover:bg-terracotta text-white text-xs font-sans font-bold uppercase tracking-[0.18em] px-4 py-2 rounded-none transition-all cursor-pointer whitespace-nowrap"
          >
            Sign Out
          </button>
        </div>

        {/* Mobile Hamburger Toggle Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 text-white hover:text-gold focus:outline-none cursor-pointer"
          aria-label="Toggle Navigation Menu"
        >
          {mobileMenuOpen ? (
            <span className="text-2xl font-mono leading-none">✕</span>
          ) : (
            <span className="text-2xl font-mono leading-none">☰</span>
          )}
        </button>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#1C1C1A] border-t border-white/10 px-4 py-6 space-y-4 animate-in slide-in-from-top duration-200">
          <nav className="flex flex-col space-y-2">
            {navItems.map((item) => {
              const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href))
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`text-xs font-sans font-bold uppercase tracking-[0.2em] px-4 py-3 rounded-none transition-all block ${
                    isActive
                      ? 'bg-gold text-[#1C1C1A]'
                      : 'text-[#F9F6F0]/80 hover:bg-white/10 text-white'
                  }`}
                >
                  {item.label}
                </Link>
              )
            })}
          </nav>

          <div className="pt-4 border-t border-white/15 space-y-3">
            {userEmail && (
              <p className="text-xs font-mono text-white/50 px-1">
                Signed in: {userEmail}
              </p>
            )}
            <div className="grid grid-cols-2 gap-3">
              <Link
                href="/"
                target="_blank"
                className="inline-flex items-center justify-center border border-white/30 text-white text-xs font-sans font-bold uppercase tracking-wider py-2.5 text-center"
              >
                Live Store ↗
              </Link>
              <button
                onClick={handleLogout}
                className="inline-flex items-center justify-center bg-terracotta/20 border border-terracotta/60 text-white text-xs font-sans font-bold uppercase tracking-wider py-2.5 text-center cursor-pointer"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
