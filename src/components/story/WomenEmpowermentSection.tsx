'use client'

import React from 'react'
import Image from 'next/image'
import AnimatedSection from '@/components/ui/AnimatedSection'

export default function WomenEmpowermentSection() {
  return (
    <section className="section-padding bg-cream border-t border-molasses/10">
      <div className="container-main">
        <AnimatedSection>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            {/* Left: Photo Grid Pattern (Strict Zero-Curve Geometry) */}
            <div className="col-span-1 lg:col-span-6 grid grid-cols-2 gap-4">
              <div className="relative aspect-[4/5] rounded-none overflow-hidden bg-[#EBE7DF] border border-molasses/10 shadow-xs">
                <Image
                  src="/images/women-artisans-jaggery-1.png"
                  alt="Rural women artisans carefully hand-shaping organic jaggery bites in clean hygienic workshop"
                  fill
                  className="object-cover transition-transform duration-700 hover:scale-105"
                  sizes="(max-width: 1024px) 50vw, 25vw"
                />
              </div>
              <div className="relative aspect-[4/5] rounded-none overflow-hidden bg-[#EBE7DF] border border-molasses/10 shadow-xs mt-6">
                <Image
                  src="/images/women-artisans-jaggery-2.png"
                  alt="Kolhapur women artisans inspecting fresh organic jaggery powder under strict quality hygiene"
                  fill
                  className="object-cover transition-transform duration-700 hover:scale-105"
                  sizes="(max-width: 1024px) 50vw, 25vw"
                />
              </div>
            </div>

            {/* Right: Narrative Editorial Copy */}
            <div className="col-span-1 lg:col-span-6">
              <span className="text-[10px] font-sans font-bold uppercase tracking-[0.25em] text-gold block mb-2">
                Empowering Rural Women Artisans
              </span>
              <h2 className="font-heading text-3xl md:text-4xl font-light text-molasses leading-tight mb-6">
                Crafted by the women of <span className="italic font-normal">Kolhapur.</span>
              </h2>
              <p className="text-molasses/70 text-sm md:text-base font-serif font-light leading-relaxed mb-6">
                Behind every pouch of GudSampada jaggery is the dedicated craftsmanship and hygiene of rural women artisans in Kolhapur. Operating in immaculate, food-safe artisanal facilities, our women team hand-shapes organic paan bites, solar-dries ginger powder, and maintains strict food safety standards.
              </p>

              <div className="p-5 rounded-none bg-[#F7F4EE] border border-molasses/20 text-xs font-sans text-molasses/80 space-y-2">
                <div className="flex items-center gap-2 font-bold text-molasses">
                  <span>✨</span> 100% Hygienic & Fair-Trade Village Employment
                </div>
                <p className="text-molasses/70 leading-relaxed">
                  Empowering 40+ rural women households with year-round dignified employment, food-safety training, and economic independence.
                </p>
              </div>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  )
}
