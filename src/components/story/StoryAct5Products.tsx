'use client'

import React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'

export default function StoryAct5Products() {
  return (
    <section className="py-24 bg-cream border-t border-molasses/10 min-h-screen flex items-center">
      <div className="container-main max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex flex-col items-center justify-center text-center w-full max-w-4xl mx-auto mb-12 translate-x-8 sm:translate-x-16 md:translate-x-28">
          <span className="text-[10px] font-sans font-bold uppercase tracking-[0.25em] text-gold block mb-3 text-center w-full">
            Act V — The Products
          </span>
          <h2 className="font-heading text-3xl sm:text-5xl font-light text-molasses leading-tight mb-4 text-center w-full flex flex-col items-center justify-center">
            <span className="block text-center w-full">the same fire. the same fields.</span>
            <span className="italic font-normal block text-center w-full mt-1">now, in your hands.</span>
          </h2>
        </div>

        {/* Exclusive Rotating Product Video Showcase */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="w-full relative aspect-[16/9] md:aspect-[21/9] rounded-none overflow-hidden border border-molasses/15 mb-8 bg-[#F7F4EE] shadow-md"
        >
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover scale-[1.08] origin-top-left"
            poster="/images/ginger-jaggery-powder.png"
          >
            <source src="/videos/act5-products.mp4" type="video/mp4" />
          </video>
        </motion.div>

        {/* Shop CTA Link */}
        <div className="text-center">
          <Link
            href="/shop"
            className="inline-block text-xs font-sans font-bold uppercase tracking-[0.2em] text-molasses hover:text-gold transition-colors underline underline-offset-8"
          >
            View Full Product Collection →
          </Link>
        </div>
      </div>
    </section>
  )
}
