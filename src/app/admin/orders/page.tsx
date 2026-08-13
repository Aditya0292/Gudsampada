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
    <div style={{ background: '#f9f4f1', minHeight: '100vh', fontFamily: 'Outfit, sans-serif' }}>
      <div className="px-4 sm:px-8 lg:px-12 py-8 md:py-12">

        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-10 pb-6 border-b border-[rgba(200,193,182,0.45)]">
          <div>
            <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: '34px', fontWeight: 500, color: '#010100', margin: 0 }}>
              Orders List
            </h1>
            <p style={{ fontSize: '14px', color: '#8a8880', marginTop: '6px', margin: '6px 0 0' }}>
              Manage and track customer purchases.
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {/* Search */}
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <svg style={{ position: 'absolute', left: '8px', color: '#8a8880' }} width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
              <input
                type="text"
                placeholder="Search orders..."
                readOnly
                style={{ paddingLeft: '28px', paddingRight: '12px', height: '36px', border: '1px solid rgba(200,193,182,0.6)', background: '#fff', fontSize: '12px', color: '#010100', fontFamily: 'Outfit, sans-serif', outline: 'none', width: '180px' }}
              />
            </div>
          </div>
        </div>

        <OrdersTable initialOrders={orders} />
      </div>
    </div>
  )
}
