import React from 'react'
import ProductForm from '../ProductForm'

export default function AdminNewProductPage(): React.JSX.Element {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="border-b border-[#2D241E]/15 pb-5">
        <span className="text-[10px] font-sans font-bold uppercase tracking-[0.25em] text-gold block mb-1">
          Catalog Creation
        </span>
        <h1 className="font-heading text-3xl font-light text-molasses">Add New Product</h1>
      </div>

      {/* Product Form */}
      <ProductForm isEdit={false} />
    </div>
  )
}
