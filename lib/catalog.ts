export type Category = 'photo-gifts' | 'business-printing' | 'clothing' | 'stationery'

export type Product = {
  slug: string
  name: string
  category: Category
  categoryLabel: string
  price: number
  originalPrice?: number
  rating: number
  reviews: number
  image: string
  gallery: string[]
  description: string
  badge?: string
  options: string[]
  material: string
  popular?: boolean
}

const images = {
  cards: '/products/business-cards.png',
  stationery: '/products/thank-you-cards.png',
  clothing: '/products/tote-bag.png',
  mug: '/products/photo-mug.png',
  frame: '/products/gallery-wall-print.png',
  stickers: '/products/die-cut-stickers.png',
  packaging: '/products/branded-mailer-boxes.png',
  invite: '/products/custom-invitations.png',
}

export const products: Product[] = [
  ...[
    ['modern-business-cards', 'Modern Business Cards', 299, images.cards, 'Best seller'],
    ['custom-flyers', 'Custom Flyers', 399, '/products/business-printing-flyers.png', 'Popular'],
    [
      'folded-brochures',
      'Folded Brochures',
      549,
      '/products/business-printing-brochures.png',
      undefined,
    ],
    ['event-posters', 'Event Posters', 649, '/products/business-printing-posters.png', 'New'],
    [
      'display-banners',
      'Display Banners',
      1299,
      '/products/business-printing-banners.png',
      undefined,
    ],
    ['product-labels', 'Product Labels', 449, '/products/business-printing-labels.png', undefined],
    [
      'branded-letterheads',
      'Branded Letterheads',
      499,
      '/products/business-printing-letterheads.png',
      undefined,
    ],
    [
      'custom-packaging',
      'Custom Packaging',
      899,
      '/products/business-printing-packaging.png',
      'Trending',
    ],
  ].map(([slug, name, price, image, badge]) => ({
    slug: slug as string,
    name: name as string,
    category: 'business-printing' as const,
    categoryLabel: 'Business Printing',
    price: price as number,
    rating: 4.8,
    reviews: 120,
    image: image as string,
    gallery: [image as string],
    description: 'Professional printed products designed to help your business stand out.',
    badge: badge as string | undefined,
    options: ['Standard', 'Premium', 'Recycled'],
    material: 'Premium printed stock',
  })),
  {
    slug: 'classic-business-cards',
    name: 'Classic Business Cards',
    category: 'business-printing',
    categoryLabel: 'Business Printing',
    price: 399,
    originalPrice: 499,
    rating: 4.9,
    reviews: 842,
    image: images.cards,
    gallery: [images.cards, images.stickers, images.packaging],
    description:
      'Make every introduction count with premium, tactile business cards printed in vivid colour.',
    badge: 'Bestseller',
    options: ['350 GSM Matte', '350 GSM Gloss', 'Recycled Kraft'],
    material: '350 GSM premium cardstock',
    popular: true,
  },
  {
    slug: 'custom-photo-mug',
    name: 'Custom Photo Mug',
    category: 'photo-gifts',
    categoryLabel: 'Photo Gifts',
    price: 299,
    rating: 4.8,
    reviews: 562,
    image: images.mug,
    gallery: [images.mug, images.frame, images.cards],
    description:
      'Your favourite memory, now part of every morning. Dishwasher-safe ceramic with a glossy finish.',
    badge: 'Most loved',
    options: ['11 oz White', 'Magic Colour Change', 'Travel Tumbler'],
    material: 'Gloss ceramic',
    popular: true,
  },
  {
    slug: 'everyday-tote-bag',
    name: 'Everyday Tote Bag',
    category: 'clothing',
    categoryLabel: 'Clothing',
    price: 549,
    rating: 4.7,
    reviews: 318,
    image: images.clothing,
    gallery: [images.clothing, images.cards, images.packaging],
    description: 'A roomy everyday carry-all made for groceries, laptops, and big ideas.',
    options: ['Natural Cotton', 'Black Canvas', 'Organic Cotton'],
    material: '100% cotton canvas',
    popular: true,
  },
  {
    slug: 'premium-thank-you-cards',
    name: 'Premium Thank You Cards',
    category: 'stationery',
    categoryLabel: 'Stationery',
    price: 449,
    originalPrice: 599,
    rating: 4.9,
    reviews: 204,
    image: images.stationery,
    gallery: [images.stationery, images.invite, images.cards],
    description: 'Add a thoughtful finishing touch to every order with beautifully printed notes.',
    badge: 'Save 25%',
    options: ['Set of 25', 'Set of 50', 'Set of 100'],
    material: '300 GSM uncoated paper',
    popular: true,
  },
  {
    slug: 'gallery-wall-print',
    name: 'Gallery Wall Print',
    category: 'photo-gifts',
    categoryLabel: 'Photo Gifts',
    price: 699,
    rating: 4.8,
    reviews: 153,
    image: images.frame,
    gallery: [images.frame, images.mug, images.cards],
    description: 'Turn a moment into a statement piece with archival-quality wall art.',
    options: ['A4 Framed', 'A3 Framed', 'A2 Unframed'],
    material: 'Archival matte paper',
  },
  {
    slug: 'die-cut-stickers',
    name: 'Die-Cut Stickers',
    category: 'business-printing',
    categoryLabel: 'Business Printing',
    price: 299,
    rating: 4.8,
    reviews: 721,
    image: images.stickers,
    gallery: [images.stickers, images.packaging, images.cards],
    description: 'Weatherproof, colourful stickers that put your mark everywhere.',
    badge: 'Trending',
    options: ['Set of 20', 'Set of 50', 'Set of 100'],
    material: 'Waterproof vinyl',
  },
  {
    slug: 'custom-invitations',
    name: 'Custom Invitations',
    category: 'stationery',
    categoryLabel: 'Stationery',
    price: 599,
    rating: 4.9,
    reviews: 97,
    image: images.invite,
    gallery: [images.invite, images.stationery, images.cards],
    description: 'Set the tone for your celebration with invitations made to feel like you.',
    options: ['Set of 25', 'Set of 50', 'Set of 100'],
    material: 'Premium textured paper',
  },
  {
    slug: 'branded-mailer-boxes',
    name: 'Branded Mailer Boxes',
    category: 'business-printing',
    categoryLabel: 'Business Printing',
    price: 1299,
    rating: 4.7,
    reviews: 88,
    image: images.packaging,
    gallery: [images.packaging, images.stickers, images.cards],
    description: 'Make your unboxing experience unforgettable with custom printed boxes.',
    options: ['Pack of 10', 'Pack of 25', 'Pack of 50'],
    material: 'Recycled corrugated board',
  },
]

export const categoryLabels: Record<Category, string> = {
  'photo-gifts': 'Photo Gifts',
  'business-printing': 'Business Printing',
  clothing: 'Clothing',
  stationery: 'Stationery',
}

export function getProduct(slug: string) {
  return products.find((product) => product.slug === slug)
}
export function getCategoryProducts(category: string) {
  return products.filter((product) => product.category === category)
}
export function searchProducts(query: string) {
  const normalized = query.toLowerCase()
  return products.filter((product) =>
    `${product.name} ${product.categoryLabel} ${product.description}`
      .toLowerCase()
      .includes(normalized),
  )
}
export const formatPrice = (price: number) => `₹${price.toLocaleString('en-IN')}`
