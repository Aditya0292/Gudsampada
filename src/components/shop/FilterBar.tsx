'use client'

import { categories } from '@/data/products'
import { motion } from 'framer-motion'

interface FilterBarProps {
 activeCategory: string
 onCategoryChange: (category: string) => void
}

export default function FilterBar({
 activeCategory,
 onCategoryChange,
}: FilterBarProps) {
 return (
 <div className="flex justify-center gap-8 mb-12 border-b border-border pb-4">
 {categories.map((cat) => (
 <button
 key={cat.id}
 onClick={() => onCategoryChange(cat.id)}
 className={`relative pb-4 text-[10px] font-sans font-bold uppercase tracking-[0.2em] transition-all duration-300 ${
 activeCategory === cat.id
 ? 'text-molasses'
 : 'text-molasses-lighter/50 '
 }`}
 id={`filter-${cat.id}`}
 >
 {activeCategory === cat.id && (
 <motion.div
 layoutId="activeFilterLine"
 className="absolute bottom-0 left-0 right-0 h-[2px] bg-molasses"
 transition={{ type: 'spring', damping: 30, stiffness: 350 }}
 />
 )}
 <span>{cat.label}</span>
 </button>
 ))}
 </div>
 )
}
