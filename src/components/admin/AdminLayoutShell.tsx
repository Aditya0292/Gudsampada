'use client'

import React, { useState } from 'react'
import SideNav from './SideNav'

interface AdminLayoutShellProps {
  userEmail?: string
  children: React.ReactNode
}

export default function AdminLayoutShell({
  userEmail,
  children,
}: AdminLayoutShellProps): React.JSX.Element {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isCollapsed, setIsCollapsed] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('admin_sidebar_collapsed') === 'true'
    }
    return false
  })

  const toggleCollapse = () => {
    const nextValue = !isCollapsed
    setIsCollapsed(nextValue)
    if (typeof window !== 'undefined') {
      localStorage.setItem('admin_sidebar_collapsed', String(nextValue))
    }
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-[#fdf8f7] text-[#1c1b1b]" style={{ fontFamily: 'Outfit, system-ui, sans-serif' }}>
      
      {/* Mobile Top Header Bar */}
      <div className="flex md:hidden items-center justify-between px-6 py-4 bg-[#f5f0ef] border-b border-[rgba(200,199,191,0.35)] sticky top-0 z-50">
        <div>
          <span style={{ fontFamily: 'Playfair Display, serif', fontSize: '18px', fontWeight: 600, color: '#010100' }}>
            GudSampada
          </span>
          <span className="ml-2 px-2 py-0.5 text-[9px] font-bold bg-gold/15 text-gold uppercase tracking-wider rounded">
            Admin
          </span>
        </div>
        
        {/* Hamburger Menu Toggle Button */}
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#1c1b1a', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '4px' }}
          aria-label="Toggle Sidebar Menu"
        >
          {isSidebarOpen ? (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          ) : (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          )}
        </button>
      </div>

      {/* Side Navigation Component with mobile control and desktop collapse props */}
      <SideNav
        userEmail={userEmail}
        isMobileOpen={isSidebarOpen}
        onMobileClose={() => setIsSidebarOpen(false)}
        isCollapsed={isCollapsed}
        onToggleCollapse={toggleCollapse}
      />

      {/* Main Content Pane */}
      <div className="flex-1 min-w-0 relative overflow-x-hidden admin-content-gutter">
        {children}
      </div>

    </div>
  )
}
