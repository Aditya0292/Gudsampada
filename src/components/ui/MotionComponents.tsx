'use client'

import React from 'react'
import { motion, useReducedMotion } from 'framer-motion'

// Reusable transition curves
export const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const

interface FadeInWhenVisibleProps {
  children: React.ReactNode
  delay?: number
  duration?: number
  yOffset?: number
  xOffset?: number
  className?: string
}

export function FadeInWhenVisible({
  children,
  delay = 0,
  duration = 0.8,
  yOffset = 24,
  xOffset = 0,
  className = '',
}: FadeInWhenVisibleProps) {
  const shouldReduceMotion = useReducedMotion()

  const variants = {
    hidden: {
      opacity: 0,
      y: shouldReduceMotion ? 0 : yOffset,
      x: shouldReduceMotion ? 0 : xOffset,
    },
    visible: {
      opacity: 1,
      y: 0,
      x: 0,
      transition: {
        duration: shouldReduceMotion ? 0.1 : duration,
        delay,
        ease: EASE_OUT_EXPO,
      },
    },
  }

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-10%' }}
      variants={variants}
      className={className}
    >
      {children}
    </motion.div>
  )
}

interface StaggerChildrenProps {
  children: React.ReactNode
  staggerDelay?: number
  delayChildren?: number
  className?: string
}

export function StaggerChildren({
  children,
  staggerDelay = 0.1,
  delayChildren = 0,
  className = '',
}: StaggerChildrenProps) {
  const shouldReduceMotion = useReducedMotion()

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : staggerDelay,
        delayChildren: shouldReduceMotion ? 0 : delayChildren,
      },
    },
  }

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-10%' }}
      variants={containerVariants}
      className={className}
    >
      {children}
    </motion.div>
  )
}
