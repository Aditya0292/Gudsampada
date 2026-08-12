'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

type Tab = 'description' | 'benefits' | 'howToUse'

interface ProductInfoTabsProps {
  description: string
  benefits: string[]
  howToUse: string
}

export default function ProductInfoTabs({
  description,
  benefits,
  howToUse,
}: ProductInfoTabsProps): React.JSX.Element {
  const [activeTab, setActiveTab] = useState<Tab>('description')

  const tabs: { id: Tab; label: string }[] = [
    { id: 'description', label: 'Description' },
    { id: 'benefits', label: 'Benefits' },
    { id: 'howToUse', label: 'How to Use' },
  ]

  return (
    <div className="mt-32 border-t border-border pt-16 mb-28">
      <div className="flex border-b border-border mb-8 max-w-xl mx-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 pb-4 text-[10px] font-sans font-bold uppercase tracking-[0.2em] transition-all duration-300 relative ${
              activeTab === tab.id ? 'text-molasses font-bold' : 'text-molasses-lighter/50'
            }`}
            id={`tab-${tab.id}`}
          >
            {tab.label}
            {activeTab === tab.id && (
              <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-[2px] bg-molasses" />
            )}
          </button>
        ))}
      </div>
      <div className="px-1 min-h-[140px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === 'description' && (
              <div className="max-w-2xl mx-auto text-justify mt-8">
                <p className="text-molasses/70 text-[15px] leading-relaxed font-serif font-light text-justify">
                  {description}
                </p>
              </div>
            )}
            {activeTab === 'benefits' && (
              <div className="max-w-2xl mx-auto mt-8 flex justify-center">
                <ul className="space-y-4 text-left">
                  {benefits.map((benefit, i) => (
                    <li key={i} className="flex items-start gap-3.5 text-molasses/70 text-[15px] font-serif font-light">
                      <span className="text-gold mt-0.5 text-[13px]">✓</span>
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {activeTab === 'howToUse' && (
              <div className="max-w-2xl mx-auto text-justify mt-8">
                <p className="text-molasses/70 text-[15px] leading-relaxed font-serif font-light text-justify">
                  {howToUse}
                </p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
