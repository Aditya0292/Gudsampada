'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import AnimatedSection from '@/components/ui/AnimatedSection'

export default function NewsletterCTA() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (email) {
      setSubmitted(true)
      setEmail('')
    }
  }

  return (
    <section className="w-full bg-[#232320] px-4 py-16 md:py-20 relative overflow-hidden border-y border-gold/15">
      {/* Decorative subtle background blurs */}
      <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-gold/10 rounded-full blur-[90px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[200px] h-[200px] bg-gold/5 rounded-full blur-[70px] pointer-events-none" />

      <div className="container-main relative z-10">
        <AnimatedSection>
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12 w-full text-cream">
            
            {/* Heading & Subtitle group */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 lg:gap-8">
              <h2 className="font-heading text-3xl md:text-4xl text-white leading-none lowercase whitespace-nowrap">
                sweet updates<span className="text-gold">.</span>
              </h2>
              <span className="hidden sm:block w-px h-8 bg-cream/20" />
              <p className="font-serif font-light text-cream/80 text-sm md:text-base leading-relaxed">
                New products, limited batches, and early access. No spam.
              </p>
            </div>

            {/* Form */}
            <div className="w-full lg:w-auto flex-1 max-w-md">
              {submitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-gold/15 backdrop-blur-sm border border-gold/30 rounded-xl px-6 py-3.5 inline-flex items-center gap-3 w-full justify-center"
                >
                  <span className="text-xl">✨</span>
                  <span className="text-white text-sm font-medium">
                    You&apos;re in! Check your inbox soon.
                  </span>
                </motion.div>
              ) : (
                <form
                  onSubmit={handleSubmit}
                  className="flex items-center border-b border-cream/30 pb-2 focus-within:border-gold transition-colors duration-300 w-full"
                >
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                    className="w-full bg-transparent outline-none text-white placeholder:text-cream/40 text-sm md:text-base font-sans tracking-wide"
                    id="newsletter-email"
                  />
                  <button
                    type="submit"
                    className="text-xs font-bold tracking-[0.2em] uppercase text-gold hover:text-white transition-colors duration-200 whitespace-nowrap pl-6 border-l border-cream/20 ml-4 cursor-pointer"
                    id="newsletter-submit"
                  >
                    SUBSCRIBE
                  </button>
                </form>
              )}
            </div>

          </div>
        </AnimatedSection>
      </div>
    </section>
  )
}
