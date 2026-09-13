import Link from 'next/link'
import { ArrowRight, Check, Package, Sparkles, Truck } from 'lucide-react'
import { Footer, Header, ProductGrid } from '@/components/storefront'
import { products } from '@/lib/catalog'

const categoryTiles = [
  {
    slug: 'photo-gifts',
    name: 'Photo Gifts',
    copy: 'Turn memories into keepsakes',
    image:
      'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?auto=format&fit=crop&w=900&q=85',
  },
  {
    slug: 'business-printing',
    name: 'Business Printing',
    copy: 'Make your brand memorable',
    image:
      'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=900&q=85',
  },
  {
    slug: 'clothing',
    name: 'Clothing',
    copy: 'Wear what you believe in',
    image:
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=85',
  },
  {
    slug: 'stationery',
    name: 'Stationery',
    copy: 'Make every note count',
    image:
      'https://images.unsplash.com/photo-1607344645866-009c320b63e0?auto=format&fit=crop&w=900&q=85',
  },
]

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <section className="market-hero">
          <div className="page-shell hero-grid">
            <div>
              <div className="eyebrow">
                <Sparkles size={15} /> MAKE IT YOURS
              </div>
              <h1 className="display-title">
                Small prints.
                <br />
                <span>Big feeling.</span>
              </h1>
              <p className="hero-copy">
                Create thoughtful photo gifts, standout business essentials, and everyday pieces
                that feel completely yours.
              </p>
              <div className="hero-actions">
                <Link href="/category/photo-gifts" className="button-primary">
                  Start creating <ArrowRight size={17} />
                </Link>
                <Link href="/search?q=bestsellers" className="button-quiet">
                  Explore bestsellers
                </Link>
              </div>
              <div className="trust-row">
                <span>
                  <Check size={15} /> Easy customization
                </span>
                <span>
                  <Truck size={15} /> Ships across India
                </span>
              </div>
            </div>
            <div className="hero-art">
              <img
                src="https://images.unsplash.com/photo-1556740758-90de374c12ad?auto=format&fit=crop&w=1400&q=90"
                alt="Printed stationery and packaging arranged on a desk"
              />
              <div className="hero-sticker">
                PRINT
                <br />
                <strong>GOOD</strong>
                <br />
                <span>THINGS</span>
              </div>
            </div>
          </div>
        </section>
        <section className="page-shell section-pad">
          <div className="section-heading">
            <div>
              <div className="eyebrow">SHOP BY CATEGORY</div>
              <h2 className="section-title">
                Find your kind of
                <br />
                <span>special.</span>
              </h2>
            </div>
            <Link href="/category/photo-gifts" className="text-link">
              View all categories <ArrowRight size={16} />
            </Link>
          </div>
          <div className="category-grid">
            {categoryTiles.map((tile) => (
              <Link href={`/category/${tile.slug}`} className="category-card" key={tile.slug}>
                <img src={tile.image} alt="" />
                <div>
                  <small>{tile.copy}</small>
                  <strong>{tile.name}</strong>
                </div>
              </Link>
            ))}
          </div>
        </section>
        <section className="product-section">
          <div className="page-shell section-pad">
            <div className="section-heading">
              <div>
                <div className="eyebrow">PEOPLE ARE LOVING</div>
                <h2 className="section-title">The good stuff.</h2>
              </div>
              <Link href="/search?q=" className="text-link">
                Shop all products <ArrowRight size={16} />
              </Link>
            </div>
            <ProductGrid products={products.filter((product) => product.popular)} />
          </div>
        </section>
        <section className="page-shell section-pad">
          <div className="bundle-panel">
            <div className="bundle-copy">
              <div className="eyebrow">THE LITTLE BUSINESS BUNDLE</div>
              <h2 className="section-title">
                Look like you
                <br />
                <em>mean business.</em>
              </h2>
              <p>
                Everything you need to make your next launch feel like a launch: cards, stickers,
                thank you notes, and a box full of confidence.
              </p>
              <Link href="/product/classic-business-cards" className="button-dark">
                Build your bundle <ArrowRight size={17} />
              </Link>
            </div>
            <div className="bundle-images">
              <img
                src="https://images.unsplash.com/photo-1523726491678-bf852e717f6a?auto=format&fit=crop&w=1000&q=85"
                alt="Branded stationery and packaging for a small business"
              />
              <div className="bundle-tag">
                SAVE
                <br />
                <strong>15%</strong>
              </div>
            </div>
          </div>
        </section>
        <section className="proof-section">
          <div className="page-shell section-pad">
            <div className="center-heading">
              <div className="eyebrow">WHY PRINTKART</div>
              <h2 className="section-title">
                Good design should
                <br />
                <span>feel good too.</span>
              </h2>
              <p>
                From the first click to the final unboxing, we keep printing simple, thoughtful, and
                a little more joyful.
              </p>
            </div>
            <div className="proof-grid">
              <div className="proof-card">
                <Package size={26} />
                <h3>Made to arrive happy</h3>
                <p>Carefully packed and delivered to your door, anywhere in India.</p>
              </div>
              <div className="proof-card">
                <Sparkles size={26} />
                <h3>Quality you can feel</h3>
                <p>Beautiful papers, vivid colour, and finishes that get noticed.</p>
              </div>
              <div className="proof-card">
                <Truck size={26} />
                <h3>Ideas welcome here</h3>
                <p>Easy tools and real humans when you need a creative nudge.</p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
