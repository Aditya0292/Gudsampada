'use client'

import React from 'react'

interface SectionHeadingProps {
  label: string
  heading: string | React.ReactNode
  description?: string
  align?: 'center' | 'left'
  className?: string
}

export default function SectionHeading({
  label,
  heading,
  description,
  align = 'center',
  className = '',
}: SectionHeadingProps): React.JSX.Element {
  const alignmentClass = align === 'center' ? 'text-center items-center mx-auto' : 'text-left items-start'

  return (
    <div className={`flex flex-col mb-12 ${alignmentClass} ${className}`}>
      <span className="text-[10px] font-sans font-bold uppercase tracking-[0.25em] text-gold block mb-2">
        {label}
      </span>
      <h2 className="font-heading text-3xl md:text-4xl text-molasses font-light leading-tight">
        {heading}
      </h2>
      {description && (
        <p className="mt-4 text-molasses/70 text-base font-serif font-light leading-relaxed max-w-xl">
          {description}
        </p>
      )}
    </div>
  )
}
