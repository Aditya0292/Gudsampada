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
  shipping_address: {
    line1: string
    city: string
    state: string
    pincode: string
  }
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

export default function OrdersTable({ initialOrders }: OrdersTableProps): React.JSX.Element {
  const [search, setSearch] = useState('')
  const [paymentFilter, setPaymentFilter] = useState<string>('all')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [sortBy, setSortBy] = useState<'date_desc' | 'date_asc' | 'total_desc' | 'total_asc'>('date_desc')
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 25

  // Filtering & Searching Logic
  const filteredOrders = useMemo(() => {
    return initialOrders.filter((order) => {
      // Search term check
      const query = search.toLowerCase().trim()
      const matchesSearch =
        !query ||
        order.order_number.toLowerCase().includes(query) ||
        order.customer_name.toLowerCase().includes(query) ||
        order.customer_phone.toLowerCase().includes(query)

      // Payment status check
      const matchesPayment = paymentFilter === 'all' || order.payment_status === paymentFilter

      // Order status check
      const matchesStatus = statusFilter === 'all' || order.order_status === statusFilter

      return matchesSearch && matchesPayment && matchesStatus
    })
  }, [initialOrders, search, paymentFilter, statusFilter])

  // Sorting Logic
  const sortedOrders = useMemo(() => {
    return [...filteredOrders].sort((a, b) => {
      if (sortBy === 'date_desc') return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      if (sortBy === 'date_asc') return new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      if (sortBy === 'total_desc') return Number(b.total) - Number(a.total)
      if (sortBy === 'total_asc') return Number(a.total) - Number(b.total)
      return 0
    })
  }, [filteredOrders, sortBy])

  // Pagination Logic
  const totalPages = Math.ceil(sortedOrders.length / pageSize) || 1
  const paginatedOrders = useMemo(() => {
    const start = (currentPage - 1) * pageSize
    return sortedOrders.slice(start, start + pageSize)
  }, [sortedOrders, currentPage, pageSize])

  return (
    <div className="space-y-6">
      {/* Search & Filter Toolbar */}
      <div className="bg-white border border-[#1C1C1A]/15 p-4 sm:p-6 rounded-none grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end shadow-sm">
        {/* Search */}
        <div>
          <label className="text-[9px] font-sans font-bold uppercase tracking-[0.2em] text-[#8C7A6B] block mb-1.5">
            Search Orders
          </label>
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              setCurrentPage(1)
            }}
            placeholder="Order #, Name, Phone..."
            className="w-full h-10 bg-[#F9F6F0] border border-[#1C1C1A]/20 px-3 text-xs font-sans text-[#1C1C1A] focus:outline-none focus:border-gold rounded-none"
          />
        </div>

        {/* Payment Filter */}
        <div>
          <label className="text-[9px] font-sans font-bold uppercase tracking-[0.2em] text-[#8C7A6B] block mb-1.5">
            Payment Status
          </label>
          <select
            value={paymentFilter}
            onChange={(e) => {
              setPaymentFilter(e.target.value)
              setCurrentPage(1)
            }}
            className="w-full h-10 bg-[#F9F6F0] border border-[#1C1C1A]/20 px-3 text-xs font-sans text-[#1C1C1A] focus:outline-none focus:border-gold rounded-none cursor-pointer"
          >
            <option value="all">All Payment Statuses</option>
            <option value="paid">Paid</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
            <option value="refunded">Refunded</option>
          </select>
        </div>

        {/* Order Status Filter */}
        <div>
          <label className="text-[9px] font-sans font-bold uppercase tracking-[0.2em] text-[#8C7A6B] block mb-1.5">
            Fulfillment Status
          </label>
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value)
              setCurrentPage(1)
            }}
            className="w-full h-10 bg-[#F9F6F0] border border-[#1C1C1A]/20 px-3 text-xs font-sans text-[#1C1C1A] focus:outline-none focus:border-gold rounded-none cursor-pointer"
          >
            <option value="all">All Order Statuses</option>
            <option value="placed">Placed</option>
            <option value="confirmed">Confirmed</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        {/* Sort By */}
        <div>
          <label className="text-[9px] font-sans font-bold uppercase tracking-[0.2em] text-[#8C7A6B] block mb-1.5">
            Sort Order
          </label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
            className="w-full h-10 bg-[#F9F6F0] border border-[#1C1C1A]/20 px-3 text-xs font-sans text-[#1C1C1A] focus:outline-none focus:border-gold rounded-none cursor-pointer"
          >
            <option value="date_desc">Date: Newest First</option>
            <option value="date_asc">Date: Oldest First</option>
            <option value="total_desc">Total Amount: High to Low</option>
            <option value="total_asc">Total Amount: Low to High</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white border border-[#1C1C1A]/15 rounded-none overflow-hidden shadow-sm">
        {paginatedOrders.length === 0 ? (
          <div className="p-8 sm:p-12 text-center text-molasses/60 space-y-2">
            <p className="font-serif text-base sm:text-lg">No matching orders found.</p>
            <p className="text-xs font-sans text-molasses/40">Try adjusting your search terms or status filters.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-sans min-w-[700px]">
              <thead>
                <tr className="border-b-2 border-[#1C1C1A] bg-[#1C1C1A] text-[#F9F6F0] text-[10px] uppercase tracking-wider">
                  <th className="py-3.5 px-4 font-bold">Order Reference</th>
                  <th className="py-3.5 px-4 font-bold">Customer Info</th>
                  <th className="py-3.5 px-4 font-bold">Items Count</th>
                  <th className="py-3.5 px-4 font-bold">Total</th>
                  <th className="py-3.5 px-4 font-bold">Payment</th>
                  <th className="py-3.5 px-4 font-bold">Fulfillment</th>
                  <th className="py-3.5 px-4 font-bold">Date</th>
                  <th className="py-3.5 px-4 font-bold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1C1C1A]/10">
                {paginatedOrders.map((order) => {
                  const itemCount = (order.items || []).reduce((acc, item) => acc + (item.qty || 1), 0)
                  return (
                    <tr key={order.id} className="hover:bg-[#F9F6F0] transition-colors">
                      <td className="py-4 px-4 font-mono font-bold text-[#1C1C1A]">
                        {order.order_number}
                      </td>
                      <td className="py-4 px-4">
                        <span className="font-bold text-[#1C1C1A] block">{order.customer_name}</span>
                        <span className="text-[11px] text-molasses/60 font-mono">{order.customer_phone}</span>
                      </td>
                      <td className="py-4 px-4 font-serif text-molasses">
                        {itemCount} {itemCount === 1 ? 'item' : 'items'}
                      </td>
                      <td className="py-4 px-4 font-mono font-bold text-[#1C1C1A]">
                        ₹{Number(order.total || 0).toLocaleString('en-IN')}
                      </td>
                      <td className="py-4 px-4">
                        <span
                          className={`inline-block text-[9px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-none ${
                            order.payment_status === 'paid'
                              ? 'bg-forest/15 text-forest border border-forest/30'
                              : order.payment_status === 'failed'
                              ? 'bg-terracotta/15 text-terracotta border border-terracotta/30'
                              : 'bg-gold/15 text-gold border border-gold/30'
                          }`}
                        >
                          {order.payment_status}
                        </span>
                      </td>
                      <td className="py-4 px-4 capitalize font-medium text-molasses">
                        {order.order_status}
                      </td>
                      <td className="py-4 px-4 text-molasses/60 text-[11px] whitespace-nowrap">
                        {new Date(order.created_at).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </td>
                      <td className="py-4 px-4 text-right">
                        <Link
                          href={`/admin/orders/${order.id}`}
                          className="inline-flex items-center justify-center bg-[#1C1C1A] hover:bg-gold text-white font-bold text-[11px] uppercase tracking-widest px-4 py-2 rounded-none transition-colors whitespace-nowrap"
                        >
                          Manage →
                        </Link>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Bar */}
        {totalPages > 1 && (
          <div className="px-4 sm:px-6 py-4 border-t border-[#1C1C1A]/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-sans">
            <span className="text-molasses/60 text-center sm:text-left">
              Showing {(currentPage - 1) * pageSize + 1}–
              {Math.min(currentPage * pageSize, sortedOrders.length)} of {sortedOrders.length} orders
            </span>
            <div className="flex space-x-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1.5 border border-[#1C1C1A]/20 text-molasses hover:border-[#1C1C1A] disabled:opacity-30 rounded-none cursor-pointer"
              >
                ← Prev
              </button>
              <span className="px-3 py-1.5 font-bold font-mono text-molasses">
                {currentPage} / {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1.5 border border-[#1C1C1A]/20 text-molasses hover:border-[#1C1C1A] disabled:opacity-30 rounded-none cursor-pointer"
              >
                Next →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
