import { NextResponse } from 'next/server'
import { getSupabaseServerClient } from '@/lib/supabase/server'
import { B2BEnquiryPayload } from '@/types/db'

// Simple IP-based rate limiting map (max 5 requests per 15 minutes per IP)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>()

export async function POST(request: Request): Promise<NextResponse> {
  try {
    // 1. Rate Limiting Check
    const clientIp = request.headers.get('x-forwarded-for') || '127.0.0.1'
    const now = Date.now()
    const rateLimit = rateLimitMap.get(clientIp)

    if (rateLimit && now < rateLimit.resetTime) {
      if (rateLimit.count >= 5) {
        return NextResponse.json({ error: 'Too many enquiry submissions. Please try again later.' }, { status: 429 })
      }
      rateLimit.count += 1
    } else {
      rateLimitMap.set(clientIp, { count: 1, resetTime: now + 15 * 60 * 1000 })
    }

    // 2. Input Parsing & Validation
    const body: B2BEnquiryPayload = await request.json()

    if (!body.company_name || !body.contact_name || !body.phone || !body.city || !body.enquiry_type) {
      return NextResponse.json({ error: 'Please fill in all required fields.' }, { status: 400 })
    }

    const cleanPhone = body.phone.trim()
    if (cleanPhone.length < 10) {
      return NextResponse.json({ error: 'Please provide a valid 10-digit phone number.' }, { status: 400 })
    }

    // 3. Database Insertion
    const supabase = getSupabaseServerClient()
    const { error: dbError } = await (supabase.from('b2b_enquiries') as any).insert({
      enquiry_type: body.enquiry_type,
      company_name: body.company_name.trim(),
      contact_name: body.contact_name.trim(),
      phone: cleanPhone,
      email: body.email?.trim() || null,
      city: body.city.trim(),
      estimated_quantity: body.estimated_quantity?.trim() || null,
      message: body.message?.trim() || null,
      status: 'new',
    })

    if (dbError) {
      console.warn('Supabase DB B2B Insert Warning:', dbError.message)
    }

    return NextResponse.json({
      success: true,
      message: "Thank you for reaching out to GudSampada. Our B2B partnership team will contact you within 24 hours.",
    })
  } catch (error: unknown) {
    console.error('B2B Enquiry Error:', error)
    const errMsg = error instanceof Error ? error.message : 'Failed to submit B2B enquiry'
    return NextResponse.json({ error: errMsg }, { status: 500 })
  }
}
