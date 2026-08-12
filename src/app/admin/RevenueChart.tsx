'use client'

import React from 'react'
import {
  ResponsiveContainer,
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts'

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
  const currentRange = searchParams.get('range') || '30d'

  const handleRangeChange = (range: string) => {
    router.push(`?range=${range}`, { scroll: false })
  }

  const getTitle = () => {
    if (currentRange === '7d') return '7-Day Revenue & Orders Trend'
    if (currentRange === '12m') return '12-Month Revenue & Orders Trend'
    return '30-Day Revenue & Orders Trend'
  }

  return (
    <div className="w-full bg-white border border-[#1C1C1A]/15 p-4 sm:p-6 lg:p-8 rounded-none shadow-sm space-y-4 sm:space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-[#1C1C1A]/15 pb-4 gap-4">
        <div>
          <span className="text-[10px] font-sans font-bold uppercase tracking-[0.2em] text-[#8C7A6B] block mb-1">
            {getTitle()}
          </span>
          <h3 className="font-heading text-xl sm:text-2xl font-bold text-[#1C1C1A]">Performance Chart</h3>
        </div>
        
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
          {/* Filters */}
          <div className="flex items-center gap-1.5 bg-[#F9F6F0] border border-[#1C1C1A]/20 p-1.5 rounded-sm">
            <button
              onClick={() => handleRangeChange('7d')}
              className={`px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.1em] transition-all rounded-sm ${
                currentRange === '7d' ? 'bg-[#1C1C1A] text-white shadow-sm' : 'text-molasses/60 hover:text-[#1C1C1A] hover:bg-black/5'
              }`}
            >
              7 Days
            </button>
            <button
              onClick={() => handleRangeChange('30d')}
              className={`px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.1em] transition-all rounded-sm ${
                currentRange === '30d' ? 'bg-[#1C1C1A] text-white shadow-sm' : 'text-molasses/60 hover:text-[#1C1C1A] hover:bg-black/5'
              }`}
            >
              30 Days
            </button>
            <button
              onClick={() => handleRangeChange('12m')}
              className={`px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.1em] transition-all rounded-sm ${
                currentRange === '12m' ? 'bg-[#1C1C1A] text-white shadow-sm' : 'text-molasses/60 hover:text-[#1C1C1A] hover:bg-black/5'
              }`}
            >
              12 Months
            </button>
          </div>

          {/* Legend */}
          <div className="flex items-center gap-4 text-xs font-sans">
            <span className="flex items-center gap-2">
              <span className="w-3 h-3 bg-[#8C7A6B] inline-block" />
              <span className="text-[#1C1C1A] font-medium">Revenue (₹)</span>
            </span>
            <span className="flex items-center gap-2">
              <span className="w-3.5 h-1 bg-[#1C1C1A] inline-block" />
              <span className="text-[#1C1C1A] font-medium">Orders</span>
            </span>
          </div>
        </div>
      </div>

      <div className="w-full h-[220px] sm:h-[280px] md:h-[340px]">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 10, right: 0, left: -15, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1C1C1A" strokeOpacity={0.06} vertical={false} />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 9, fill: '#1C1C1A', opacity: 0.7 }}
              axisLine={{ stroke: '#1C1C1A', strokeOpacity: 0.15 }}
              tickLine={false}
              interval="preserveStartEnd"
              minTickGap={15}
            />
            <YAxis
              yAxisId="left"
              tick={{ fontSize: 9, fill: '#1C1C1A', opacity: 0.7 }}
              axisLine={{ stroke: '#1C1C1A', strokeOpacity: 0.15 }}
              tickLine={false}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              tick={{ fontSize: 9, fill: '#1C1C1A', opacity: 0.7 }}
              axisLine={{ stroke: '#1C1C1A', strokeOpacity: 0.15 }}
              tickLine={false}
            />
            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-[#1C1C1A] text-[#F9F6F0] p-3 text-xs font-sans shadow-lg border border-gold/40 rounded-none space-y-1">
                      <p className="font-bold text-gold border-b border-white/10 pb-1 mb-1">{label}</p>
                      <p>Revenue: <span className="font-mono font-bold">₹{Number(payload[0]?.value || 0).toLocaleString('en-IN')}</span></p>
                      <p>Orders: <span className="font-mono font-bold">{payload[1]?.value || 0}</span></p>
                    </div>
                  )
                }
                return null
              }}
            />
            <Bar yAxisId="left" dataKey="revenue" fill="#8C7A6B" radius={[0, 0, 0, 0]} maxBarSize={28} />
            <Line yAxisId="right" type="monotone" dataKey="orders" stroke="#1C1C1A" strokeWidth={2.5} dot={false} />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
