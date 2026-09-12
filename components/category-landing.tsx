'use client'

import Link from 'next/link'
import type { ReactNode } from 'react'
import { ChevronDown, Grid2X2, SlidersHorizontal } from 'lucide-react'
import type { Product } from '@/lib/catalog'
import { formatPrice } from '@/lib/catalog'
import { ProductCard } from '@/components/storefront'

const collections = [
  { label: 'Birthday', image: 'https://images.unsplash.com/photo-1527529482837-4698179dc6ce?auto=format&fit=crop&w=400&q=80' },
  { label: 'Create your own', image: 'https://images.unsplash.com/photo-1492724441997-5dc865305da7?auto=format&fit=crop&w=400&q=80' },
  { label: 'Vintage', image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=400&q=80' },
  { label: 'Corporate', image: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=400&q=80' },
  { label: 'For everyone', image: 'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?auto=format&fit=crop&w=400&q=80' },
  { label: 'Your logo here', image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=400&q=80' },
]

function FilterButton({ children }: { children: ReactNode }) {
  return <button type="button" className="catalog-filter">{children}<ChevronDown size={16}/></button>
}

export function CategoryLanding({ title, products }: { title: string; products: Product[] }) {
  return <div className="category-marketplace">
    <div className="collection-strip" aria-label="Popular collections">{collections.map((collection) => <Link href="#products" className="collection-circle" key={collection.label}><img src={collection.image} alt=""/><span>{collection.label}</span></Link>)}</div>
    <div className="marketplace-heading"><div><h1>{title}</h1><p>{products.length * 742 + 184} results</p></div><span className="marketplace-count">{products.length} featured products</span></div>
    <div className="filter-bar"><button type="button" className="collections-button"><Grid2X2 size={20}/> Collections</button><FilterButton>Refine by Category</FilterButton><FilterButton>Material</FilterButton><FilterButton>Style</FilterButton><FilterButton>Product Color</FilterButton><FilterButton>Decoration type</FilterButton><button type="button" className="add-filter"><SlidersHorizontal size={17}/> Add Filter <span>+</span></button><label className="sort-control">Sort by <select defaultValue="popular" aria-label="Sort products"><option value="popular">Popular</option><option value="price">Price</option><option value="rating">Top rated</option></select><ChevronDown size={16}/></label></div>
    <div className="marketplace-grid" id="products"><Link href="/contact" className="create-product-tile"><span className="create-product-icon">＋</span><strong>Create your own<br/>product</strong></Link>{products.map((product) => <ProductCard product={product} key={product.slug}/>)}</div>
  </div>
}
