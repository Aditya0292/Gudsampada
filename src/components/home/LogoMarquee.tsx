'use client'

import { motion } from 'framer-motion'

export default function LogoMarquee() {
 const marqueeText = '100% PURE & ORGANIC • FARM DIRECT FROM KOLHAPUR • CHEMICAL FREE • TRADITIONALLY CRAFTED • ZERO REFINEMENT • NO PRESERVATIVES • '

 return (
 <div className="relative w-full bg-molasses py-4 overflow-hidden border-y border-white/10 select-none">
 <div className="flex w-max">
 {/* First list */}
 <motion.div
 animate={{ x: [0, '-50%'] }}
 transition={{
 ease: 'linear',
 duration: 25,
 repeat: Infinity,
 }}
 className="flex whitespace-nowrap gap-4 pr-4"
 >
 <span className="text-[10px] md:text-xs font-semibold text-white/60 tracking-[0.25em] uppercase">
 {marqueeText.repeat(4)}
 </span>
 </motion.div>
 </div>
 </div>
 )
}
