import React from 'react'
import Link from 'next/link'
import { getSupabaseServerClient } from '@/lib/supabase/server'
import RevenueChart, { DailyChartData } from './RevenueChart'

const S = {
  bg: '#f9f4f1',
  border: '1px solid rgba(200,193,182,0.45)',
  label: { fontSize: '10px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase' as const, color: '#8a8880', fontFamily: 'Outfit, sans-serif' },
  value: { fontFamily: 'Playfair Display, serif', fontSize: '30px', fontWeight: 500, color: '#010100', lineHeight: 1.1 },
}

export default async function AdminDashboardPage({
  searchParams,
}: {
  searchParams?: Promise<{ range?: string; month?: string }>
}): Promise<React.JSX.Element> {
  const supabase = getSupabaseServerClient()
  const params = await searchParams
  const range = params?.range || (params?.month ? 'month' : '30d')
  const selectedMonth = params?.month || ''

  const [{ data: allOrders }, { data: enquiries }, { data: products }] = await Promise.all([
    (supabase.from('orders') as any).select('id, order_number, customer_name, total, payment_status, order_status, created_at').order('created_at', { ascending: false }),
    (supabase.from('b2b_enquiries') as any).select('id, status, created_at'),
    (supabase.from('products') as any).select('id, name, stock_250g, stock_500g'),
  ])

  const orders = (allOrders || []) as any[]
  const recentOrders = orders.slice(0, 8)

  const now = new Date()
  let startDate = new Date(0)
  let endDate = new Date()
  let isMonthView = false
  let year = now.getFullYear()
  let month = now.getMonth() + 1

  if (range === 'month' && selectedMonth) {
    const parts = selectedMonth.split('-')
    year = parseInt(parts[0], 10)
    month = parseInt(parts[1], 10)
    startDate = new Date(year, month - 1, 1)
    endDate = new Date(year, month, 0, 23, 59, 59, 999)
    isMonthView = true
  } else {
    if (range === '7d') startDate = new Date(now.getTime() - 7 * 86400000)
    else if (range === '30d') startDate = new Date(now.getTime() - 30 * 86400000)
    else if (range === '12m') startDate = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate())
  }

  const filteredOrders = orders.filter((o) => {
    const d = new Date(o.created_at)
    if (isMonthView) {
      return d >= startDate && d <= endDate
    }
    return d >= startDate
  })

  const paidOrders = filteredOrders.filter((o) => o.payment_status === 'paid')
  const totalRevenue = paidOrders.reduce((s, o) => s + Number(o.total || 0), 0)
  const newEnquiries = ((enquiries || []) as any[]).filter((e) => {
    const d = new Date(e.created_at)
    const matchesStatus = e.status === 'new'
    if (isMonthView) {
      return matchesStatus && d >= startDate && d <= endDate
    }
    return matchesStatus && d >= startDate
  }).length

  const lowStockCount = ((products || []) as any[]).filter((p) => (p.stock_250g ?? 100) < 10 || (p.stock_500g ?? 100) < 10).length

  // Chart data
  const chartData: DailyChartData[] = []
  if (isMonthView) {
    const daysInMonth = endDate.getDate()
    const monthLabel = startDate.toLocaleString('default', { month: 'short' })
    
    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(d).padStart(2, '0')}`
      const dayOrders = orders.filter((o) => o.created_at?.startsWith(dateStr))
      const dayPaid = dayOrders.filter((o: any) => o.payment_status === 'paid')
      const dayRev = dayPaid.reduce((s: number, o: any) => s + Number(o.total || 0), 0)
      
      chartData.push({
        date: `${d} ${monthLabel}`,
        revenue: dayRev,
        orders: dayOrders.length,
      })
    }
  } else if (range === '12m') {
    for (let i = 11; i >= 0; i--) {
      const d = new Date(); d.setMonth(d.getMonth() - i)
      const ms = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
      const label = d.toLocaleString('default', { month: 'short' })
      const mo = orders.filter((o) => o.created_at?.startsWith(ms))
      chartData.push({ date: label, revenue: mo.filter((o: any) => o.payment_status === 'paid').reduce((s: number, o: any) => s + Number(o.total || 0), 0), orders: mo.length })
    }
  } else {
    const days = range === '7d' ? 7 : 30
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date(); d.setDate(d.getDate() - i)
      const ds = d.toISOString().split('T')[0]
      const label = `${d.getDate()} ${d.toLocaleString('default', { month: 'short' })}`
      const do_ = orders.filter((o) => o.created_at?.startsWith(ds))
      chartData.push({ date: label, revenue: do_.filter((o: any) => o.payment_status === 'paid').reduce((s: number, o: any) => s + Number(o.total || 0), 0), orders: do_.length })
    }
  }

  const paymentColor = (s: string) => s === 'paid' ? '#2E7D32' : s === 'failed' ? '#ba1a1a' : '#b56a00'

  return (
    <div style={{ background: S.bg, minHeight: '100vh', fontFamily: 'Outfit, sans-serif' }}>
      <div className="px-4 sm:px-8 lg:px-12 py-8 md:py-12">

        {/* Page Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-10">
          <div>
            <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: '36px', fontWeight: 500, color: '#010100', margin: 0, lineHeight: 1.2 }}>
              Dashboard
            </h1>
            <p style={{ fontSize: '14px', color: '#8a8880', marginTop: '6px' }}>
              Welcome back. Here&apos;s what&apos;s happening today.
            </p>
          </div>
          <Link href="/admin/products/new" style={{
            display: 'inline-flex', alignItems: 'center', gap: '6px',
            border: '1px solid #1c1b1a', padding: '8px 18px',
            fontSize: '11px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase',
            color: '#1c1b1a', textDecoration: 'none', fontFamily: 'Outfit, sans-serif',
          }}>
            + Add Product
          </Link>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Revenue', value: `₹${totalRevenue.toLocaleString('en-IN')}`, sub: `${paidOrders.length} paid orders` },
            { label: 'Total Orders', value: filteredOrders.length, sub: `${filteredOrders.filter((o: any) => o.payment_status === 'pending').length} pending` },
            { label: 'B2B Requests', value: newEnquiries, sub: <Link href="/admin/enquiries" style={{ color: '#c9a96e', textDecoration: 'none', fontSize: '11px' }}>Review Enquiries →</Link> },
            { label: 'Low Stock', value: lowStockCount, valueColor: lowStockCount > 0 ? '#ba1a1a' : '#010100', sub: <Link href="/admin/products" style={{ color: '#c9a96e', textDecoration: 'none', fontSize: '11px' }}>Manage Catalog →</Link> },
          ].map((card, i) => (
            <div key={i} style={{ border: S.border, background: '#fff', padding: '24px 22px' }}>
              <p style={S.label}>{card.label}</p>
              <p style={{ ...S.value, color: (card as any).valueColor || '#010100', marginTop: '12px', marginBottom: '8px' }}>{card.value}</p>
              <p style={{ fontSize: '12px', color: '#8a8880' }}>{card.sub}</p>
            </div>
          ))}
        </div>

        {/* Chart */}
        <div style={{ marginBottom: '40px' }}>
          <RevenueChart data={chartData} />
        </div>

        {/* Recent Orders */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '20px' }}>
            <div>
              <p style={S.label}>Recent Store Activity</p>
              <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: '22px', fontWeight: 500, color: '#010100', marginTop: '4px' }}>
                Recent Orders
              </h3>
            </div>
            <Link href="/admin/orders" style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#010100', textDecoration: 'none' }}>
              View All Orders →
            </Link>
          </div>

          {recentOrders.length === 0 ? (
            <p style={{ color: '#8a8880', fontSize: '14px', padding: '48px 0', textAlign: 'center' }}>No orders yet.</p>
          ) : (
            <div className="overflow-x-auto w-full -mx-4 px-4 sm:mx-0 sm:px-0">
              <div style={{ minWidth: '650px' }}>
              {/* Table Header */}
              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 2fr 1fr 1fr 1fr auto', gap: '0', borderBottom: '2px solid #1c1b1a', paddingBottom: '10px', marginBottom: '0' }}>
                {['Order #', 'Customer', 'Total', 'Payment', 'Status', ''].map((h) => (
                  <span key={h} style={{ ...S.label, paddingRight: '12px' }}>{h}</span>
                ))}
              </div>
              {recentOrders.map((order: any) => (
                <div key={order.id} style={{ display: 'grid', gridTemplateColumns: '1.2fr 2fr 1fr 1fr 1fr auto', gap: '0', borderBottom: '1px solid rgba(200,193,182,0.35)', padding: '18px 0', alignItems: 'center' }}>
                  <span style={{ fontFamily: 'monospace', fontWeight: 700, fontSize: '13px', color: '#010100' }}>{order.order_number}</span>
                  <span style={{ fontSize: '14px', color: '#010100', fontWeight: 500 }}>{order.customer_name}</span>
                  <span style={{ fontFamily: 'monospace', fontWeight: 700, fontSize: '13px', color: '#010100' }}>₹{Number(order.total || 0).toLocaleString('en-IN')}</span>
                  <span style={{ fontSize: '12px', fontWeight: 600, color: paymentColor(order.payment_status), textTransform: 'capitalize' }}>
                    {order.payment_status}
                  </span>
                  <span style={{ fontSize: '12px', color: '#8a8880', textTransform: 'capitalize' }}>{order.order_status}</span>
                  <Link href={`/admin/orders/${order.id}`} style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#010100', textDecoration: 'none' }}>
                    Details →
                  </Link>
                </div>
              ))}
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  )
}
