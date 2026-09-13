import { notFound } from 'next/navigation'
import { Footer, Header } from '@/components/storefront'
import { getProduct, products } from '@/lib/catalog'
import { ProductCustomizer } from '@/components/product-customizer'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const product = getProduct(slug)
  return {
    title: product ? `${product.name} | PRINTKART` : 'Product | PRINTKART',
    description: product?.description,
  }
}
export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const product = getProduct(slug)
  if (!product) notFound()
  return (
    <>
      <Header />
      <main className="page-shell">
        <div className="breadcrumbs product-breadcrumb">
          <a href="/">Home</a> /{' '}
          <a href={`/category/${product.category}`}>{product.categoryLabel}</a> / {product.name}
        </div>
        <ProductCustomizer product={product} />
        <section className="related section-pad">
          <div className="section-heading">
            <div>
              <div className="eyebrow">YOU MAY ALSO LIKE</div>
              <h2 className="section-title">More good stuff.</h2>
            </div>
          </div>
          <div className="mini-related">
            {products
              .filter((item) => item.slug !== product.slug)
              .slice(0, 4)
              .map((item) => (
                <a href={`/product/${item.slug}`} key={item.slug}>
                  <img src={item.image} alt="" />
                  <strong>{item.name}</strong>
                </a>
              ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
