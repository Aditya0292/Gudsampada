'use client'

import React from 'react'
import { ResponsiveContainer, ComposedChart, Bar, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts'
import { useRouter, useSearchParams } from 'next/navigation'

export interface DailyChartData {
  date: string
  revenue: number
  orders: number
}

interface RevenueChartProps {
  data: DailyChartData[]
}

export default function RevenueChart({ data }: RevenueChartProps): React.JSX.Element {
  const router = useRouter()
  const searchParams = useSearchParams()
  const currentRange = searchParams.get('range') || (searchParams.get('month') ? 'month' : '30d')
  const currentMonthValue = searchParams.get('month') || ''

  const handleRangeChange = (range: string) => {
    router.push(`?range=${range}`, { scroll: false })
  }

  const handleMonthChange = (monthValue: string) => {
    if (monthValue) {
      router.push(`?range=month&month=${monthValue}`, { scroll: false })
    } else {
      router.push(`?range=30d`, { scroll: false })
    }
  }

  const ranges = [
    { key: '7d', label: '7 Days' },
    { key: '30d', label: '30 Days' },
    { key: '12m', label: '12 Months' },
  ]

  const isMonthActive = currentRange === 'month'

  return (
    <div style={{ border: '1px solid rgba(200,193,182,0.5)', background: '#fff', padding: '32px 36px' }}>
      {/* Header row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
        <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: '22px', fontWeight: 500, color: '#010100', margin: 0 }}>
          Revenue &amp; Orders Trend
        </h3>

        {/* Range switcher & Month Picker */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0' }}>
            {ranges.map((r, i) => (
              <button
                key={r.key}
                onClick={() => handleRangeChange(r.key)}
                style={{
                  padding: '6px 18px',
                  fontSize: '11px',
                  fontWeight: 600,
                  letterSpacing: '0.06em',
                  fontFamily: 'Outfit, sans-serif',
                  textTransform: 'uppercase',
                  background: currentRange === r.key ? '#1c1b1a' : 'transparent',
                  color: currentRange === r.key ? '#fff' : '#8a8880',
                  border: '1px solid rgba(200,193,182,0.6)',
                  borderRight: i < ranges.length - 1 ? 'none' : '1px solid rgba(200,193,182,0.6)',
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                }}
              >
                {r.label}
              </button>
            ))}
          </div>

          {/* Custom Month Picker */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ fontSize: '11px', fontWeight: 600, color: '#8a8880', fontFamily: 'Outfit, sans-serif', textTransform: 'uppercase', letterSpacing: '0.04em' }}>or select month:</span>
            <input
              type="month"
              value={currentMonthValue}
              onChange={(e) => handleMonthChange(e.target.value)}
              style={{
                padding: '5px 12px',
                fontSize: '11px',
                fontWeight: 600,
                fontFamily: 'Outfit, sans-serif',
                background: isMonthActive ? 'rgba(201,169,110,0.08)' : 'transparent',
                color: '#010100',
                border: isMonthActive ? '1.5px solid #1c1b1a' : '1px solid rgba(200,193,182,0.6)',
                cursor: 'pointer',
                outline: 'none',
                height: '29.5px',
                boxSizing: 'border-box',
                borderRadius: 0,
              }}
            />
          </div>
        </div>
      </div>

      {/* Chart */}
      <div style={{ width: '100%', height: '280px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 4, right: 0, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1C1C1A" strokeOpacity={0.05} vertical={false} />
            <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#8a8880' }} axisLine={false} tickLine={false} interval="preserveStartEnd" minTickGap={20} />
            <YAxis yAxisId="left" tick={{ fontSize: 10, fill: '#8a8880' }} axisLine={false} tickLine={false} />
            <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 10, fill: '#8a8880' }} axisLine={false} tickLine={false} />
            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  return (
                    <div style={{ background: '#1c1b1a', color: '#f5f0ef', padding: '10px 14px', fontSize: '12px', fontFamily: 'Outfit, sans-serif' }}>
                      <p style={{ fontWeight: 700, marginBottom: '4px', color: '#c9a96e' }}>{label}</p>
                      <p>Revenue: <strong>₹{Number(payload[0]?.value || 0).toLocaleString('en-IN')}</strong></p>
                      <p>Orders: <strong>{payload[1]?.value || 0}</strong></p>
                    </div>
                  )
                }
                return null
              }}
            />
            <Bar yAxisId="left" dataKey="revenue" fill="#c9a96e" fillOpacity={0.7} maxBarSize={24} />
            <Line yAxisId="right" type="monotone" dataKey="orders" stroke="#1c1b1a" strokeWidth={2} dot={false} />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div style={{ display: 'flex', gap: '24px', marginTop: '16px', paddingTop: '16px', borderTop: '1px solid rgba(200,193,182,0.3)' }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px', color: '#8a8880', fontFamily: 'Outfit, sans-serif' }}>
          <span style={{ width: '12px', height: '12px', background: '#c9a96e', opacity: 0.7, display: 'inline-block' }} />
          Revenue (₹)
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px', color: '#8a8880', fontFamily: 'Outfit, sans-serif' }}>
          <span style={{ width: '16px', height: '2px', background: '#1c1b1a', display: 'inline-block' }} />
          Orders
        </span>
      </div>
    </div>
  )
}
