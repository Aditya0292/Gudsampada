'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'

export default function StoryAct6People() {
  return (
    <section className="py-28 bg-[#F7F4EE] border-t border-molasses/10 min-h-screen flex items-center">
      <div className="container-main max-w-5xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-20">
          {/* Left: Video Showcase Frame */}
          <div className="lg:col-span-6 relative aspect-[4/3] w-full rounded-none overflow-hidden border border-molasses/15 bg-cream shadow-md">
            <video
              autoPlay
              loop
              muted
              playsInline
              preload="none"
              className="w-full h-full object-cover scale-[1.08] origin-top-left"
              poster="/images/women-artisans-jaggery-1.png"
            >
              <source src="/videos/act6-people.mp4" type="video/mp4" />
              <Image
                src="/images/women-artisans-jaggery-1.png"
                alt="Kolhapur rural women artisans in clean food-safe environment crafting jaggery products"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </video>
          </div>

          {/* Right: Narrative */}
          <div className="lg:col-span-6 space-y-6">
            <span className="text-[10px] font-sans font-bold uppercase tracking-[0.25em] text-gold block">
              Act VI — The People
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl font-light text-molasses leading-tight">
              Empowering 40+ rural women households in Kolhapur.
            </h2>
            <p className="font-serif text-sm sm:text-base text-molasses/70 leading-relaxed font-light">
              By preserving heirloom wood-firing techniques and providing year-round dignified employment, GudSampada ensures fair trade wages, food safety standards, and economic autonomy for female artisans.
            </p>
          </div>
        </div>

        {/* Emotional Close & CTA */}
        <div className="text-center pt-12 border-t border-molasses/10 max-w-2xl mx-auto space-y-6">
          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-heading text-3xl sm:text-5xl font-light text-molasses leading-tight lowercase"
          >
            this is gudsampada. <br />
            <span className="italic font-normal text-gold">pure, from root to home.</span>
          </motion.h3>

          <div style={{ marginTop: '32px' }}>
            <Link
              href="/shop"
              style={{
                display: 'inline-block',
                background: 'transparent',
                border: '1.5px solid #1c1b1a',
                color: '#1c1b1a',
                padding: '16px 32px',
                fontSize: '13px',
                fontWeight: 700,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                fontFamily: 'Outfit, sans-serif'
              }}
              className="hover:bg-[#1c1b1a] hover:text-white"
            >
              Explore Our Products →
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
