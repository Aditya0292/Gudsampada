'use client'

import React, { useState } from 'react'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import CartDrawer from '@/components/shop/CartDrawer'
import AnimatedSection from '@/components/ui/AnimatedSection'
import SectionHeading from '@/components/ui/SectionHeading'
import B2BEnquiryForm from '@/components/business/B2BEnquiryForm'
import { B2BEnquiryType } from '@/types/supabase'

const enquiryOptions: { id: B2BEnquiryType; label: string; description: string }[] = [
  {
    id: 'bulk_temple',
    label: 'Temple Prasad & Bulk Events',
    description: '100% pure, wood-fired jaggery for temple offerings, sweet prasad, and large festive gatherings.',
  },
  {
    id: 'dealership',
    label: 'Dealership & Distribution',
    description: 'Become an authorized regional distributor or retail partner for GudSampada products.',
  },
  {
    id: 'export',
    label: 'B2B International Export',
    description: 'Export-certified organic Kolhapuri jaggery powder and bites shipped worldwide.',
  },
  {
    id: 'wholesale_discount',
    label: 'Wholesale Discount',
    description: 'Bulk recurring procurement discounts for restaurants, ayurvedic pharmacies, and bakeries.',
  },
]

export default function BusinessPage(): React.JSX.Element {
  const [activeType, setActiveType] = useState<B2BEnquiryType>('bulk_temple')

  return (
    <>
      <Header />
      <CartDrawer />
      <main className="main-page-padding py-20 min-h-screen bg-cream">
        <div className="container-main max-w-5xl mx-auto">
          {/* Hero Heading */}
          <AnimatedSection className="w-full flex flex-col items-center justify-center">
            <SectionHeading
              label="B2B & Institutional Partnerships"
              heading={
                <>
                  Partner with <span className="italic font-normal">GudSampada.</span>
                </>
              }
              description="We supply unrefined, chemical-free Kolhapuri jaggery to temples, distributors, exporters, and wellness brands across India and globally."
              align="center"
              className="mb-14"
            />
          </AnimatedSection>

          {/* Partnership Selection Cards (Strict Zero-Curve Geometry) */}
          <AnimatedSection delay={0.1}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {enquiryOptions.map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setActiveType(opt.id)}
                  className={`p-5 rounded-none text-left transition-all duration-300 cursor-pointer flex flex-col justify-between min-h-[120px] shadow-sm hover:-translate-y-0.5 ${
                    activeType === opt.id
                      ? 'bg-[#2D241E] text-[#F9F6F0]'
                      : 'bg-white/60 text-[#2D241E] hover:bg-white/80'
                  }`}
                >
                  <div>
                    <span className="text-[11px] font-sans font-bold uppercase tracking-[0.18em] block mb-2 leading-snug">
                      {opt.label}
                    </span>
                    <span className={`text-xs font-sans leading-relaxed block break-words ${activeType === opt.id ? 'text-[#F9F6F0]/80' : 'text-[#2D241E]/70'}`}>
                      {opt.description}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </AnimatedSection>

          {/* Form Wrapper Container (Strict Zero-Curve Geometry) */}
          <AnimatedSection delay={0.2}>
            <B2BEnquiryForm activeType={activeType} />
          </AnimatedSection>

          {/* Sacred Temple Prasad & Bulk Supply Showcase */}
          <AnimatedSection delay={0.3} className="mt-16 pt-12 border-t border-[#2D241E]/15 w-full flex flex-col items-center justify-center text-center">
            <SectionHeading
              label="Sacred Temple Supply & Mahaprasad"
              heading={
                <>
                  Pure Satvik Sweetness for <span className="italic font-normal">Divine Offerings.</span>
                </>
              }
              description="100% unrefined, bone-char-free Kolhapuri jaggery used by temple trusts for daily panchamrut, sweet mahaprasad, and grand festive thalis."
              align="center"
              className="mb-10"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Video 1: Prasad Making */}
              <div className="space-y-3">
                <div className="relative aspect-[16/10] w-full rounded-none overflow-hidden border border-[#2D241E]/15 bg-[#F7F4EE] shadow-xs">
                  <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover scale-[1.08] origin-top-left"
                    poster="/images/jaggery-block.png"
                  >
                    <source src="/videos/temple-prasad-making.mp4" type="video/mp4" />
                  </video>
                </div>
                <p className="text-center text-xs font-sans font-medium text-[#2D241E]/80 tracking-wide uppercase">
                  1. Traditional Wood-Fired Jaggery & Prasad Preparation
                </p>
              </div>

              {/* Video 2: Devotees Receiving Prasad */}
              <div className="space-y-3">
                <div className="relative aspect-[16/10] w-full rounded-none overflow-hidden border border-[#2D241E]/15 bg-[#F7F4EE] shadow-xs">
                  <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover scale-[1.08] origin-top-left"
                    poster="/images/women-artisans-jaggery-1.png"
                  >
                    <source src="/videos/temple-devotees-prasad.mp4" type="video/mp4" />
                  </video>
                </div>
                <p className="text-center text-xs font-sans font-medium text-[#2D241E]/80 tracking-wide uppercase">
                  2. Sacred Jaggery Prasad Shared with Devotees & Families
                </p>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </main>
      <Footer />
    </>
  )
}
