import React from 'react'
import Link from 'next/link'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import OrderDetailClient from './OrderDetailClient'
import { AdminOrder } from '../OrdersTable'

export default async function AdminOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}): Promise<React.JSX.Element> {
  const { id } = await params
  const supabase = await createServerSupabaseClient()

  const { data: rawOrder } = await (supabase.from('orders') as any)
    .select('*')
    .eq('id', id)
    .single()

  const order = rawOrder as AdminOrder | null

  if (!order) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center space-y-4">
        <h1 className="font-heading text-3xl font-light text-molasses">Order Not Found</h1>
        <p className="text-xs font-sans text-molasses/60">
          The requested order ID does not exist or has been removed.
        </p>
        <Link
          href="/admin/orders"
          className="inline-block bg-[#2D241E] text-cream text-xs font-sans font-bold uppercase tracking-wider px-4 py-2.5 rounded-none"
        >
          ← Return to Orders List
        </Link>
      </div>
    )
  }

  return (
    <div className="w-full py-16 space-y-8">
      <OrderDetailClient order={order} />
    </div>
  )
}
