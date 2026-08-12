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

  // Filtered Enquiries
  const filteredEnquiries = useMemo(() => {
    return enquiries.filter((e) => {
      const matchesType = typeFilter === 'all' || e.enquiry_type === typeFilter
      const matchesStatus = statusFilter === 'all' || e.status === statusFilter
      return matchesType && matchesStatus
    })
  }, [enquiries, typeFilter, statusFilter])

  // Update Status in Supabase
  const handleUpdateStatus = async (id: string, newStatus: B2BEnquiry['status']) => {
    setUpdatingId(id)
    try {
      const supabase = createClient()
      const { error } = await (supabase.from('b2b_enquiries') as any)
        .update({ status: newStatus })
        .eq('id', id)

      if (error) throw new Error(error.message)

      setEnquiries((prev) =>
        prev.map((item) => (item.id === id ? { ...item, status: newStatus } : item))
      )
    } catch (err) {
      alert('Failed to update enquiry status.')
    } finally {
      setUpdatingId(null)
    }
  }

  // Copy Contact Info Action
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

  return (
    <div className="space-y-6">
      {/* Toolbar Filters */}
      <div className="bg-white border border-[#1C1C1A]/15 p-4 sm:p-6 rounded-none grid grid-cols-1 sm:grid-cols-2 gap-4 shadow-sm">
        {/* Enquiry Type Filter */}
        <div>
          <label className="text-[9px] font-sans font-bold uppercase tracking-[0.2em] text-[#8C7A6B] block mb-1.5">
            Filter by Enquiry Type
          </label>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="w-full h-10 bg-[#F9F6F0] border border-[#1C1C1A]/20 px-3 text-xs font-sans text-[#1C1C1A] focus:outline-none focus:border-gold rounded-none cursor-pointer"
          >
            <option value="all">All Enquiry Types</option>
            <option value="distributor">Distributor / Retail</option>
            <option value="corporate_gifting">Corporate Gifting</option>
            <option value="white_label">White Label / Private Label</option>
            <option value="bulk_raw">Bulk Raw Jaggery</option>
          </select>
        </div>

        {/* Status Filter */}
        <div>
          <label className="text-[9px] font-sans font-bold uppercase tracking-[0.2em] text-[#8C7A6B] block mb-1.5">
            Filter by Status
          </label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full h-10 bg-[#F9F6F0] border border-[#1C1C1A]/20 px-3 text-xs font-sans text-[#1C1C1A] focus:outline-none focus:border-gold rounded-none cursor-pointer"
          >
            <option value="all">All Statuses</option>
            <option value="new">New (Uncontacted)</option>
            <option value="contacted">Contacted</option>
            <option value="closed">Closed / Concluded</option>
          </select>
        </div>
      </div>

      {/* Table & Inline Expansion View */}
      <div className="bg-white border border-[#1C1C1A]/15 rounded-none overflow-hidden shadow-sm">
        {filteredEnquiries.length === 0 ? (
          <div className="p-8 sm:p-12 text-center text-molasses/60 space-y-2">
            <p className="font-serif text-base sm:text-lg">No B2B enquiries match your filter criteria.</p>
            <p className="text-xs font-sans text-molasses/40">New lead submissions from the B2B form will appear here.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-sans min-w-[700px]">
              <thead>
                <tr className="border-b-2 border-[#1C1C1A] bg-[#1C1C1A] text-[#F9F6F0] text-[10px] uppercase tracking-wider">
                  <th className="py-3.5 px-4 font-bold">Type</th>
                  <th className="py-3.5 px-4 font-bold">Contact / Company</th>
                  <th className="py-3.5 px-4 font-bold">Phone</th>
                  <th className="py-3.5 px-4 font-bold">City</th>
                  <th className="py-3.5 px-4 font-bold">Status</th>
                  <th className="py-3.5 px-4 font-bold">Date</th>
                  <th className="py-3.5 px-4 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1C1C1A]/10">
                {filteredEnquiries.map((enquiry) => {
                  const isExpanded = expandedId === enquiry.id
                  return (
                    <React.Fragment key={enquiry.id}>
                      {/* Main Table Row */}
                      <tr
                        onClick={() => toggleExpand(enquiry.id)}
                        className={`hover:bg-[#F9F6F0] cursor-pointer transition-colors ${
                          isExpanded ? 'bg-[#F9F6F0] font-medium' : ''
                        }`}
                      >
                        <td className="py-4 px-4 font-bold text-gold uppercase text-[10px] tracking-wider">
                          {enquiry.enquiry_type.replace('_', ' ')}
                        </td>
                        <td className="py-4 px-4">
                          <span className="font-bold text-[#1C1C1A] block text-sm">{enquiry.contact_name}</span>
                          {enquiry.company_name && (
                            <span className="text-[11px] text-molasses/60 font-serif block">{enquiry.company_name}</span>
                          )}
                        </td>
                        <td className="py-4 px-4 font-mono font-bold text-[#1C1C1A]">
                          {enquiry.phone}
                        </td>
                        <td className="py-4 px-4 text-[#1C1C1A]">
                          {enquiry.city}
                        </td>
                        <td className="py-4 px-4" onClick={(e) => e.stopPropagation()}>
                          <select
                            value={enquiry.status}
                            disabled={updatingId === enquiry.id}
                            onChange={(e) => handleUpdateStatus(enquiry.id, e.target.value as B2BEnquiry['status'])}
                            className={`text-[9px] font-bold uppercase tracking-wider px-2 py-1 border rounded-none cursor-pointer focus:outline-none ${
                              enquiry.status === 'new'
                                ? 'bg-terracotta/15 text-terracotta border-terracotta/30'
                                : enquiry.status === 'contacted'
                                ? 'bg-gold/15 text-[#8B5A2B] border-gold/40'
                                : 'bg-forest/15 text-forest border-forest/30'
                            }`}
                          >
                            <option value="new">New</option>
                            <option value="contacted">Contacted</option>
                            <option value="closed">Closed</option>
                          </select>
                        </td>
                        <td className="py-4 px-4 text-molasses/60 text-[11px]">
                          {new Date(enquiry.created_at).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </td>
                        <td className="py-4 px-4 text-right space-x-2">
                          <button
                            onClick={(e) => handleCopyContact(e, enquiry)}
                            className="bg-[#1C1C1A] hover:bg-gold text-white font-bold text-[9px] uppercase tracking-wider px-2.5 py-1.5 rounded-none transition-colors"
                          >
                            {copiedId === enquiry.id ? 'Copied! ✓' : 'Copy Contact'}
                          </button>
                          <button
                            onClick={() => toggleExpand(enquiry.id)}
                            className="border border-[#1C1C1A]/30 text-[#1C1C1A] font-bold text-[9px] uppercase tracking-wider px-2.5 py-1.5 rounded-none"
                          >
                            {isExpanded ? 'Hide ▲' : 'Details ▼'}
                          </button>
                        </td>
                      </tr>

                      {/* Inline Expanded Detail Drawer */}
                      {isExpanded && (
                        <tr className="bg-[#F9F6F0] border-b border-[#1C1C1A]/20">
                          <td colSpan={7} className="p-4 sm:p-6 space-y-4">
                            <div className="bg-white border border-[#1C1C1A]/15 p-4 rounded-none space-y-3 shadow-sm">
                              <h4 className="font-bold text-xs uppercase tracking-wider text-gold border-b border-[#1C1C1A]/10 pb-2">
                                Full Message & Order Requirement
                              </h4>

                              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-sans">
                                <div>
                                  <span className="text-molasses/50 uppercase text-[9px] font-bold block">Email Address</span>
                                  <span className="font-mono text-[#1C1C1A]">{enquiry.email || 'Not provided'}</span>
                                </div>
                                <div>
                                  <span className="text-molasses/50 uppercase text-[9px] font-bold block">Est. Quantity / Volume</span>
                                  <span className="font-bold text-[#1C1C1A]">{enquiry.estimated_quantity || enquiry.estimated_monthly_qty || 'N/A'}</span>
                                </div>
                                <div>
                                  <span className="text-molasses/50 uppercase text-[9px] font-bold block">Submitted Date</span>
                                  <span className="font-mono text-[#1C1C1A]">
                                    {new Date(enquiry.created_at).toLocaleString('en-IN')}
                                  </span>
                                </div>
                              </div>

                              <div className="pt-2 border-t border-[#1C1C1A]/10">
                                <span className="text-molasses/50 uppercase text-[9px] font-bold block mb-1">Detailed Inquiry Message</span>
                                <p className="font-serif italic text-sm text-[#1C1C1A] bg-[#F9F6F0] p-3 border border-[#1C1C1A]/10 leading-relaxed whitespace-pre-wrap">
                                  "{enquiry.message}"
                                </p>
                              </div>

                              <div className="pt-2 flex flex-wrap justify-end gap-2 text-xs">
                                <a
                                  href={`tel:${enquiry.phone}`}
                                  className="bg-forest text-white font-bold px-3 py-1.5 text-[10px] uppercase tracking-wider rounded-none inline-flex items-center space-x-1"
                                >
                                  <span>📞 Call {enquiry.phone}</span>
                                </a>
                                {enquiry.email && (
                                  <a
                                    href={`mailto:${enquiry.email}`}
                                    className="bg-[#1C1C1A] text-white font-bold px-3 py-1.5 text-[10px] uppercase tracking-wider rounded-none inline-flex items-center space-x-1"
                                  >
                                    <span>✉️ Email Contact</span>
                                  </a>
                                )}
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
