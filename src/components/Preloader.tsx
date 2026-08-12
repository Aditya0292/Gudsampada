'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function Preloader() {
  const [show, setShow] = useState(false)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const hasShown = sessionStorage.getItem('preloaderShown')
      if (hasShown) {
        return // Already shown this session, do nothing
      }
      setShow(true)
      document.body.style.overflow = 'hidden' // Lock scroll during preloader
    }

    // Counter logic with RAF
    const DURATION = 2500 // 2.5s to cycle images
    let startTime: number | null = null
    let rafId: number

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const elapsed = timestamp - startTime

      let currentProgress = Math.min((elapsed / DURATION) * 100, 100)

      setProgress(Math.floor(currentProgress))

      if (currentProgress < 100) {
        rafId = requestAnimationFrame(animate)
      } else {
        // We hit 100%
        // Wait 500ms before exit
        setTimeout(() => {
          setShow(false)
          document.body.style.overflow = '' // Restore scroll
          sessionStorage.setItem('preloaderShown', 'true')
        }, 500)
      }
    }

    rafId = requestAnimationFrame(animate)

    return () => {
      cancelAnimationFrame(rafId)
    }
  }, [])

  // Calculate acts
  const isAct3 = progress === 100

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="preloader"
          className="fixed inset-0 z-[9999] bg-cream flex flex-col items-center justify-center"
          exit={{ y: "-100%" }}
          transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1] }}
        >
          {/* Background Brand Watermark */}
          <div className="absolute inset-x-0 top-0 flex justify-center pointer-events-none select-none overflow-hidden z-0 pt-16 md:pt-24">
            <span className="font-heading text-[10vw] md:text-[11vw] font-bold tracking-[0.12em] text-molasses/[0.08] uppercase whitespace-nowrap">
              GUDSAMPADA
            </span>
          </div>

          {/* Image Container */}
          <div className="w-24 h-24 md:w-32 md:h-32 relative flex items-center justify-center z-10">
            <div className="w-full h-full relative">
              {/* Sugarcane */}
              <motion.img
                src="/images/loader-sugarcane.png"
                alt="Sugarcane"
                className="absolute inset-0 w-full h-full object-contain filter invert-0"
                initial={{ opacity: 1 }}
                animate={{ opacity: progress < 33 ? 1 : 0 }}
                transition={{ duration: 0.3 }}
              />
              {/* Jaggery Cubes */}
              <motion.img
                src="/images/loader-cubes.png"
                alt="Jaggery Cubes"
                className="absolute inset-0 w-full h-full object-contain filter invert-0"
                initial={{ opacity: 0 }}
                animate={{ opacity: progress >= 66 ? 1 : 0 }}
                transition={{ duration: 0.3 }}
              />
              {/* Jaggery Powder */}
              <motion.img
                src="/images/loader-powder.png"
                alt="Jaggery Powder"
                className="absolute inset-0 w-full h-full object-contain filter invert-0"
                initial={{ opacity: 0 }}
                animate={{ opacity: (progress >= 33 && progress < 66) ? 1 : 0 }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>

          {/* Progress Counter */}
          <motion.p className="font-serif text-5xl md:text-6xl italic text-molasses mt-8 tracking-widest font-light z-10">
            {progress}%
          </motion.p>

          {/* Tagline (Act 3) */}
          <AnimatePresence>
            {isAct3 && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.3 }} // Wait 400ms, then fade
                className="absolute bottom-1/4 font-serif text-sm italic text-gold mt-4 tracking-[0.3em] z-10"
              >
                pure. unrefined.
              </motion.p>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
