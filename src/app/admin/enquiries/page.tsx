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
    <div style={{ background: '#f9f4f1', minHeight: '100vh', fontFamily: 'Outfit, sans-serif' }}>
      <div className="px-4 sm:px-8 lg:px-12 py-8 md:py-12">

        {/* Header */}
        <div className="mb-10 pb-6 border-b border-[rgba(200,193,182,0.45)]">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: '34px', fontWeight: 500, color: '#010100', margin: 0 }}>
              Partnership Enquiries
            </h1>
            <span 
              style={{ 
                padding: '6px 20px', 
                letterSpacing: '0.15em', 
                border: '1px solid #010100', 
                display: 'inline-flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                fontFamily: 'Outfit, sans-serif',
                fontSize: '10px',
                fontWeight: 700,
                textTransform: 'uppercase',
                color: '#010100',
                backgroundColor: 'transparent'
              }}
              className="w-fit self-start sm:self-center"
            >
              {enquiries.length} {enquiries.length === 1 ? 'Total Lead' : 'Total Leads'}
            </span>
          </div>
          <p style={{ fontSize: '14px', color: '#8a8880', marginTop: '8px', margin: '8px 0 0' }}>
            B2B, institutional and bulk order leads.
          </p>
        </div>

        <EnquiriesTable initialEnquiries={enquiries} />
      </div>
    </div>
  )
}
