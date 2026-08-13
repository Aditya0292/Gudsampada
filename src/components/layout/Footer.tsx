import React from 'react'
import Link from 'next/link'

export default function Footer(): React.JSX.Element {
  return (
    <footer style={{ background: '#1c1b1a', color: '#f5f0ef', borderTop: '1px solid rgba(255,255,255,0.06)', padding: '48px 0 32px', position: 'relative', overflow: 'hidden' }}>
      
      {/* Absolute watermark logo: uppercase, bold serif, matching Stitch reference */}
      <div style={{
        position: 'absolute',
        bottom: '36px',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        pointerEvents: 'none',
        userSelect: 'none',
        zIndex: 1,
      }}>
        <span style={{
          fontFamily: 'Playfair Display, serif',
          fontSize: '11.5vw',
          fontWeight: 900,
          color: 'rgba(255,255,255,0.035)',
          textTransform: 'uppercase',
          letterSpacing: '0.15em',
          lineHeight: 0.8,
          whiteSpace: 'nowrap'
        }}>
          GUD SAMPADA
        </span>
      </div>

      <div className="container-main max-w-6xl mx-auto px-6 sm:px-8 lg:px-12" style={{ position: 'relative', zIndex: 2 }}>
        
        {/* Grid Column Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          
          {/* Brand Panel */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <span style={{ fontFamily: 'Playfair Display, serif', fontSize: '20px', fontWeight: 600, color: '#fff', letterSpacing: '-0.01em' }}>
              gud<span style={{ fontStyle: 'italic', fontWeight: 400 }}>sampada.</span>
            </span>
            <p style={{ fontFamily: 'Playfair Display, serif', fontStyle: 'italic', fontSize: '12px', lineHeight: 1.5, color: 'rgba(245,240,239,0.7)', margin: 0, maxWidth: '220px' }}>
              Pure, unrefined jaggery from Kolhapur&apos;s finest lands. No chemicals, no shortcuts.
            </p>
          </div>

          {/* Quick Links */}
          <div style={{ fontFamily: 'Outfit, sans-serif' }}>
            <h4 style={{ fontSize: '9px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#c9a96e', margin: '0 0 14px' }}>
              Quick Links
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {[
                { href: '/shop', label: 'Shop All' },
                { href: '/our-story', label: 'Our Story' },
                { href: '/recipes', label: 'Artisan Recipes' },
                { href: '/business', label: 'B2B & Bulk Orders' },
              ].map((link) => (
                <li key={link.label}>
                  <Link href={link.href} style={{ fontSize: '12px', color: 'rgba(245,240,239,0.7)', textDecoration: 'none', transition: 'color 0.15s' }}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Help Links */}
          <div style={{ fontFamily: 'Outfit, sans-serif' }}>
            <h4 style={{ fontSize: '9px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#c9a96e', margin: '0 0 14px' }}>
              Help
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {[
                { href: '/track-order', label: 'Track Order' },
                { href: '/business', label: 'Shipping & Delivery' },
                { href: '#', label: 'Return Policy' },
                { href: '#', label: 'FAQs' },
              ].map((item) => (
                <li key={item.label}>
                  <Link href={item.href} style={{ fontSize: '12px', color: 'rgba(245,240,239,0.7)', textDecoration: 'none', transition: 'color 0.15s' }}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Get In Touch */}
          <div style={{ fontFamily: 'Outfit, sans-serif' }}>
            <h4 style={{ fontSize: '9px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#c9a96e', margin: '0 0 14px' }}>
              Get in Touch
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <li>
                <a href="tel:+919876543210" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: 'rgba(245,240,239,0.7)', textDecoration: 'none' }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                  +91 98765 43210
                </a>
              </li>
              <li>
                <a href="https://wa.me/919876543210" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: 'rgba(245,240,239,0.7)', textDecoration: 'none' }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                  WhatsApp Us
                </a>
              </li>
              <li>
                <a href="mailto:hello@gudsampada.com" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: 'rgba(245,240,239,0.7)', textDecoration: 'none' }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                  hello@gudsampada.com
                </a>
              </li>
              <li style={{ display: 'flex', alignItems: 'start', gap: '8px', fontSize: '12px', color: 'rgba(245,240,239,0.5)', lineHeight: 1.3 }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginTop: '2px' }}><path d="M12 2a8 8 0 0 0-8 8c0 5.25 8 12 8 12s8-6.75 8-12a8 8 0 0 0-8-8z"/><circle cx="12" cy="10" r="3"/></svg>
                Kolhapur, Maharashtra, India
              </li>
            </ul>
          </div>
        </div>

        {/* Divider / Copyright block */}
        <div className="flex flex-col md:flex-row justify-between items-center text-center gap-4 pt-6 mt-10 border-t border-white/10" style={{ fontFamily: 'Outfit, sans-serif' }}>
          <p style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'rgba(245,240,239,0.3)', margin: 0 }}>
            © {new Date().getFullYear()} GUDSAMPADA.
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4">
            <p style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'rgba(245,240,239,0.3)', margin: 0 }}>
              MADE IN KOLHAPUR, MAHARASHTRA
            </p>
            <Link
              href="/admin/login"
              style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'rgba(245,240,239,0.25)', textDecoration: 'none' }}
              title="Staff & Admin Portal"
            >
              • Admin Portal
            </Link>
          </div>
        </div>

      </div>
    </footer>
  )
}
