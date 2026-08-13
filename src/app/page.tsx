'use client'

import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import HeroSection from '@/components/home/HeroSection'
import LogoMarquee from '@/components/home/LogoMarquee'
import ProductShowcase from '@/components/home/ProductShowcase'
import WhySection from '@/components/home/WhySection'
import TestimonialSection from '@/components/home/TestimonialSection'
import StoryTeaser from '@/components/home/StoryTeaser'
import CertificationsStrip from '@/components/home/CertificationsStrip'
import NewsletterCTA from '@/components/home/NewsletterCTA'
import CartDrawer from '@/components/shop/CartDrawer'

import WomenEmpowermentSection from '@/components/story/WomenEmpowermentSection'

export default function HomePage() {
  return (
    <>
      <Header />
      <CartDrawer />
      <main className="overflow-x-hidden">
        <HeroSection />
        <LogoMarquee />
        <ProductShowcase />
        <CertificationsStrip />
        <WhySection />
        <StoryTeaser />
        <WomenEmpowermentSection />
        <TestimonialSection />
      </main>
      <Footer />
    </>
  )
}
