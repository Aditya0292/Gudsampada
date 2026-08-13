'use client'

import React, { useState, useMemo } from 'react'
import Link from 'next/link'

export interface OrderItem {
  id?: string
  name: string
  size?: string
  qty: number
  price: number
}

export interface AdminOrder {
  id: string
  order_number: string
  customer_name: string
  customer_phone: string
  customer_email?: string | null
  shipping_address: { line1: string; city: string; state: string; pincode: string }
  items: OrderItem[]
  subtotal: number
  shipping_fee: number
  total: number
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded'
  order_status: 'placed' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled'
  razorpay_order_id?: string | null
  razorpay_payment_id?: string | null
  checkout_method?: string | null
  tracking_number?: string | null
  email_sent?: boolean
  email_sent_at?: string | null
  shiprocket_order_id?: string | null
  shiprocket_shipment_id?: string | null
  awb_number?: string | null
  courier_name?: string | null
  tracking_url?: string | null
  shipment_status?: string | null
  created_at: string
}

interface OrdersTableProps {
  initialOrders: AdminOrder[]
}

const S = {
  label: { fontSize: '10px', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase' as const, color: '#8a8880', fontFamily: 'Outfit, sans-serif' },
}

const paymentColor = (s: string) => {
  if (s === 'paid') return '#2E7D32'
  if (s === 'failed') return '#ba1a1a'
  if (s === 'refunded') return '#6a1b9a'
  return '#b56a00'
}

export default function OrdersTable({ initialOrders }: OrdersTableProps): React.JSX.Element {
  const [search, setSearch] = useState('')
  const [paymentFilter, setPaymentFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [sortBy, setSortBy] = useState<'date_desc' | 'date_asc' | 'total_desc' | 'total_asc'>('date_desc')
  const [currentPage, setCurrentPage] = useState(1)
  const [openMenuId, setOpenMenuId] = useState<string | null>(null)
  const pageSize = 25

  const filteredOrders = useMemo(() => {
    return initialOrders.filter((o) => {
      const q = search.toLowerCase()
      const matchSearch = !q || o.order_number.toLowerCase().includes(q) || o.customer_name.toLowerCase().includes(q) || o.customer_phone.includes(q)
      const matchPayment = paymentFilter === 'all' || o.payment_status === paymentFilter
      const matchStatus = statusFilter === 'all' || o.order_status === statusFilter
      return matchSearch && matchPayment && matchStatus
    })
  }, [initialOrders, search, paymentFilter, statusFilter])

  const sorted = useMemo(() => {
    return [...filteredOrders].sort((a, b) => {
      if (sortBy === 'date_desc') return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      if (sortBy === 'date_asc') return new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      if (sortBy === 'total_desc') return Number(b.total) - Number(a.total)
      return Number(a.total) - Number(b.total)
    })
  }, [filteredOrders, sortBy])

  const totalPages = Math.ceil(sorted.length / pageSize) || 1
  const paginated = useMemo(() => sorted.slice((currentPage - 1) * pageSize, currentPage * pageSize), [sorted, currentPage])

  return (
    <div style={{ fontFamily: 'Outfit, sans-serif' }}>
      {/* Filters row */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '28px', flexWrap: 'wrap', alignItems: 'center' }}>
        <select value={paymentFilter} onChange={(e) => { setPaymentFilter(e.target.value); setCurrentPage(1) }}
          style={{ border: 'none', borderBottom: '1px solid rgba(200,193,182,0.8)', background: 'transparent', padding: '6px 0', fontSize: '12px', color: '#474741', cursor: 'pointer', fontFamily: 'Outfit, sans-serif' }}>
          <option value="all">All Payment Statuses</option>
          <option value="paid">Paid</option>
          <option value="pending">Pending</option>
          <option value="failed">Failed</option>
          <option value="refunded">Refunded</option>
        </select>
        <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1) }}
          style={{ border: 'none', borderBottom: '1px solid rgba(200,193,182,0.8)', background: 'transparent', padding: '6px 0', fontSize: '12px', color: '#474741', cursor: 'pointer', fontFamily: 'Outfit, sans-serif' }}>
          <option value="all">All Fulfillment Statuses</option>
          <option value="placed">Placed</option>
          <option value="confirmed">Confirmed</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
          style={{ border: 'none', borderBottom: '1px solid rgba(200,193,182,0.8)', background: 'transparent', padding: '6px 0', fontSize: '12px', color: '#474741', cursor: 'pointer', fontFamily: 'Outfit, sans-serif' }}>
          <option value="date_desc">Newest First</option>
          <option value="date_asc">Oldest First</option>
          <option value="total_desc">Total: High → Low</option>
          <option value="total_asc">Total: Low → High</option>
        </select>
        <span style={{ marginLeft: 'auto', fontSize: '12px', color: '#8a8880' }}>
          {sorted.length} order{sorted.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Table header & rows scroll container */}
      <div className="overflow-x-auto w-full -mx-4 px-4 sm:mx-0 sm:px-0">
        <div style={{ minWidth: '700px' }}>
          {/* Table header */}
          <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 2fr 1fr 1fr 1fr 60px', borderBottom: '2px solid #1c1b1a', paddingBottom: '12px' }}>
            {['Order Ref', 'Customer Info', 'Total', 'Payment', 'Fulfillment', 'Actions'].map((h) => (
              <span key={h} style={S.label}>{h}</span>
            ))}
          </div>

          {/* Rows */}
          {paginated.length === 0 ? (
            <div style={{ padding: '72px 0', textAlign: 'center', color: '#8a8880', fontSize: '14px' }}>
              No orders match your filters.
            </div>
          ) : (
            paginated.map((order) => (
              <div
                key={order.id}
                style={{ display: 'grid', gridTemplateColumns: '1.4fr 2fr 1fr 1fr 1fr 60px', borderBottom: '1px solid rgba(200,193,182,0.35)', padding: '22px 0', alignItems: 'center', position: 'relative' }}
                onClick={() => setOpenMenuId(null)}
              >
                <span style={{ fontFamily: 'monospace', fontWeight: 700, fontSize: '13px', color: '#010100' }}>
                  {order.order_number}
                </span>
                <div>
                  <span style={{ fontSize: '14px', fontWeight: 600, color: '#c9a96e', display: 'block' }}>{order.customer_name}</span>
                  <span style={{ fontSize: '12px', color: '#8a8880', fontFamily: 'monospace' }}>{order.customer_phone}</span>
                </div>
                <span style={{ fontFamily: 'monospace', fontWeight: 700, fontSize: '13px', color: '#010100' }}>
                  ₹{Number(order.total || 0).toLocaleString('en-IN')}
                </span>
                <span style={{ fontSize: '12px', fontWeight: 600, color: paymentColor(order.payment_status), textTransform: 'capitalize' }}>
                  {order.payment_status}
                </span>
                <span style={{ fontSize: '12px', color: '#8a8880', textTransform: 'capitalize' }}>
                  {order.order_status}
                </span>
                {/* Three-dot action menu */}
                <div style={{ position: 'relative' }} onClick={(e) => e.stopPropagation()}>
                  <button
                    onClick={() => setOpenMenuId(openMenuId === order.id ? null : order.id)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '20px', color: '#8a8880', padding: '0 8px', lineHeight: 1 }}
                  >
                    ⋮
                  </button>
                  {openMenuId === order.id && (
                    <div style={{ position: 'absolute', right: 0, top: '100%', background: '#fff', border: '1px solid rgba(200,193,182,0.6)', zIndex: 50, minWidth: '140px', boxShadow: '0 4px 16px rgba(0,0,0,0.08)' }}>
                      <Link href={`/admin/orders/${order.id}`}
                        style={{ display: 'block', padding: '12px 16px', fontSize: '12px', fontWeight: 600, color: '#010100', textDecoration: 'none', borderBottom: '1px solid rgba(200,193,182,0.3)' }}
                        onClick={() => setOpenMenuId(null)}>
                        View Details
                      </Link>
                      <Link href={`/admin/orders/${order.id}`}
                        style={{ display: 'block', padding: '12px 16px', fontSize: '12px', fontWeight: 600, color: '#010100', textDecoration: 'none' }}
                        onClick={() => setOpenMenuId(null)}>
                        Manage Order
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '24px', fontSize: '12px', color: '#8a8880' }}>
          <span>Showing {(currentPage - 1) * pageSize + 1}–{Math.min(currentPage * pageSize, sorted.length)} of {sorted.length}</span>
          <div style={{ display: 'flex', gap: '4px' }}>
            <button disabled={currentPage === 1} onClick={() => setCurrentPage((p) => p - 1)}
              style={{ padding: '6px 14px', border: '1px solid rgba(200,193,182,0.6)', background: 'transparent', cursor: 'pointer', fontSize: '12px', color: '#474741' }}>
              ← Prev
            </button>
            <button disabled={currentPage === totalPages} onClick={() => setCurrentPage((p) => p + 1)}
              style={{ padding: '6px 14px', border: '1px solid rgba(200,193,182,0.6)', background: 'transparent', cursor: 'pointer', fontSize: '12px', color: '#474741' }}>
              Next →
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
