'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navItems = [
  {
    href: '/admin',
    label: 'Overview',
    exact: true,
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
      </svg>
    ),
  },
  {
    href: '/admin/orders',
    label: 'Orders',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 10V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l2-1.14"/>
        <path d="m7.5 4.27 9 5.15"/><polyline points="3.29 7 12 12 20.71 7"/><line x1="12" y1="22" x2="12" y2="12"/>
        <circle cx="18.5" cy="15.5" r="2.5"/><path d="M20.27 17.27 22 19"/>
      </svg>
    ),
  },
  {
    href: '/admin/products',
    label: 'Inventory',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 8h14M5 8a2 2 0 1 0-4 0 2 2 0 0 0 4 0zm14 0a2 2 0 1 0 4 0 2 2 0 0 0-4 0zM3 8v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V8"/>
        <path d="M10 12h4"/>
      </svg>
    ),
  },
  {
    href: '/admin/enquiries',
    label: 'Partnerships',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
        <circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
        <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
    ),
  },
]

interface SideNavProps {
  userEmail?: string
  isMobileOpen?: boolean
  onMobileClose?: () => void
  isCollapsed?: boolean
  onToggleCollapse?: () => void
}

export default function SideNav({
  userEmail,
  isMobileOpen = false,
  onMobileClose,
  isCollapsed = false,
  onToggleCollapse,
}: SideNavProps): React.JSX.Element {
  const pathname = usePathname()

  const isActive = (item: typeof navItems[0]) => {
    if (item.exact) return pathname === item.href
    return pathname.startsWith(item.href)
  }

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={onMobileClose}
        />
      )}

      <nav
        className={`
          fixed inset-y-0 left-0 z-50 flex flex-col h-screen shrink-0 overflow-hidden bg-[#f5f0ef]
          transition-all duration-300 ease-out md:translate-x-0 md:sticky md:top-0
          ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}
          ${isCollapsed ? 'md:w-20' : 'md:w-60 w-60'}
        `}
        style={{ borderRight: '1px solid rgba(200,199,191,0.35)', fontFamily: 'Outfit, sans-serif' }}
      >
        {/* Brand */}
        <div className={`pt-9 pb-8 flex flex-col items-center gap-4 transition-all duration-300 ${isCollapsed ? 'px-2' : 'px-6'}`}>
          <div className="flex items-center justify-between w-full">
            {!isCollapsed ? (
              <div>
                <div style={{ fontFamily: 'Playfair Display, serif', fontSize: '22px', fontWeight: 600, color: '#010100', letterSpacing: '-0.01em', lineHeight: 1.2 }}>
                  GudSampada
                </div>
                <div style={{ fontSize: '11px', fontWeight: 500, color: '#8a8880', letterSpacing: '0.01em', marginTop: '4px' }}>
                  Admin Console
                </div>
              </div>
            ) : (
              <div className="font-heading text-2xl font-bold text-[#010100] text-center w-full select-none" style={{ fontFamily: 'Playfair Display, serif' }}>
                G.
              </div>
            )}
            
            {/* Desktop Collapse Button - when expanded */}
            {!isCollapsed && onToggleCollapse && (
              <button
                onClick={onToggleCollapse}
                className="hidden md:flex items-center justify-center w-6 h-6 text-[#8a8880] hover:text-[#010100] cursor-pointer bg-transparent border-none outline-none"
                title="Collapse Sidebar"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="11 17 6 12 11 7" />
                  <polyline points="17 17 12 12 17 7" />
                </svg>
              </button>
            )}

            {/* Close button on mobile sidebar top */}
            {isMobileOpen && (
              <button
                onClick={onMobileClose}
                className="md:hidden w-8 h-8 flex items-center justify-center border-none bg-transparent text-[#8a8880] hover:text-[#010100] cursor-pointer"
                aria-label="Close sidebar"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            )}
          </div>

          {/* Desktop Expand Button - when collapsed */}
          {isCollapsed && onToggleCollapse && (
            <button
              onClick={onToggleCollapse}
              className="hidden md:flex items-center justify-center w-8 h-8 text-[#8a8880] hover:text-[#010100] cursor-pointer bg-transparent border-none outline-none"
              title="Expand Sidebar"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="rotate-180">
                <polyline points="11 17 6 12 11 7" />
                <polyline points="17 17 12 12 17 7" />
              </svg>
            </button>
          )}
        </div>

        {/* Nav Links */}
        <div className="flex flex-col px-3 gap-1 flex-1">
          {navItems.map((item) => {
            const active = isActive(item)
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => onMobileClose?.()}
                title={isCollapsed ? item.label : undefined}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: isCollapsed ? 'center' : 'start',
                  gap: isCollapsed ? '0' : '12px',
                  padding: isCollapsed ? '12px' : '11px 16px',
                  transition: 'all 0.15s ease',
                  background: active ? '#1c1b1a' : 'transparent',
                  color: active ? '#e8e5e3' : '#474741',
                  fontWeight: active ? 600 : 500,
                  fontSize: '14px',
                  textDecoration: 'none',
                  borderRadius: 0,
                }}
                onMouseEnter={(e) => {
                  if (!active) (e.currentTarget as HTMLElement).style.background = 'rgba(0,0,0,0.05)'
                }}
                onMouseLeave={(e) => {
                  if (!active) (e.currentTarget as HTMLElement).style.background = 'transparent'
                }}
              >
                <span style={{ color: active ? '#c9a96e' : '#8a8880', display: 'flex', alignItems: 'center', flexShrink: 0 }}>
                  {item.icon}
                </span>
                {!isCollapsed && item.label}
              </Link>
            )
          })}

          {/* Analytics — disabled */}
          <div
            title={isCollapsed ? "Analytics" : undefined}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: isCollapsed ? 'center' : 'start',
              gap: isCollapsed ? '0' : '12px',
              padding: isCollapsed ? '12px' : '11px 16px',
              color: 'rgba(71,71,65,0.35)',
              fontSize: '14px',
              fontWeight: 500,
              cursor: 'default',
              userSelect: 'none',
              borderRadius: 0,
            }}
          >
            <span style={{ color: 'rgba(138,136,128,0.35)', display: 'flex', alignItems: 'center', flexShrink: 0 }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
              </svg>
            </span>
            {!isCollapsed && "Analytics"}
          </div>


        </div>

        {/* Bottom Section */}
        <div className={`pb-7 pt-4 border-t border-[rgba(200,199,191,0.35)] transition-all duration-300 ${isCollapsed ? 'px-2' : 'px-5'}`}>
          {/* View Store Button */}
          <Link
            href="/"
            target="_blank"
            onClick={() => onMobileClose?.()}
            title={isCollapsed ? "View Store" : undefined}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: isCollapsed ? '0' : '8px',
              width: '100%',
              height: isCollapsed ? '40px' : 'auto',
              padding: isCollapsed ? '0' : '10px',
              border: '1.5px solid #1c1b1a',
              background: 'transparent',
              color: '#1c1b1a',
              fontSize: '11px',
              fontWeight: 700,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              textDecoration: 'none',
              borderRadius: 0,
              transition: 'all 0.15s ease',
              marginBottom: '12px',
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLElement
              el.style.background = '#1c1b1a'
              el.style.color = '#f5f0ef'
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLElement
              el.style.background = 'transparent'
              el.style.color = '#1c1b1a'
            }}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="flex-shrink-0">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
              <polyline points="15 3 21 3 21 9"/>
              <line x1="10" y1="14" x2="21" y2="3"/>
            </svg>
            {!isCollapsed && "View Store"}
          </Link>

          {/* Settings */}
          <Link
            href="/admin/settings"
            onClick={() => onMobileClose?.()}
            title={isCollapsed ? "Settings" : undefined}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: isCollapsed ? 'center' : 'start',
              gap: isCollapsed ? '0' : '12px',
              padding: isCollapsed ? '10px 0' : '10px 8px',
              color: '#474741',
              fontSize: '14px',
              fontWeight: 500,
              textDecoration: 'none',
              borderRadius: 0,
              transition: 'all 0.15s ease',
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = 'rgba(0,0,0,0.05)' }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = 'transparent' }}
          >
            <span style={{ color: '#8a8880', display: 'flex', flexShrink: 0 }}>
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="3"/>
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
              </svg>
            </span>
            {!isCollapsed && "Settings"}
          </Link>

          {/* Logout */}
          <Link
            href="/admin/login"
            onClick={() => onMobileClose?.()}
            title={isCollapsed ? "Logout" : undefined}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: isCollapsed ? 'center' : 'start',
              gap: isCollapsed ? '0' : '12px',
              padding: isCollapsed ? '10px 0' : '10px 8px',
              color: '#474741',
              fontSize: '14px',
              fontWeight: 500,
              textDecoration: 'none',
              borderRadius: 0,
              transition: 'all 0.15s ease',
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = 'rgba(0,0,0,0.05)' }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = 'transparent' }}
          >
            <span style={{ color: '#8a8880', display: 'flex', flexShrink: 0 }}>
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                <polyline points="16 17 21 12 16 7"/>
                <line x1="21" y1="12" x2="9" y2="12"/>
              </svg>
            </span>
            {!isCollapsed && "Logout"}
          </Link>
        </div>
      </nav>
    </>
  )
}
