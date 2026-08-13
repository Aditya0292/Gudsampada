import React from 'react'
import ProductForm from '../ProductForm'

export default function AdminNewProductPage(): React.JSX.Element {
  return (
    <div className="w-full py-16 space-y-8">
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
