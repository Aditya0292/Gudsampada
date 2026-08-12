'use client'

import { motion, useScroll, useSpring } from 'framer-motion'

export default function StoryProgressIndicator() {
  const { scrollYProgress } = useScroll()
  const scaleY = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  })

  return (
    <div className="hidden lg:block fixed right-8 top-1/2 -translate-y-1/2 z-40 h-48 w-1">
      {/* Background Track */}
      <div className="h-full w-full bg-molasses/10 rounded-full overflow-hidden relative">
        {/* Active Scroll Indicator */}
        <motion.div
          className="w-full bg-gradient-to-b from-gold to-amber-600 origin-top h-full rounded-full"
          style={{ scaleY }}
        />
      </div>
      <span className="absolute -left-12 top-1/2 -translate-y-1/2 -rotate-90 text-[9px] font-sans font-bold uppercase tracking-[0.3em] text-molasses/40 whitespace-nowrap">
        Story Progress
      </span>
    </div>
  )
}
