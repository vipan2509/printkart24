import Link from 'next/link'
import { ArrowRight, Check, Package, Sparkles, Truck } from 'lucide-react'
import { Footer, Header, ProductGrid } from '@/components/storefront'
import { products } from '@/lib/catalog'

const categoryTiles = [
  {
    slug: 'photo-gifts',
    name: 'Photo gifts',
    copy: 'Personalised moments',
    image: '/products/photo-mug.png',
  },
  {
    slug: 'business-printing',
    name: 'Business printing',
    copy: 'Build your brand',
    image: '/products/business-cards.png',
  },
  {
    slug: 'clothing',
    name: 'Clothing & bags',
    copy: 'Wear your ideas',
    image: '/products/tote-bag.png',
  },
  {
    slug: 'stationery',
    name: 'Stationery',
    copy: 'Make it memorable',
    image: '/products/thank-you-cards.png',
  },
]

const quickLinks = [
  'Best sellers',
  'Gifts for her',
  'Gifts for him',
  'Wedding stationery',
  'Small business',
]

export default function Home() {
  return (
    <>
      <Header />
      <main className="marketplace-home">
        <section className="market-hero marketplace-hero">
          <div className="page-shell marketplace-hero-inner">
            <div className="marketplace-hero-copy">
              <div className="eyebrow">
                <Sparkles size={15} /> MADE FOR YOUR MOMENTS
              </div>
              <h1 className="display-title">
                Make it personal.
                <br />
                <span>Make it yours.</span>
              </h1>
              <p className="hero-copy">
                Create gifts, stationery, clothing, and business essentials designed by you and made
                to be remembered.
              </p>
              <div className="hero-actions">
                <Link href="/category/photo-gifts" className="button-primary">
                  Start creating <ArrowRight size={17} />
                </Link>
                <Link href="/search?q=bestsellers" className="button-quiet">
                  Shop bestsellers
                </Link>
              </div>
              <div className="trust-row">
                <span>
                  <Check size={15} /> Easy online personalisation
                </span>
                <span>
                  <Truck size={15} /> Delivered across India
                </span>
              </div>
            </div>
            <div className="marketplace-hero-collage">
              <img
                className="hero-collage-main"
                src="/products/custom-invitations.png"
                alt="Personalised invitations and stationery"
              />
              <img
                className="hero-collage-small"
                src="/products/die-cut-stickers.png"
                alt="Custom colourful stickers"
              />
              <div className="hero-collage-note">
                <strong>YOUR IDEA.</strong>
                <br />
                OUR PRINT.
              </div>
            </div>
          </div>
        </section>

        <section className="quick-links-bar">
          <div className="page-shell quick-links-inner">
            <strong>Explore popular:</strong>
            {quickLinks.map((link) => (
              <Link key={link} href={`/search?q=${encodeURIComponent(link)}`}>
                {link}
              </Link>
            ))}
          </div>
        </section>

        <section className="page-shell section-pad">
          <div className="section-heading">
            <div>
              <div className="eyebrow">SHOP YOUR WAY</div>
              <h2 className="section-title">
                Something special
                <br />
                <span>for everyone.</span>
              </h2>
            </div>
            <Link href="/category/photo-gifts" className="text-link">
              Explore all <ArrowRight size={16} />
            </Link>
          </div>
          <div className="category-grid marketplace-category-grid">
            {categoryTiles.map((tile) => (
              <Link href={`/category/${tile.slug}`} className="category-card" key={tile.slug}>
                <img src={tile.image} alt={tile.name} />
                <div>
                  <small>{tile.copy}</small>
                  <strong>{tile.name}</strong>
                  <span>
                    Shop now <ArrowRight size={14} />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section className="product-section">
          <div className="page-shell section-pad">
            <div className="section-heading">
              <div>
                <div className="eyebrow">TRENDING NOW</div>
                <h2 className="section-title">
                  Made to be <span>loved.</span>
                </h2>
              </div>
              <Link href="/search?q=" className="text-link">
                See all products <ArrowRight size={16} />
              </Link>
            </div>
            <ProductGrid products={products.filter((product) => product.popular)} />
          </div>
        </section>

        <section className="page-shell section-pad">
          <div className="bundle-panel marketplace-feature-panel">
            <div className="bundle-copy">
              <div className="eyebrow">FOR SMALL BUSINESSES</div>
              <h2 className="section-title">
                Your brand,
                <br />
                <em>beautifully made.</em>
              </h2>
              <p>
                Bring your business to life with cards, stickers, packaging, and thoughtful details
                that make every order feel like yours.
              </p>
              <Link href="/category/business-printing" className="button-dark">
                Shop business printing <ArrowRight size={17} />
              </Link>
            </div>
            <div className="bundle-images">
              <img
                src="/products/branded-mailer-boxes.png"
                alt="Branded mailer boxes for small businesses"
              />
              <div className="bundle-tag">
                MADE
                <br />
                <strong>FOR YOU</strong>
              </div>
            </div>
          </div>
        </section>

        <section className="proof-section">
          <div className="page-shell section-pad">
            <div className="center-heading">
              <div className="eyebrow">WHY PRINTKART24</div>
              <h2 className="section-title">
                Personal should
                <br />
                <span>feel effortless.</span>
              </h2>
              <p>
                From your first idea to the final delivery, we make creating custom products simple,
                joyful, and reliable.
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
