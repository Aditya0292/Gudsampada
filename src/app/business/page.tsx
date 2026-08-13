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
      <main style={{ background: '#f9f4f1', minHeight: '100vh', fontFamily: 'Outfit, sans-serif', paddingTop: '100px' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', paddingLeft: '16px', paddingRight: '16px', paddingBottom: '48px' }}>
          
          {/* --- BLOCK 1: HERO --- */}
          <div style={{ marginBottom: '56px' }} className="w-full flex flex-col items-center justify-center">
            <AnimatedSection>
              <SectionHeading
                label="B2B & Institutional Partnerships"
                heading={
                  <>
                    Partner with <span className="italic font-normal">GudSampada.</span>
                  </>
                }
                description="We supply unrefined, chemical-free Kolhapuri jaggery to temples, distributors, exporters, and wellness brands across India and globally."
                align="center"
                className="!mb-0"
              />
            </AnimatedSection>
          </div>
 
          {/* --- BLOCK 2: CARDS --- */}
          <div style={{ marginBottom: '32px' }}>
            <AnimatedSection delay={0.1}>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
                {enquiryOptions.map((opt) => {
                  const active = activeType === opt.id
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setActiveType(opt.id)}
                      style={{
                        padding: '20px 18px',
                        border: active ? '1.5px solid #1c1b1a' : '1px solid rgba(200,193,182,0.6)',
                        background: active ? '#1c1b1a' : '#ffffff',
                        color: active ? '#fff' : '#010100',
                        textAlign: 'left',
                        cursor: 'pointer',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        minHeight: '120px',
                        borderRadius: 0,
                        transition: 'all 0.3s ease',
                        boxSizing: 'border-box',
                        fontFamily: 'Outfit, sans-serif',
                      }}
                      className={`transition-all duration-300 hover:border-[#1c1b1a] ${active ? '' : 'hover:-translate-y-1 hover:shadow-md'}`}
                    >
                      <div>
                        <span style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: active ? '#c9a96e' : '#8a8880', display: 'block', marginBottom: '8px' }}>
                          {opt.label}
                        </span>
                        <span style={{ fontSize: '12px', lineHeight: 1.4, color: active ? 'rgba(255,255,255,0.85)' : '#474741', display: 'block' }}>
                          {opt.description}
                        </span>
                      </div>
                    </button>
                  )
                })}
              </div>
            </AnimatedSection>
          </div>
 
          {/* --- BLOCK 3: FORM --- */}
          <div>
            <AnimatedSection delay={0.2}>
              <B2BEnquiryForm activeType={activeType} />
            </AnimatedSection>
          </div>

          {/* Sacred Temple Prasad & Bulk Supply Showcase */}
          <AnimatedSection delay={0.3} className="mt-16 sm:mt-20 pt-12 sm:pt-16 border-t border-[rgba(200,193,182,0.45)] w-full flex flex-col items-center justify-center text-center">
            <SectionHeading
              label="Sacred Temple Supply & Mahaprasad"
              heading={
                <>
                  Pure Satvik Sweetness for <span className="italic font-normal">Divine Offerings.</span>
                </>
              }
              description="100% unrefined, bone-char-free Kolhapuri jaggery used by temple trusts for daily panchamrut, sweet mahaprasad, and grand festive thalis."
              align="center"
              className="mb-8 sm:mb-12"
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 w-full">
              {/* Video 1: Prasad Making */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ position: 'relative', width: '100%', aspectRatio: '16/10', border: '1px solid rgba(200,193,182,0.5)', overflow: 'hidden', background: '#f5f0ef' }}>
                  <video autoPlay loop muted playsInline style={{ width: '100%', height: '100%', objectFit: 'cover' }}>
                    <source src="/videos/temple-prasad-making.mp4" type="video/mp4" />
                  </video>
                </div>
                <p style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#8a8880', margin: 0 }}>
                  1. Traditional Wood-Fired Jaggery &amp; Prasad Preparation
                </p>
              </div>

              {/* Video 2: Devotees Receiving Prasad */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ position: 'relative', width: '100%', aspectRatio: '16/10', border: '1px solid rgba(200,193,182,0.5)', overflow: 'hidden', background: '#f5f0ef' }}>
                  <video autoPlay loop muted playsInline style={{ width: '100%', height: '100%', objectFit: 'cover' }}>
                    <source src="/videos/temple-devotees-prasad.mp4" type="video/mp4" />
                  </video>
                </div>
                <p style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#8a8880', margin: 0 }}>
                  2. Sacred Jaggery Prasad Shared with Devotees &amp; Families
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
