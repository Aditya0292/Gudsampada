'use client'

import React from 'react'

interface SpecItem {
  label: string
  value: string
  icon: React.ReactNode
}

interface ProductSpecsProps {
  handle: string
}

export default function ProductSpecs({ handle }: ProductSpecsProps): React.JSX.Element {
  const specs: SpecItem[] = handle === 'ginger-jaggery-powder'
    ? [
        {
          label: 'Origin',
          value: 'Kolhapur, Maharashtra',
          icon: (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-molasses/40">
              <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
          ),
        },
        {
          label: 'Taste Profile',
          value: 'Spicy-sweet & warm ginger notes',
          icon: (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-molasses/40">
              <path d="M12 22a7 7 0 0 0 7-7c0-4.3-7-11-7-11S5 10.7 5 15a7 7 0 0 0 7 7z" />
            </svg>
          ),
        },
        {
          label: 'Method',
          value: 'Traditional small-batch open pan',
          icon: (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-molasses/40">
              <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
            </svg>
          ),
        },
      ]
    : [
        {
          label: 'Origin',
          value: 'Kolhapur, Maharashtra',
          icon: (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-molasses/40">
              <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
          ),
        },
        {
          label: 'Taste Profile',
          value: 'Refreshing betel & cardamom sweet',
          icon: (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-molasses/40">
              <path d="M12 22a7 7 0 0 0 7-7c0-4.3-7-11-7-11S5 10.7 5 15a7 7 0 0 0 7 7z" />
            </svg>
          ),
        },
        {
          label: 'Method',
          value: 'Artisan hand-cut vacuum packed',
          icon: (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-molasses/40">
              <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
            </svg>
          ),
        },
      ]

  return (
    <div className="flex flex-col gap-10 lg:gap-14">
      {specs.map((item, idx) => (
        <div key={idx} className="flex items-start gap-5">
          <span className="mt-1 flex-shrink-0">{item.icon}</span>
          <div className="flex flex-col">
            <span className="text-[10px] font-sans font-bold uppercase tracking-[0.2em] text-molasses/50 mb-1.5">
              {item.label}
            </span>
            <span className="text-[15px] font-medium text-molasses leading-relaxed">
              {item.value}
            </span>
          </div>
        </div>
      ))}
    </div>
  )
}
