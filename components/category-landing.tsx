'use client'

import Link from 'next/link'
import type { ReactNode } from 'react'
import { useState } from 'react'
import { ChevronDown, Grid2X2, SlidersHorizontal } from 'lucide-react'
import type { Product } from '@/lib/catalog'
import { formatPrice } from '@/lib/catalog'
import { ProductCard } from '@/components/storefront'

const categorySubcategories: Record<string, { label: string; image: string }[]> = {
  'Business Printing': [
    { label: 'Business cards', image: 'https://images.unsplash.com/photo-1589330694653-ded6df03f754?auto=format&fit=crop&w=400&q=80' },
    { label: 'Flyers', image: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?auto=format&fit=crop&w=400&q=80' },
    { label: 'Brochures', image: 'https://images.unsplash.com/photo-1542435503-956c469947f6?auto=format&fit=crop&w=400&q=80' },
    { label: 'Posters', image: 'https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&w=400&q=80' },
    { label: 'Banners', image: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=400&q=80' },
  ],
  'Photo Gifts': [
    { label: 'Birthday gifts', image: 'https://images.unsplash.com/photo-1527529482837-4698179dc6ce?auto=format&fit=crop&w=400&q=80' },
    { label: 'Anniversary gifts', image: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=400&q=80' },
    { label: 'Photo frames', image: 'https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?auto=format&fit=crop&w=400&q=80' },
    { label: 'Mugs', image: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?auto=format&fit=crop&w=400&q=80' },
    { label: 'Cushions', image: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=400&q=80' },
  ],
  Clothing: [
    { label: 'T-shirts', image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=400&q=80' },
    { label: 'Hoodies', image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=400&q=80' },
    { label: 'Caps', image: 'https://images.unsplash.com/photo-1521369909029-2afed882baee?auto=format&fit=crop&w=400&q=80' },
    { label: 'Tote bags', image: 'https://images.unsplash.com/photo-1594223274512-ad4803739b7c?auto=format&fit=crop&w=400&q=80' },
  ],
  Stationery: [
    { label: 'Notebooks', image: 'https://images.unsplash.com/photo-1531346878377-a5be20888e57?auto=format&fit=crop&w=400&q=80' },
    { label: 'Diaries', image: 'https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?auto=format&fit=crop&w=400&q=80' },
    { label: 'Stickers', image: 'https://images.unsplash.com/photo-1608501078713-8e445a709b39?auto=format&fit=crop&w=400&q=80' },
    { label: 'Invitations', image: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=400&q=80' },
  ],
}

function FilterButton({ children, options, active, onToggle }: { children: ReactNode; options: string[]; active: boolean; onToggle: () => void }) {
  return <div className="filter-group"><button type="button" className="catalog-filter" aria-expanded={active} onClick={onToggle}>{children}<ChevronDown size={16}/></button>{active && <div className="filter-popover">{options.map((option) => <button type="button" key={option} onClick={onToggle}>{option}</button>)}</div>}</div>
}

export function CategoryLanding({ title, products }: { title: string; products: Product[] }) {
  const [activeFilter, setActiveFilter] = useState<string | null>(null)
  const toggleFilter = (name: string) => setActiveFilter((current) => current === name ? null : name)
  const subcategories = categorySubcategories[title] ?? categorySubcategories['Photo Gifts']
  return <div className="category-marketplace">
    <div className="collection-strip" id="collections" aria-label={`${title} subcategories`}>{subcategories.map((subcategory) => <Link href="#products" className="collection-circle" key={subcategory.label}><img src={subcategory.image} alt=""/><span>{subcategory.label}</span></Link>)}</div>
    <div className="marketplace-heading"><div><h1>{title}</h1><p>{products.length * 742 + 184} results</p></div><span className="marketplace-count">{products.length} featured products</span></div>
    <div className="filter-bar"><button type="button" className="collections-button" onClick={() => document.getElementById('collections')?.scrollIntoView({ behavior: 'smooth' })}><Grid2X2 size={20}/> Collections</button><FilterButton options={['All categories', 'Best sellers', 'New arrivals']} active={activeFilter === 'category'} onToggle={() => toggleFilter('category')}>Refine by Category</FilterButton><FilterButton options={['Cotton', 'Premium', 'Recycled']} active={activeFilter === 'material'} onToggle={() => toggleFilter('material')}>Material</FilterButton><FilterButton options={['Classic', 'Modern', 'Minimal']} active={activeFilter === 'style'} onToggle={() => toggleFilter('style')}>Style</FilterButton><FilterButton options={['Black', 'White', 'Blue']} active={activeFilter === 'color'} onToggle={() => toggleFilter('color')}>Product Color</FilterButton><FilterButton options={['Printed', 'Photo', 'Text']} active={activeFilter === 'decoration'} onToggle={() => toggleFilter('decoration')}>Decoration type</FilterButton><button type="button" className="add-filter" onClick={() => toggleFilter('more')}><SlidersHorizontal size={17}/> Add Filter <span>+</span></button><label className="sort-control">Sort by <select defaultValue="popular" aria-label="Sort products"><option value="popular">Popular</option><option value="price">Price</option><option value="rating">Top rated</option></select><ChevronDown size={16}/></label></div>
    <div className="marketplace-grid" id="products"><Link href="/contact" className="create-product-tile"><span className="create-product-icon">＋</span><strong>Create your own<br/>product</strong></Link>{products.map((product) => <ProductCard product={product} key={product.slug}/>)}</div>
  </div>
}
