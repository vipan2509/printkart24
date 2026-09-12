import { notFound } from 'next/navigation'
import { Footer, Header } from '@/components/storefront'
import { CategoryLanding } from '@/components/category-landing'
import { categoryLabels, getCategoryProducts, type Category } from '@/lib/catalog'

export function generateStaticParams() { return Object.keys(categoryLabels).map((category) => ({ category })) }
export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) { const { category } = await params; if (!(category in categoryLabels)) notFound(); const typedCategory = category as Category; const items = getCategoryProducts(category); return <><Header/><main className="page-shell category-page"><div className="breadcrumbs"><a href="/">Home</a> / {categoryLabels[typedCategory]}</div><CategoryLanding title={categoryLabels[typedCategory]} products={items}/></main><Footer/></> }
