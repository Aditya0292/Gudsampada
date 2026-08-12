import { getSupabaseServerClient } from '@/lib/supabase/server'

const SHIPROCKET_BASE_URL = 'https://apiv2.shiprocket.in/v1/external'

export interface ShiprocketOrderItem {
  name: string
  sku: string
  units: number
  selling_price: number
  discount: number
  tax: number
  hsn: string
}

export interface ShiprocketCreateOrderPayload {
  order_id: string
  order_date: string
  pickup_location: string
  billing_customer_name: string
  billing_last_name?: string
  billing_address: string
  billing_city: string
  billing_pincode: string
  billing_state: string
  billing_country: string
  billing_email: string
  billing_phone: string
  shipping_is_billing: boolean
  order_items: ShiprocketOrderItem[]
  payment_method: 'Prepaid' | 'COD'
  shipping_charges: number
  sub_total: number
  length: number
  breadth: number
  height: number
  weight: number // Total weight in kg
}

export async function getShiprocketToken(): Promise<string> {
  const email = process.env.SHIPROCKET_EMAIL
  const password = process.env.SHIPROCKET_PASSWORD

  if (!email || !password) {
    throw new Error('Shiprocket credentials (SHIPROCKET_EMAIL & SHIPROCKET_PASSWORD) are not configured in environment variables.')
  }

  const supabase = getSupabaseServerClient()

  // 1. Check cached token in DB
  const { data: cachedAuth } = await (supabase.from('shiprocket_auth') as any)
    .select('*')
    .eq('id', 1)
    .single()

  const now = new Date()
  if (cachedAuth && new Date(cachedAuth.expires_at) > now) {
    return cachedAuth.token
  }

  // 2. Fetch fresh token from Shiprocket API
  console.log('[ShiprocketClient] Requesting fresh auth token from Shiprocket API...')
  const response = await fetch(`${SHIPROCKET_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })

  if (!response.ok) {
    const errText = await response.text()
    throw new Error(`Shiprocket Auth Failed (${response.status}): ${errText}`)
  }

  const data = await response.json()
  const token = data.token

  // Shiprocket tokens are valid for ~10 days. Set expiry 9 days from now.
  const expiresAt = new Date(Date.now() + 9 * 24 * 60 * 60 * 1000).toISOString()

  // 3. Cache token in DB
  await (supabase.from('shiprocket_auth') as any).upsert({
    id: 1,
    token,
    expires_at: expiresAt,
  })

  return token
}

export async function createShiprocketOrder(payload: ShiprocketCreateOrderPayload) {
  const token = await getShiprocketToken()

  console.log(`[ShiprocketClient] Creating shipment order for Order #${payload.order_id}...`)
  const response = await fetch(`${SHIPROCKET_BASE_URL}/orders/create/adhoc`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  })

  const responseText = await response.text()
  let result: any
  try {
    result = JSON.parse(responseText)
  } catch {
    throw new Error(`Shiprocket order creation returned invalid JSON: ${responseText}`)
  }

  if (!response.ok || (result.status_code && result.status_code !== 1 && !result.order_id)) {
    const errorMsg = result.message || result.errors || responseText
    throw new Error(`Shiprocket Order Creation Error: ${typeof errorMsg === 'object' ? JSON.stringify(errorMsg) : errorMsg}`)
  }

  return {
    shiprocket_order_id: String(result.order_id),
    shipment_id: String(result.shipment_id),
    awb_code: result.awb_code || null,
    courier_name: result.courier_name || null,
    status: result.status || 'NEW',
  }
}

export async function generateShiprocketAWB(shipmentId: string) {
  const token = await getShiprocketToken()

  console.log(`[ShiprocketClient] Assigning AWB for Shipment #${shipmentId}...`)
  const response = await fetch(`${SHIPROCKET_BASE_URL}/courier/assign/awb`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ shipment_id: shipmentId }),
  })

  const result = await response.json()
  if (!response.ok || result.status !== 200) {
    throw new Error(`Shiprocket AWB Assignment Error: ${JSON.stringify(result)}`)
  }

  return {
    awb_code: result.response?.data?.awb_code,
    courier_name: result.response?.data?.courier_name,
  }
}

export async function trackShiprocketShipment(awbNumber: string) {
  const token = await getShiprocketToken()

  const response = await fetch(`${SHIPROCKET_BASE_URL}/courier/track/awb/${awbNumber}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  const result = await response.json()
  return result.tracking_data || null
}
