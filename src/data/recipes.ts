export interface Recipe {
  id: string
  title: string
  slug: string
  description: string
  prepTime: string
  servings: string
  image: string
  relatedProductSlug: string
  relatedProductName: string
  ingredients: string[]
  instructions: string[]
}

export const recipes: Recipe[] = [
  {
    id: '1',
    title: 'Kolhapuri Ginger Jaggery Kadha',
    slug: 'ginger-jaggery-kadha',
    description: 'A traditional immunity-boosting herbal brew crafted with sun-dried ginger jaggery powder, tulsi, and black pepper.',
    prepTime: '10 mins',
    servings: '2 cups',
    image: '/images/turmeric-jaggery-latte.png',
    relatedProductSlug: 'ginger-jaggery-powder',
    relatedProductName: 'Ginger Jaggery Powder',
    ingredients: [
      '2 tsp GudSampada Ginger Jaggery Powder',
      '2 cups Water',
      '5-6 fresh Tulsi leaves',
      '1/4 tsp Crushed Black Pepper',
      '1 small Cinnamon stick',
    ],
    instructions: [
      'Boil water with tulsi, cinnamon, and black pepper for 5 minutes.',
      'Turn off heat and stir in 2 tsp GudSampada Ginger Jaggery Powder.',
      'Strain into cups and serve warm.',
    ],
  },
  {
    id: '2',
    title: 'Betel Leaf Jaggery Paan Shots',
    slug: 'paan-jaggery-shots',
    description: 'Refresher digestif shot blending organic betel leaf jaggery bites with chilled coconut milk.',
    prepTime: '5 mins',
    servings: '4 shots',
    image: '/images/paan-jaggery-bites.png',
    relatedProductSlug: 'paan-jaggery-bites',
    relatedProductName: 'Paan Jaggery Bites',
    ingredients: [
      '4 GudSampada Paan Jaggery Bites',
      '1 cup Chilled Coconut Milk or Milk',
      '1/2 tsp Fennel seeds (Saunf)',
      'Crushed ice',
    ],
    instructions: [
      'Blend Paan Jaggery Bites with coconut milk and fennel seeds until smooth.',
      'Pour over crushed ice into shot glasses and serve chilled.',
    ],
  },
]
