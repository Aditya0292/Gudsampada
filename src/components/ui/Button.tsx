'use client'

import React from 'react'
import Link from 'next/link'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline' | 'text'
  href?: string
  loading?: boolean
  className?: string
  children: React.ReactNode
}

export default function Button({
  variant = 'primary',
  href,
  loading = false,
  className = '',
  children,
  ...props
}: ButtonProps): React.JSX.Element {
  const baseStyle = 'inline-flex items-center justify-center font-sans font-bold text-xs sm:text-sm uppercase tracking-[0.2em] transition-colors duration-300 rounded-none cursor-pointer'
  
  const variants = {
    primary: 'bg-[#2C221E] hover:bg-gold text-[#F9F6F0] py-4 sm:py-4.5 px-9 sm:px-12 shadow-sm border border-transparent disabled:bg-[#2C221E]/60 disabled:cursor-not-allowed',
    outline: 'border border-[#2D241E]/20 text-molasses hover:border-[#2D241E] py-4 sm:py-4.5 px-9 sm:px-12 bg-transparent disabled:opacity-50 disabled:cursor-not-allowed',
    text: 'gap-2.5 py-2.5 hover:text-gold text-molasses disabled:opacity-50 disabled:cursor-not-allowed',
  }

  const content = (
    <>
      {loading && (
        <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      )}
      {children}
    </>
  )

  if (href) {
    return (
      <Link href={href} className={`${baseStyle} ${variants[variant]} ${className}`}>
        {content}
      </Link>
    )
  }

  return (
    <button
      className={`${baseStyle} ${variants[variant]} ${className}`}
      disabled={loading || props.disabled}
      {...props}
    >
      {content}
    </button>
  )
}
