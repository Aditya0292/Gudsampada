import Link from 'next/link'

export default function Footer(): React.JSX.Element {
  return (
    <footer className="w-full bg-molasses text-cream pt-16 md:pt-24 pb-12 overflow-hidden border-t border-white/5">
      <div className="container-main relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
          
          {/* Brand */}
          <div className="col-span-1 sm:col-span-2 lg:col-span-1 flex flex-col space-y-4">
            <div className="mb-2">
              <span className="font-heading text-2xl font-bold text-white tracking-tight">
                gud<span className="font-normal italic">sampada.</span>
              </span>
            </div>
            <p className="text-cream/80 text-sm leading-relaxed max-w-xs font-serif font-light">
              Pure, unrefined jaggery from Kolhapur&apos;s finest lands. No
              chemicals, no shortcuts — just nature&apos;s sweetness.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-sans text-[11px] font-bold uppercase tracking-[0.2em] text-gold mb-6">
              Quick Links
            </h4>
            <ul className="space-y-3.5">
              {[
                { href: '/shop', label: 'Shop All' },
                { href: '/our-story', label: 'Our Story' },
                { href: '/recipes', label: 'Artisan Recipes' },
                { href: '/business', label: 'B2B & Bulk Orders' },
              ].map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-cream/75 hover:text-white transition-colors duration-300 font-sans"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Help */}
          <div>
            <h4 className="font-sans text-[11px] font-bold uppercase tracking-[0.2em] text-gold mb-6">
              Help
            </h4>
            <ul className="space-y-3.5">
              {[
                { href: '/track-order', label: 'Track Order' },
                { href: '/business', label: 'Shipping & Delivery' },
                { href: '#', label: 'Return Policy' },
                { href: '#', label: 'FAQs' },
              ].map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="text-sm text-cream/75 hover:text-white transition-colors duration-300 font-sans"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-sans text-[11px] font-bold uppercase tracking-[0.2em] text-gold mb-6">
              Get in Touch
            </h4>
            <ul className="space-y-3.5 text-sm font-sans">
              <li>
                <a href="tel:+919876543210" className="text-cream/85 hover:text-white transition-colors duration-300 flex items-center gap-2.5">
                  <span>📞</span> +91 98765 43210
                </a>
              </li>
              <li>
                <a
                  href="https://wa.me/919876543210"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-cream/85 hover:text-white transition-colors duration-300 flex items-center gap-2.5"
                >
                  <span>💬</span> WhatsApp Us
                </a>
              </li>
              <li>
                <a href="mailto:hello@gudsampada.com" className="text-cream/85 hover:text-white transition-colors duration-300 flex items-center gap-2.5">
                  <span>✉️</span> hello@gudsampada.com
                </a>
              </li>
              <li className="flex items-start gap-2.5 text-cream/70 font-serif font-light">
                <span className="mt-0.5">📍</span> Kolhapur, Maharashtra, India
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Copyright Block */}
        <div className="mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-cream/40 text-[11px] font-sans uppercase tracking-wider">
            © {new Date().getFullYear()} GUDSAMPADA. ALL RIGHTS RESERVED.
          </p>
          <div className="flex items-center space-x-4">
            <p className="text-cream/40 text-[11px] font-sans uppercase tracking-wider">
              MADE IN KOLHAPUR, MAHARASHTRA
            </p>
            <Link
              href="/admin/login"
              className="text-cream/30 hover:text-gold text-[10px] font-sans uppercase tracking-widest transition-colors duration-300"
              title="Staff & Admin Portal"
            >
              • Admin Portal
            </Link>
          </div>
        </div>

        {/* Subtle Screen-width Brand Name */}
        <div className="mt-12 pt-4 overflow-hidden pointer-events-none select-none w-full flex justify-center">
          <span className="font-heading text-[clamp(2.5rem,12vw,7rem)] font-bold text-white/[0.04] leading-none text-center tracking-widest uppercase whitespace-nowrap overflow-hidden">
            gudsampada
          </span>
        </div>
      </div>
    </footer>
  )
}
