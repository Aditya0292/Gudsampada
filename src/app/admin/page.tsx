import React from 'react'
import Link from 'next/link'
import { getSupabaseServerClient } from '@/lib/supabase/server'
import RevenueChart, { DailyChartData } from './RevenueChart'

export default async function AdminDashboardPage({
  searchParams,
}: {
  searchParams?: Promise<{ range?: string }>
}): Promise<React.JSX.Element> {
  const supabase = getSupabaseServerClient()
  const params = await searchParams
  const range = params?.range || '30d'

  // Fetch all dashboard data in parallel to significantly speed up rendering
  const [
    { data: allOrders },
    { data: enquiries },
    { data: products }
  ] = await Promise.all([
    (supabase.from('orders') as any)
      .select('id, order_number, customer_name, total, payment_status, order_status, created_at')
      .order('created_at', { ascending: false }),
    (supabase.from('b2b_enquiries') as any)
      .select('id, status'),
    (supabase.from('products') as any)
      .select('id, name, stock_250g, stock_500g, is_active')
  ])

  const orders = (allOrders || []) as Array<{
    id: string
    order_number: string
    customer_name: string
    total: number
    payment_status: string
    order_status: string
    created_at: string
  }>
  const recentOrders = orders.slice(0, 10)

  // Calculate Metrics
  const paidOrders = orders.filter((o) => o.payment_status === 'paid')
  const pendingOrders = orders.filter((o) => o.payment_status === 'pending')
  
  const totalRevenueAllTime = paidOrders.reduce((sum, o) => sum + Number(o.total || 0), 0)

  // This month revenue
  const now = new Date()
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).getTime()
  const paidOrdersThisMonth = paidOrders.filter((o) => new Date(o.created_at).getTime() >= startOfMonth)
  const totalRevenueThisMonth = paidOrdersThisMonth.reduce((sum, o) => sum + Number(o.total || 0), 0)

  const pendingEnquiriesCount = ((enquiries || []) as Array<{ id: string; status: string }>).filter(
    (e) => e.status === 'new'
  ).length

  const lowStockProducts = ((products || []) as Array<{
    id: string
    name: string
    stock_250g: number | null
    stock_500g: number | null
    is_active: boolean
  }>).filter((p) => (p.stock_250g ?? 100) < 10 || (p.stock_500g ?? 100) < 10)

  // Generate Chart Data based on range
  const chartData: DailyChartData[] = []
  
  if (range === '12m') {
    // Yearly view (Last 12 months)
    for (let i = 11; i >= 0; i--) {
      const d = new Date()
      d.setMonth(d.getMonth() - i)
      const monthStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
      const monthLabel = d.toLocaleString('default', { month: 'short' })

      const monthOrders = orders.filter((o) => o.created_at?.startsWith(monthStr))
      const monthPaidOrders = monthOrders.filter((o) => o.payment_status === 'paid')
      const monthRevenue = monthPaidOrders.reduce((sum, o) => sum + Number(o.total || 0), 0)

      chartData.push({
        date: monthLabel,
        revenue: monthRevenue,
        orders: monthOrders.length,
      })
    }
  } else {
    // Daily view (7d or 30d)
    const days = range === '7d' ? 7 : 30
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date()
      d.setDate(d.getDate() - i)
      const dateStr = d.toISOString().split('T')[0]
      const dayLabel = `${d.getDate()} ${d.toLocaleString('default', { month: 'short' })}`

      const dayOrders = orders.filter((o) => o.created_at?.startsWith(dateStr))
      const dayPaidOrders = dayOrders.filter((o) => o.payment_status === 'paid')
      const dayRevenue = dayPaidOrders.reduce((sum, o) => sum + Number(o.total || 0), 0)

      chartData.push({
        date: dayLabel,
        revenue: dayRevenue,
        orders: dayOrders.length,
      })
    }
  }

  return (
    <div className="w-full bg-[#F4F1EA] min-h-screen">
      <div className="w-full px-4 sm:px-6 md:px-10 lg:px-12 py-6 sm:py-8 space-y-6 sm:space-y-8">
        {/* Top Action Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#1C1C1A]/15 pb-4 sm:pb-6 gap-4">
          <div>
            <span className="text-[10px] sm:text-[11px] font-sans font-bold uppercase tracking-[0.25em] text-gold block mb-1">
              Overview & Analytics
            </span>
            <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1C1C1A]">
              Dashboard
            </h1>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-5 w-full sm:w-auto">
            <Link
              href="/admin/products/new"
              className="inline-flex items-center justify-center bg-[#1C1C1A] hover:bg-gold text-white hover:text-[#1C1C1A] text-xs font-sans font-bold uppercase tracking-[0.18em] px-5 py-3.5 rounded-none transition-all shadow-sm whitespace-nowrap w-full sm:w-auto"
            >
              + Add Product
            </Link>
            <Link
              href="/admin/orders"
              className="inline-flex items-center justify-center border-2 border-[#1C1C1A] hover:bg-[#1C1C1A] text-[#1C1C1A] hover:text-white text-xs font-sans font-bold uppercase tracking-[0.18em] px-5 py-3.5 rounded-none transition-all whitespace-nowrap w-full sm:w-auto"
            >
              All Orders →
            </Link>
          </div>
        </div>

        {/* Low Stock Warning Banner */}
        {lowStockProducts.length > 0 && (
          <div className="p-4 sm:p-5 bg-terracotta/10 border border-terracotta/40 text-terracotta text-xs font-sans rounded-none flex flex-col sm:flex-row items-start gap-3 sm:gap-4 shadow-sm">
            <span className="text-xl">⚠️</span>
            <div>
              <p className="font-bold uppercase tracking-[0.15em] text-sm mb-1">Low Stock Warning</p>
              <p className="text-molasses/80 font-medium">
                The following products have stock below 10 units:{' '}
                {lowStockProducts.map((p) => `${p.name} (250g: ${p.stock_250g}, 500g: ${p.stock_500g})`).join(', ')}.
              </p>
            </div>
          </div>
        )}

        {/* Strict Zero-Curve KPI Cards (Centered 4 Column Grid) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1: Total Revenue */}
          <div className="bg-white border border-[#1C1C1A]/15 p-6 lg:p-8 rounded-none shadow-sm flex flex-col justify-between space-y-4 hover:border-[#1C1C1A]/40 transition-colors">
            <div>
              <span className="text-[10px] font-sans font-bold uppercase tracking-[0.22em] text-[#8C7A6B] block mb-2">
                Total Revenue (Paid)
              </span>
              <div className="font-heading text-3xl lg:text-4xl font-bold tabular-nums text-[#1C1C1A]">
                ₹{totalRevenueAllTime.toLocaleString('en-IN')}
              </div>
            </div>
            <div className="pt-4 border-t border-[#1C1C1A]/10 flex justify-between items-center text-xs font-sans">
              <span className="text-[#8C7A6B]">This Month:</span>
              <span className="font-bold text-gold font-mono text-sm">₹{totalRevenueThisMonth.toLocaleString('en-IN')}</span>
            </div>
          </div>

          {/* Card 2: Total Orders */}
          <div className="bg-white border border-[#1C1C1A]/15 p-6 lg:p-8 rounded-none shadow-sm flex flex-col justify-between space-y-4 hover:border-[#1C1C1A]/40 transition-colors">
            <div>
              <span className="text-[10px] font-sans font-bold uppercase tracking-[0.22em] text-[#8C7A6B] block mb-2">
                Total Orders Count
              </span>
              <div className="font-heading text-3xl lg:text-4xl font-bold tabular-nums text-[#1C1C1A]">
                {orders.length}
              </div>
            </div>
            <div className="pt-4 border-t border-[#1C1C1A]/10 flex justify-between items-center text-xs font-sans">
              <span className="text-[#8C7A6B]">Paid: <strong className="text-forest font-mono text-sm">{paidOrders.length}</strong></span>
              <span className="text-[#8C7A6B]">Pending: <strong className="text-terracotta font-mono text-sm">{pendingOrders.length}</strong></span>
            </div>
          </div>

          {/* Card 3: Pending B2B Enquiries */}
          <div className="bg-white border border-[#1C1C1A]/15 p-6 lg:p-8 rounded-none shadow-sm flex flex-col justify-between space-y-4 hover:border-[#1C1C1A]/40 transition-colors">
            <div>
              <span className="text-[10px] font-sans font-bold uppercase tracking-[0.22em] text-[#8C7A6B] block mb-2">
                Pending B2B Requests
              </span>
              <div className="font-heading text-3xl lg:text-4xl font-bold tabular-nums text-[#1C1C1A]">
                {pendingEnquiriesCount}
              </div>
            </div>
            <Link
              href="/admin/enquiries"
              className="text-xs font-sans font-bold uppercase tracking-[0.15em] text-gold hover:text-[#1C1C1A] block pt-4 border-t border-[#1C1C1A]/10 transition-colors"
            >
              Review B2B Requests →
            </Link>
          </div>

          {/* Card 4: Low Stock Items */}
          <div className="bg-white border border-[#1C1C1A]/15 p-6 lg:p-8 rounded-none shadow-sm flex flex-col justify-between space-y-4 hover:border-[#1C1C1A]/40 transition-colors">
            <div>
              <span className="text-[10px] font-sans font-bold uppercase tracking-[0.22em] text-[#8C7A6B] block mb-2">
                Low Stock Alert Items
              </span>
              <div className={`font-heading text-3xl lg:text-4xl font-bold tabular-nums ${lowStockProducts.length > 0 ? 'text-terracotta' : 'text-forest'}`}>
                {lowStockProducts.length}
              </div>
            </div>
            <Link
              href="/admin/products"
              className="text-xs font-sans font-bold uppercase tracking-[0.15em] text-gold hover:text-[#1C1C1A] block pt-4 border-t border-[#1C1C1A]/10 transition-colors"
            >
              Manage Catalog →
            </Link>
          </div>
        </div>

        {/* Performance Chart */}
        <RevenueChart data={chartData} />

        {/* Polished Data Table (Recent Orders) */}
        <div className="bg-white border border-[#1C1C1A]/15 p-6 lg:p-8 rounded-none shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-[#1C1C1A]/15 pb-4">
            <div>
              <span className="text-[11px] font-sans font-bold uppercase tracking-[0.2em] text-[#8C7A6B] block mb-1">
                Recent Store Activity
              </span>
              <h3 className="font-heading text-2xl font-bold text-[#1C1C1A]">Recent Orders (Last 10)</h3>
            </div>
            <Link href="/admin/orders" className="text-xs font-sans font-bold uppercase tracking-[0.2em] text-gold hover:underline">
              View All Orders →
            </Link>
          </div>

          {recentOrders.length === 0 ? (
            <p className="text-sm font-serif text-molasses/50 text-center py-10">
              No orders recorded yet. Orders will appear here automatically when placed.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left text-sm font-sans">
                <thead>
                  <tr className="border-b-2 border-[#1C1C1A]">
                    <th className="py-3 px-4 uppercase text-[11px] font-bold tracking-[0.2em] text-[#8C7A6B] text-left">Order #</th>
                    <th className="py-3 px-4 uppercase text-[11px] font-bold tracking-[0.2em] text-[#8C7A6B] text-left">Customer</th>
                    <th className="py-3 px-4 uppercase text-[11px] font-bold tracking-[0.2em] text-[#8C7A6B] text-left">Total</th>
                    <th className="py-3 px-4 uppercase text-[11px] font-bold tracking-[0.2em] text-[#8C7A6B] text-left">Payment</th>
                    <th className="py-3 px-4 uppercase text-[11px] font-bold tracking-[0.2em] text-[#8C7A6B] text-left">Status</th>
                    <th className="py-3 px-4 uppercase text-[11px] font-bold tracking-[0.2em] text-[#8C7A6B] text-left">Date</th>
                    <th className="py-3 px-4 uppercase text-[11px] font-bold tracking-[0.2em] text-[#8C7A6B] text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1C1C1A]/10">
                  {recentOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-[#F9F6F0] transition-colors">
                      <td className="py-4 px-4 font-mono font-bold text-[#1C1C1A]">
                        {order.order_number}
                      </td>
                      <td className="py-4 px-4 font-medium text-[#1C1C1A]">
                        {order.customer_name}
                      </td>
                      <td className="py-4 px-4 font-mono font-bold text-[#1C1C1A]">
                        ₹{Number(order.total || 0).toLocaleString('en-IN')}
                      </td>
                      <td className="py-4 px-4">
                        <span
                          className={`rounded-none text-xs px-3 py-1 inline-block font-bold tracking-wider uppercase ${
                            order.payment_status === 'paid'
                              ? 'bg-forest/15 text-forest border border-forest/30'
                              : order.payment_status === 'failed'
                              ? 'bg-terracotta/15 text-terracotta border border-terracotta/30'
                              : 'bg-gold/15 text-[#8B5A2B] border border-gold/40'
                          }`}
                        >
                          {order.payment_status}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-molasses/80 font-medium capitalize">
                        {order.order_status}
                      </td>
                      <td className="py-4 px-4 text-molasses/60 text-xs font-mono">
                        {new Date(order.created_at).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </td>
                      <td className="py-4 px-4 text-right">
                        <Link
                          href={`/admin/orders/${order.id}`}
                          className="text-gold font-bold hover:underline"
                        >
                          Details →
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
