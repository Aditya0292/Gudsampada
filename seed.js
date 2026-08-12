const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://psrkbwpxkeljyalvitla.supabase.co'
const supabaseKey = process.env.SUPABASE_SECRET_KEY || ''

const supabase = createClient(supabaseUrl, supabaseKey)

const products = [
  {
    id: 'prod_002',
    name: 'Ginger Jaggery Powder',
    slug: 'ginger-jaggery-powder',
    description: 'Made from the authentic taste of naturally flavorful jaggery crafted from cane and quality ingredients.',
    price_250g: 149,
    price_500g: 269,
    stock_250g: 100,
    stock_500g: 100,
    image_url: '/images/aaa-removebg-preview.png',
    is_active: true
  },
  {
    id: 'prod_003',
    name: 'Paan Jaggery Bites',
    slug: 'paan-jaggery-bites',
    description: 'Experience the authentic taste of naturally flavored jaggery crafted with care and quality ingredients.',
    price_250g: 149,
    price_500g: 149,
    stock_250g: 100,
    stock_500g: 100,
    image_url: '/images/paan-jaggery-bites.png',
    is_active: true
  }
]

async function seed() {
  console.log('Seeding products...')
  for (const product of products) {
    const { data, error } = await supabase
      .from('products')
      .upsert(product)

    if (error) {
      console.error('Error inserting', product.name, error)
    } else {
      console.log('Inserted', product.name)
    }
  }
  console.log('Done!')
}

seed()
