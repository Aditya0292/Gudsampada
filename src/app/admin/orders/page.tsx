import React from 'react'
import { getSupabaseServerClient } from '@/lib/supabase/server'
import OrdersTable, { AdminOrder } from './OrdersTable'

export default async function AdminOrdersPage(): Promise<React.JSX.Element> {
  const supabase = getSupabaseServerClient()

  const { data: rawOrders } = await (supabase.from('orders') as any)
    .select('*')
    .order('created_at', { ascending: false })

  const orders = (rawOrders || []) as AdminOrder[]

  return (
    <div className="w-full bg-[#F4F1EA] min-h-screen">
      <div className="w-full px-6 md:px-10 lg:px-12 py-8 space-y-8">
        {/* Header */}
        <div className="border-b border-[#2D241E]/15 pb-6 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-sans font-bold uppercase tracking-[0.25em] text-gold block mb-1">
              Store Management
            </span>
            <h1 className="font-heading text-4xl font-light text-molasses">Orders List</h1>
          </div>
          <span className="text-xs font-mono font-bold text-molasses/70 bg-[#F7F4EE] border border-[#2D241E]/20 px-4 py-2 rounded-none">
            Total Recorded: {orders.length}
          </span>
        </div>

        {/* Orders Interactive Table */}
        <OrdersTable initialOrders={orders} />
      </div>
    </div>
  )
}
