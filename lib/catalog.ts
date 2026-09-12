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
  cards: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=1000&q=85',
  stationery: 'https://images.unsplash.com/photo-1607344645866-009c320b63e0?auto=format&fit=crop&w=1000&q=85',
  clothing: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1000&q=85',
  mug: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?auto=format&fit=crop&w=1000&q=85',
  frame: 'https://images.unsplash.com/photo-1561214115-f2f134cc4912?auto=format&fit=crop&w=1000&q=85',
  stickers: 'https://images.unsplash.com/photo-1572375992501-4b0892d50c69?auto=format&fit=crop&w=1000&q=85',
  packaging: 'https://images.unsplash.com/photo-1588964895597-cfccd6e2dbf9?auto=format&fit=crop&w=1000&q=85',
  invite: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=1000&q=85',
}

export const products: Product[] = [
  { slug: 'classic-business-cards', name: 'Classic Business Cards', category: 'business-printing', categoryLabel: 'Business Printing', price: 399, originalPrice: 499, rating: 4.9, reviews: 842, image: images.cards, gallery: [images.cards, images.stickers, images.packaging], description: 'Make every introduction count with premium, tactile business cards printed in vivid colour.', badge: 'Bestseller', options: ['350 GSM Matte', '350 GSM Gloss', 'Recycled Kraft'], material: '350 GSM premium cardstock', popular: true },
  { slug: 'custom-photo-mug', name: 'Custom Photo Mug', category: 'photo-gifts', categoryLabel: 'Photo Gifts', price: 299, rating: 4.8, reviews: 562, image: images.mug, gallery: [images.mug, images.frame, images.cards], description: 'Your favourite memory, now part of every morning. Dishwasher-safe ceramic with a glossy finish.', badge: 'Most loved', options: ['11 oz White', 'Magic Colour Change', 'Travel Tumbler'], material: 'Gloss ceramic', popular: true },
  { slug: 'everyday-tote-bag', name: 'Everyday Tote Bag', category: 'clothing', categoryLabel: 'Clothing', price: 549, rating: 4.7, reviews: 318, image: images.clothing, gallery: [images.clothing, images.cards, images.packaging], description: 'A roomy everyday carry-all made for groceries, laptops, and big ideas.', options: ['Natural Cotton', 'Black Canvas', 'Organic Cotton'], material: '100% cotton canvas', popular: true },
  { slug: 'premium-thank-you-cards', name: 'Premium Thank You Cards', category: 'stationery', categoryLabel: 'Stationery', price: 449, originalPrice: 599, rating: 4.9, reviews: 204, image: images.stationery, gallery: [images.stationery, images.invite, images.cards], description: 'Add a thoughtful finishing touch to every order with beautifully printed notes.', badge: 'Save 25%', options: ['Set of 25', 'Set of 50', 'Set of 100'], material: '300 GSM uncoated paper', popular: true },
  { slug: 'gallery-wall-print', name: 'Gallery Wall Print', category: 'photo-gifts', categoryLabel: 'Photo Gifts', price: 699, rating: 4.8, reviews: 153, image: images.frame, gallery: [images.frame, images.mug, images.cards], description: 'Turn a moment into a statement piece with archival-quality wall art.', options: ['A4 Framed', 'A3 Framed', 'A2 Unframed'], material: 'Archival matte paper' },
  { slug: 'die-cut-stickers', name: 'Die-Cut Stickers', category: 'business-printing', categoryLabel: 'Business Printing', price: 299, rating: 4.8, reviews: 721, image: images.stickers, gallery: [images.stickers, images.packaging, images.cards], description: 'Weatherproof, colourful stickers that put your mark everywhere.', badge: 'Trending', options: ['Set of 20', 'Set of 50', 'Set of 100'], material: 'Waterproof vinyl' },
  { slug: 'custom-invitations', name: 'Custom Invitations', category: 'stationery', categoryLabel: 'Stationery', price: 599, rating: 4.9, reviews: 97, image: images.invite, gallery: [images.invite, images.stationery, images.cards], description: 'Set the tone for your celebration with invitations made to feel like you.', options: ['Set of 25', 'Set of 50', 'Set of 100'], material: 'Premium textured paper' },
  { slug: 'branded-mailer-boxes', name: 'Branded Mailer Boxes', category: 'business-printing', categoryLabel: 'Business Printing', price: 1299, rating: 4.7, reviews: 88, image: images.packaging, gallery: [images.packaging, images.stickers, images.cards], description: 'Make your unboxing experience unforgettable with custom printed boxes.', options: ['Pack of 10', 'Pack of 25', 'Pack of 50'], material: 'Recycled corrugated board' },
]

export const categoryLabels: Record<Category, string> = { 'photo-gifts': 'Photo Gifts', 'business-printing': 'Business Printing', clothing: 'Clothing', stationery: 'Stationery' }

export function getProduct(slug: string) { return products.find((product) => product.slug === slug) }
export function getCategoryProducts(category: string) { return products.filter((product) => product.category === category) }
export function searchProducts(query: string) { const normalized = query.toLowerCase(); return products.filter((product) => `${product.name} ${product.categoryLabel} ${product.description}`.toLowerCase().includes(normalized)) }
export const formatPrice = (price: number) => `₹${price.toLocaleString('en-IN')}`
