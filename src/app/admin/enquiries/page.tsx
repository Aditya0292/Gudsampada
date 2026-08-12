import React from 'react'
import { getSupabaseServerClient } from '@/lib/supabase/server'
import EnquiriesTable, { B2BEnquiry } from './EnquiriesTable'

export default async function AdminEnquiriesPage(): Promise<React.JSX.Element> {
  const supabase = getSupabaseServerClient()

  const { data: rawEnquiries } = await (supabase.from('b2b_enquiries') as any)
    .select('*')
    .order('created_at', { ascending: false })

  const enquiries = (rawEnquiries || []) as B2BEnquiry[]

  return (
    <div className="w-full bg-[#F4F1EA] min-h-screen">
      <div className="w-full px-6 md:px-10 lg:px-12 py-8 space-y-8">
        {/* Header */}
        <div className="border-b border-[#2D241E]/15 pb-6 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-sans font-bold uppercase tracking-[0.25em] text-gold block mb-1">
              B2B & Institutional
            </span>
            <h1 className="font-heading text-4xl font-light text-molasses">Partnership Enquiries</h1>
          </div>
          <span className="text-xs font-mono font-bold text-molasses/70 bg-[#F7F4EE] border border-[#2D241E]/20 px-4 py-2 rounded-none">
            Total Leads: {enquiries.length}
          </span>
        </div>

        {/* Interactive Enquiries Table */}
        <EnquiriesTable initialEnquiries={enquiries} />
      </div>
    </div>
  )
}
