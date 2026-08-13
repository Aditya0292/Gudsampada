'use client'

import { Product } from '@/data/products'
import ProductCard from './ProductCard'
import { AnimatePresence, motion } from 'framer-motion'

interface ProductGridProps {
 products: Product[]
}

export default function ProductGrid({ products }: ProductGridProps): React.JSX.Element {
  const count = products.length

  const gridClasses = "grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-x-8 sm:gap-y-16 w-full"

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={products.map((p) => p.id).join('-')}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className={gridClasses}
      >
        {products.map((product, index) => (
          <ProductCard key={product.id} product={product} index={index} />
        ))}
      </motion.div>
    </AnimatePresence>
  )
}
