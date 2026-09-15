import Link from 'next/link'
import { ArrowRight, Check, Package, ShieldCheck, Sparkles, Truck } from 'lucide-react'
import { Footer, Header, ProductGrid } from '@/components/storefront'
import { products } from '@/lib/catalog'

const shortcuts = [
  ['T-Shirts', '/category/clothing', '/products/tote-bag.png'],
  ['Mugs', '/category/photo-gifts', '/products/photo-mug.png'],
  ['Business Cards', '/category/business-printing', '/products/business-cards.png'],
  ['Stickers', '/category/stationery', '/products/die-cut-stickers.png'],
  ['Invitations', '/category/photo-gifts', '/products/custom-invitations.png'],
  ['Packaging', '/category/business-printing', '/products/branded-mailer-boxes.png'],
]

const eventCategories = [
  ['Weddings', '/category/photo-gifts', '/products/custom-invitations.png'],
  ['Birthdays', '/category/photo-gifts', '/products/gallery-wall-print.png'],
  ['Baby Showers', '/category/photo-gifts', '/products/thank-you-cards.png'],
]

const seasonCategories = [
  ['Hoodies & Sweatshirts', '/category/clothing', '/products/tote-bag.png'],
  ['Cushions', '/category/photo-gifts', '/products/gallery-wall-print.png'],
  ['Socks', '/category/clothing', '/products/die-cut-stickers.png'],
  ['Fleece Blankets', '/category/photo-gifts', '/products/photo-mug.png'],
]

const popularCategories = [
  ['Cards & Invitations', '/category/photo-gifts', '/products/custom-invitations.png'],
  ['Gift Wrap & Party Supplies', '/category/stationery', '/products/thank-you-cards.png'],
  ['Sports & Games', '/category/clothing', '/products/die-cut-stickers.png'],
  ['Accessories', '/category/clothing', '/products/tote-bag.png'],
  ['Home Decor', '/category/photo-gifts', '/products/gallery-wall-print.png'],
  ['Create Your Own', '/category/business-printing', '/products/business-cards.png'],
]

function ImageRow({
  title,
  items,
  className = '',
}: {
  title: string
  items: string[][]
  className?: string
}) {
  return (
    <section className={`reference-section ${className}`}>
      <div className="reference-section-heading">
        <h2>{title}</h2>
        <Link href="/search?q=popular">
          View all <ArrowRight size={14} />
        </Link>
      </div>
      <div className="reference-card-row">
        {items.map(([name, href, image]) => (
          <Link href={href} className="reference-card" key={name}>
            <img src={image} alt={name} />
            <span>{name}</span>
          </Link>
        ))}
      </div>
    </section>
  )
}

export default function Home() {
  return (
    <>
      <div className="reference-promo-bar">
        Save up to 30% on custom products <span>Shop now →</span>
      </div>
      <Header />
      <main className="reference-home">
        <section className="reference-hero">
          <div className="reference-hero-content">
            <div>
              <p className="reference-kicker">PRINTKART24 WEDDINGS</p>
              <h1>Create Your Dream Day</h1>
              <p>Save up to 25% on wedding invitations and save the dates.</p>
              <Link href="/category/photo-gifts" className="reference-dark-button">
                Shop now
              </Link>
            </div>
            <img
              src="/products/custom-invitations.png"
              alt="Custom wedding invitations and stationery"
            />
          </div>
        </section>
        <div className="reference-content">
          <section className="welcome-section">
            <h2>Welcome back, vipan!</h2>
            <p>Made since 2026</p>
            <div className="reference-circle-row">
              {shortcuts.map(([name, href, image]) => (
                <Link href={href} key={name}>
                  <img src={image} alt={name} />
                  <span>{name}</span>
                </Link>
              ))}
            </div>
          </section>
          <ImageRow title="Shop for your event" items={eventCategories} />
          <ImageRow title="New season essentials" items={seasonCategories} />
          <section className="reference-section">
            <div className="reference-section-heading">
              <h2>More popular categories</h2>
            </div>
            <div className="reference-category-grid">
              {popularCategories.map(([name, href, image]) => (
                <Link href={href} className="reference-wide-card" key={name}>
                  <img src={image} alt={name} />
                  <span>{name}</span>
                </Link>
              ))}
            </div>
          </section>
          <section className="creator-banner">
            <img src="/products/branded-mailer-boxes.png" alt="Create products for your business" />
            <div>
              <h2>Sell on PrintKart24</h2>
              <p>Become a PrintKart24 creator and make money from your designs.</p>
              <Link href="/contact" className="reference-dark-button">
                Learn more
              </Link>
            </div>
          </section>
          <ImageRow title="Featured collections" items={shortcuts.slice(0, 6)} />
          <section className="promise-section">
            <h2>The PrintKart24 promise</h2>
            <div className="promise-grid">
              <div>
                <Package />
                <h3>Order with confidence</h3>
                <p>Quality printing and thoughtful packaging.</p>
              </div>
              <div>
                <Truck />
                <h3>Easy delivery</h3>
                <p>We deliver your custom ideas across India.</p>
              </div>
              <div>
                <ShieldCheck />
                <h3>Secure shopping</h3>
                <p>Your details and orders are always protected.</p>
              </div>
            </div>
          </section>
          <section className="newsletter-section">
            <Sparkles size={18} />
            <h2>Get exclusive offers</h2>
            <p>Be first to hear about new products and special savings.</p>
            <form>
              <input
                type="email"
                placeholder="Your email address"
                aria-label="Your email address"
              />
              <button type="submit">Sign up now</button>
            </form>
          </section>
        </div>
      </main>
      <Footer />
    </>
  )
}
