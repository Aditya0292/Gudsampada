'use client'

import React from 'react'
import AnimatedSection from '@/components/ui/AnimatedSection'
import SectionHeading from '@/components/ui/SectionHeading'

export default function TestimonialSection(): React.JSX.Element {
  const reviews = [
    {
      id: 1,
      quote: "I've finally found jaggery that tastes exactly like what my grandmother used to bring from the village. The ginger infusion is perfectly balanced.",
      name: "Sunita M.",
      info: "Homemaker • Pune",
      initials: "SM"
    },
    {
      id: 2,
      quote: "As an athlete, I avoid refined sugar entirely. GudSampada gives me clean energy before workouts — zero chemical aftertaste, zero guilt.",
      name: "Vikram S.",
      info: "Fitness Coach • Delhi",
      initials: "VS"
    },
    {
      id: 3,
      quote: "I tested their powder in my morning chai and it never curdled the milk. That's the ultimate test of genuinely chemical-free jaggery.",
      name: "Priya R.",
      info: "Food Blogger • Bangalore",
      initials: "PR"
    }
  ]

  return (
    <section className="py-24 md:py-32 bg-molasses overflow-x-hidden border-t border-molasses-light">
      <div className="container-main">
        {/* Section Header */}
        <AnimatedSection className="w-full flex justify-center mb-16">
          <SectionHeading
            label="VOICES OF PURITY"
            heading={
              <span className="text-cream">
                what our <span className="italic font-normal">community</span> says.
              </span>
            }
            description="Real customers. Real kitchens. No filters."
            align="center"
            className="text-cream"
          />
        </AnimatedSection>

        {/* 3-Column Review Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-7xl mx-auto px-4 mt-16 mb-24">
          {reviews.map((review, idx) => (
            <AnimatedSection key={review.id} direction="up" delay={0.15 * (idx + 1)}>
              <div className="relative flex flex-col justify-between p-10 md:p-12 border border-gold/20 bg-white/[0.02] rounded-none h-full">
                {/* Quote Icon */}
                <span className="text-gold text-4xl leading-none font-serif mb-4 block select-none">
                  “
                </span>

                {/* Body Text */}
                <p className="font-serif italic text-cream opacity-90 text-[15px] leading-relaxed mb-8 flex-grow text-left">
                  {review.quote}
                </p>

                {/* Author Block */}
                <div className="flex items-center gap-4 pt-6 border-t border-cream/10">
                  {/* Avatar (Strict Zero-Curve) */}
                  <div className="w-10 h-10 rounded-none border border-cream/20 flex items-center justify-center text-xs font-bold text-cream shrink-0">
                    {review.initials}
                  </div>
                  {/* Text */}
                  <div className="flex flex-col text-left">
                    <span className="text-sm font-bold text-cream">
                      {review.name}
                    </span>
                    <span className="text-[10px] uppercase tracking-widest text-cream opacity-50 mt-0.5">
                      {review.info}
                    </span>
                  </div>
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>

        {/* Featured Quote (Bottom) */}
        <AnimatedSection direction="up" delay={0.3} className="w-full flex justify-center">
          <div className="max-w-3xl mx-auto flex flex-col items-center text-center px-4 mt-16">
            <p className="font-serif italic text-base md:text-xl text-center text-cream opacity-95 leading-relaxed mb-6">
              "As an Ayurvedic practitioner, I've seen clients struggle with synthetic sweeteners. GudSampada closes that gap before they even reach my clinic."
            </p>
            <div className="flex flex-col items-center text-center">
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-gold mb-1">
                Dr. Meera Kulkarni
              </span>
              <span className="text-[10px] text-cream opacity-40 uppercase tracking-widest">
                BAMS, Ayurveda & Wellness Expert
              </span>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  )
}
