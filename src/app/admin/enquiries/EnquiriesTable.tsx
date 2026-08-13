'use client'

import React, { useState, useMemo } from 'react'
import { createClient } from '@/lib/supabase/client'

export interface B2BEnquiry {
  id: string
  enquiry_type: string
  contact_name: string
  company_name?: string | null
  phone: string
  email?: string | null
  city: string
  message: string
  estimated_quantity?: string | null
  estimated_monthly_qty?: string | null
  status: 'new' | 'contacted' | 'closed'
  created_at: string
}

interface EnquiriesTableProps {
  initialEnquiries: B2BEnquiry[]
}

export default function EnquiriesTable({ initialEnquiries }: EnquiriesTableProps): React.JSX.Element {
  const [enquiries, setEnquiries] = useState<B2BEnquiry[]>(initialEnquiries)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [typeFilter, setTypeFilter] = useState<string>('all')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [updatingId, setUpdatingId] = useState<string | null>(null)

  const filteredEnquiries = useMemo(() => {
    return enquiries.filter((e) => {
      const matchesType = typeFilter === 'all' || e.enquiry_type === typeFilter
      const matchesStatus = statusFilter === 'all' || e.status === statusFilter
      return matchesType && matchesStatus
    })
  }, [enquiries, typeFilter, statusFilter])

  const handleUpdateStatus = async (id: string, newStatus: B2BEnquiry['status']) => {
    setUpdatingId(id)
    try {
      const supabase = createClient()
      const { error } = await (supabase.from('b2b_enquiries') as any).update({ status: newStatus }).eq('id', id)
      if (error) throw new Error(error.message)
      setEnquiries((prev) => prev.map((item) => (item.id === id ? { ...item, status: newStatus } : item)))
    } catch {
      alert('Failed to update enquiry status.')
    } finally {
      setUpdatingId(null)
    }
  }

  const handleCopyContact = (e: React.MouseEvent, enquiry: B2BEnquiry) => {
    e.stopPropagation()
    const info = `Name: ${enquiry.contact_name}\nCompany: ${enquiry.company_name || 'N/A'}\nPhone: ${enquiry.phone}\nEmail: ${enquiry.email || 'N/A'}\nCity: ${enquiry.city}`
    navigator.clipboard.writeText(info)
    setCopiedId(enquiry.id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id)
  }

  const statusPill = (status: string) => {
    if (status === 'new') return 'bg-[#FFF8E1] text-[#b56a00] border-[#b56a00]/20'
    if (status === 'contacted') return 'bg-[#E8F5E9] text-[#2E7D32] border-[#2E7D32]/20'
    return 'bg-[#e5e2e1] text-[#474741] border-[#c8c7bf]'
  }

  return (
    <div className="space-y-5" style={{ fontFamily: 'Outfit, sans-serif' }}>
      {/* Toolbar Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}
          className="border border-[#c8c7bf]/60 bg-[#fdf8f7] px-4 py-2.5 text-xs font-semibold text-[#474741] focus:outline-none focus:border-[#735c00] cursor-pointer rounded-none flex-1">
          <option value="all">All Enquiry Types ▾</option>
          <option value="distributor">Distributor / Retail</option>
          <option value="corporate_gifting">Corporate Gifting</option>
          <option value="white_label">White Label / Private Label</option>
          <option value="bulk_raw">Bulk Raw Jaggery</option>
        </select>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
          className="border border-[#c8c7bf]/60 bg-[#fdf8f7] px-4 py-2.5 text-xs font-semibold text-[#474741] focus:outline-none focus:border-[#735c00] cursor-pointer rounded-none flex-1">
          <option value="all">All Statuses ▾</option>
          <option value="new">New (Uncontacted)</option>
          <option value="contacted">Contacted</option>
          <option value="closed">Closed / Concluded</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white border border-[#c8c7bf]/30 rounded-none overflow-hidden shadow-sm">
        {filteredEnquiries.length === 0 ? (
          <div className="p-12 text-center text-[#474741]">
            <p className="text-base font-medium">No B2B enquiries match your filter criteria.</p>
            <p className="text-xs mt-1 text-[#777771]">Try adjusting your filters to see more results.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm min-w-[600px]">
              <thead className="bg-[#f7f3f2] border-b border-[#c8c7bf]/30">
                <tr className="text-[11px] font-bold uppercase tracking-wider text-[#474741]">
                  <th className="py-4 px-5">Type</th>
                  <th className="py-4 px-5">Contact</th>
                  <th className="py-4 px-5">City</th>
                  <th className="py-4 px-5">Status</th>
                  <th className="py-4 px-5">Date</th>
                  <th className="py-4 px-5 text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredEnquiries.map((enquiry) => (
                  <React.Fragment key={enquiry.id}>
                    <tr
                      className="border-t border-[#c8c7bf]/15 hover:bg-[#f7f3f2]/60 transition-colors cursor-pointer"
                      onClick={() => toggleExpand(enquiry.id)}
                    >
                      <td className="py-5 px-5">
                        <span className="text-[11px] border border-[#c8c7bf]/60 px-2.5 py-1 rounded-none text-[#474741] font-semibold capitalize">
                          {enquiry.enquiry_type?.replace(/_/g, ' ') || 'General'}
                        </span>
                      </td>
                      <td className="py-5 px-5">
                        <span className="font-semibold text-[#010100] block">{enquiry.contact_name}</span>
                        {enquiry.company_name && <span className="text-xs text-[#474741]">{enquiry.company_name}</span>}
                        <span className="text-xs font-mono text-[#474741] block mt-0.5">{enquiry.phone}</span>
                      </td>
                      <td className="py-5 px-5 text-[#474741] capitalize">{enquiry.city}</td>
                      <td className="py-5 px-5">
                        <select
                          value={enquiry.status}
                          onChange={(e) => { e.stopPropagation(); handleUpdateStatus(enquiry.id, e.target.value as B2BEnquiry['status']) }}
                          onClick={(e) => e.stopPropagation()}
                          disabled={updatingId === enquiry.id}
                          className={`text-[11px] font-semibold px-2.5 py-1 rounded-none border cursor-pointer focus:outline-none ${statusPill(enquiry.status)}`}
                        >
                          <option value="new">New</option>
                          <option value="contacted">Contacted</option>
                          <option value="closed">Closed</option>
                        </select>
                      </td>
                      <td className="py-5 px-5 text-xs text-[#474741] whitespace-nowrap">
                        {new Date(enquiry.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </td>
                      <td className="py-5 px-5 text-right">
                        <svg className={`inline-block text-[#474741] transition-transform duration-200 ${expandedId === enquiry.id ? 'rotate-180' : ''}`}
                          width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="m6 9 6 6 6-6"/>
                        </svg>
                      </td>
                    </tr>

                    {expandedId === enquiry.id && (
                      <tr>
                        <td colSpan={6} className="p-0">
                          <div className="bg-[#f7f3f2] border-l-4 border-[#010100] px-8 py-6">
                            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#474741] mb-4">Full Message & Order Requirement</p>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-4">
                              <div>
                                <p className="text-[10px] font-bold uppercase text-[#474741] mb-1">Email Address</p>
                                <p className="text-sm text-[#010100]">{enquiry.email || '—'}</p>
                              </div>
                              <div>
                                <p className="text-[10px] font-bold uppercase text-[#474741] mb-1">Est. Quantity / Volume</p>
                                <p className="text-sm font-bold text-[#010100]">{enquiry.estimated_quantity || enquiry.estimated_monthly_qty || '—'}</p>
                              </div>
                              <div>
                                <p className="text-[10px] font-bold uppercase text-[#474741] mb-1">Submitted Date</p>
                                <p className="text-sm text-[#010100]">{new Date(enquiry.created_at).toLocaleString('en-IN')}</p>
                              </div>
                            </div>
                            <div className="mb-5">
                              <p className="text-[10px] font-bold uppercase text-[#474741] mb-2">Detailed Inquiry Message</p>
                              <p className="text-sm italic text-[#474741] bg-white border border-[#c8c7bf]/40 p-4 rounded-none">
                                &ldquo;{enquiry.message}&rdquo;
                              </p>
                            </div>
                            <div className="flex items-center gap-3 flex-wrap">
                              <button onClick={(e) => handleCopyContact(e, enquiry)}
                                className="text-[11px] font-bold uppercase tracking-wider text-[#474741] border border-[#c8c7bf]/60 px-4 py-2 rounded-none hover:border-[#1c1c1a] transition-colors">
                                {copiedId === enquiry.id ? 'Copied! ✓' : 'Copy Contact'}
                              </button>
                              <a href={`tel:${enquiry.phone}`}
                                className="inline-flex items-center gap-2 bg-[#2E7D32] text-white text-[11px] font-bold uppercase tracking-wider px-4 py-2 rounded-none hover:bg-[#1B5E20] transition-colors">
                                📞 Call {enquiry.phone}
                              </a>
                              {enquiry.email && (
                                <a href={`mailto:${enquiry.email}`}
                                  className="inline-flex items-center gap-2 bg-[#1c1c1a] text-white text-[11px] font-bold uppercase tracking-wider px-4 py-2 rounded-none hover:bg-[#735c00] transition-colors">
                                  ✉ Email Contact
                                </a>
                              )}
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
