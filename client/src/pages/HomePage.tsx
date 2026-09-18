import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Truck,
  Box,
  Heart,
  Star,
  Check,
} from 'lucide-react';
import './HomePage.scss';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);

  const handleNewsletter = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail.includes('@')) {
      setNewsletterSubscribed(true);
    }
  };

  // 1. Circular Avatar Categories ("Welcome to PRINTKART24")
  const circleCategories = [
    {
      name: 'T-Shirts',
      image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=350&auto=format&fit=crop&q=80',
      path: '/products?category=t-shirts',
    },
    {
      name: 'Mugs',
      image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=350&auto=format&fit=crop&q=80',
      path: '/products?category=mugs',
    },
    {
      name: 'Business Cards',
      image: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=350&auto=format&fit=crop&q=80',
      path: '/products?category=business-cards',
    },
    {
      name: 'Stickers',
      image: 'https://images.unsplash.com/photo-1572375992501-4b0892d50c69?w=350&auto=format&fit=crop&q=80',
      path: '/products?category=stickers-labels',
    },
    {
      name: 'Invitations',
      image: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=350&auto=format&fit=crop&q=80',
      path: '/products?category=invitations',
    },
    {
      name: 'Packaging & Bags',
      image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=350&auto=format&fit=crop&q=80',
      path: '/products?category=packaging-boxes',
    },
  ];

  // 2. "Shop for your event" (3 Large Cards)
  const eventCards = [
    {
      title: 'Weddings',
      image: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&auto=format&fit=crop&q=80',
      path: '/products?category=invitations',
    },
    {
      title: 'Birthdays',
      image: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=800&auto=format&fit=crop&q=80',
      path: '/products?category=corporate-gift-sets',
    },
    {
      title: 'Baby & Kids',
      image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&auto=format&fit=crop&q=80',
      path: '/products?category=home-decor',
    },
  ];

  // 3. "Every wear-care essentials" (4 Square Cards)
  const essentialsCards = [
    {
      title: 'Hoodies & Sweatshirts',
      image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=600&auto=format&fit=crop&q=80',
      path: '/products?category=t-shirts',
    },
    {
      title: 'Cushions & Pillows',
      image: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=600&auto=format&fit=crop&q=80',
      path: '/products?category=home-decor',
    },
    {
      title: 'Custom Printed Socks',
      image: 'https://images.unsplash.com/photo-1586350977771-b3b0abd50c82?w=600&auto=format&fit=crop&q=80',
      path: '/products?category=t-shirts',
    },
    {
      title: 'Throws & Blankets',
      image: 'https://images.unsplash.com/photo-1580301762395-21ce84d00bc6?w=600&auto=format&fit=crop&q=80',
      path: '/products?category=home-decor',
    },
  ];

  // 4. Curated 6-Grid Collections (3 columns x 2 rows)
  const gridCollections = [
    {
      title: 'Event Invitations',
      image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=600&auto=format&fit=crop&q=80',
      path: '/products?category=invitations',
    },
    {
      title: 'Clothing & Accessories',
      image: 'https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?w=600&auto=format&fit=crop&q=80',
      path: '/products?category=t-shirts',
    },
    {
      title: 'Sports & Outdoors',
      image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=600&auto=format&fit=crop&q=80',
      path: '/products?category=bottles',
    },
    {
      title: 'Accessories',
      image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600&auto=format&fit=crop&q=80',
      path: '/products?category=corporate-diaries',
    },
    {
      title: 'Home Decor',
      image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=600&auto=format&fit=crop&q=80',
      path: '/products?category=home-decor',
    },
    {
      title: 'Create Your Own',
      image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=600&auto=format&fit=crop&q=80',
      path: '/products?isCustomizable=true',
      isSpecial: true,
    },
  ];

  return (
    <div className="zazzle-home">
      {/* 1. HERO SECTION: "Create Your Dream Day" */}
      <section className="zazzle-hero">
        <div className="container zazzle-hero__container">
          <div className="zazzle-hero__left">
            <h1 className="hero-title">Create Your Dream Day</h1>
            <p className="hero-subtitle">
              Save up to 50% on Custom Wedding Invitations and Event Stationery*
            </p>
            <button
              className="zazzle-pill-btn"
              onClick={() => navigate('/products')}
            >
              Shop Now
            </button>
          </div>

          <div className="zazzle-hero__right">
            {/* Realistic Layered Stationery Fan Cascade */}
            <div className="stationery-stack">
              {/* Back Card: Details Navy Striped */}
              <div className="card-item card-item--details">
                <div className="card-inner">
                  <div className="card-header-bar">DETAILS</div>
                  <div className="card-lines">
                    <span />
                    <span />
                    <span />
                  </div>
                  <div className="card-stripes" />
                </div>
              </div>

              {/* Yellow Card: Celebrate With Us */}
              <div className="card-item card-item--yellow">
                <div className="card-inner">
                  <div className="badge-stamp">HOTEL MONACO</div>
                  <div className="card-title-script">Saturday & Sunday</div>
                  <div className="card-body-text">CELEBRATE WITH US</div>
                </div>
              </div>

              {/* Scalloped Yellow RSVP Card */}
              <div className="card-item card-item--rsvp">
                <div className="card-inner">
                  <div className="rsvp-title">KINDLY REPLY</div>
                  <div className="rsvp-sub">by July 20th</div>
                  <div className="rsvp-checkboxes">
                    <span>□ Joyfully Accepts</span>
                    <span>□ Regretfully Declines</span>
                  </div>
                </div>
              </div>

              {/* Blue Scalloped Frame Invitation Card */}
              <div className="card-item card-item--blue-invite">
                <div className="card-scallop-border">
                  <div className="invite-intro">Kindly join us for the wedding of</div>
                  <div className="invite-names">CHLOE</div>
                  <div className="invite-and">&amp;</div>
                  <div className="invite-names">THOMAS</div>
                  <div className="invite-divider" />
                  <div className="invite-date">AUGUST 18</div>
                  <div className="invite-venue">AT SIX IN THE EVENING</div>
                  <div className="invite-place">BELLA GARDEN • SAN DIEGO, CA</div>
                </div>
              </div>

              {/* Front Photo Card: Save The Date */}
              <div className="card-item card-item--photo">
                <div className="photo-wrapper">
                  <img
                    src="https://images.unsplash.com/photo-1519741497674-611481863552?w=600&auto=format&fit=crop&q=80"
                    alt="Save the Date"
                  />
                  <div className="photo-script-overlay">Save the date</div>
                </div>
                <div className="photo-caption">
                  <span className="names">CHLOE + THOMAS</span>
                  <span className="date">08.18.2026</span>
                </div>
              </div>

              {/* Botanical sprig accent */}
              <div className="botanical-accent">🌿</div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. WELCOME SECTION: Circular Avatar Row */}
      <section className="zazzle-section zazzle-welcome">
        <div className="container">
          <div className="section-head text-center">
            <h2>Welcome to PRINTKART24</h2>
            <Link to="/products" className="sub-link">
              Explore popular categories crafted for you
            </Link>
          </div>

          <div className="circles-row">
            {circleCategories.map((cat) => (
              <Link key={cat.name} to={cat.path} className="circle-item">
                <div className="circle-img-wrapper">
                  <img src={cat.image} alt={cat.name} loading="lazy" />
                </div>
                <span className="circle-label">{cat.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 3. "SHOP FOR YOUR EVENT" (3 Large Cards) */}
      <section className="zazzle-section zazzle-events">
        <div className="container">
          <div className="section-head">
            <h2>Shop for your event</h2>
          </div>

          <div className="events-grid">
            {eventCards.map((card) => (
              <Link key={card.title} to={card.path} className="event-card">
                <div className="event-img-box">
                  <img src={card.image} alt={card.title} loading="lazy" />
                </div>
                <div className="event-card-label">{card.title}</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 4. "EVERY WEAR-CARE ESSENTIALS" (4 Square Cards) */}
      <section className="zazzle-section zazzle-essentials">
        <div className="container">
          <div className="section-head">
            <h2>Every wear-care essentials</h2>
          </div>

          <div className="essentials-grid">
            {essentialsCards.map((item) => (
              <Link key={item.title} to={item.path} className="essential-card">
                <div className="essential-img-box">
                  <img src={item.image} alt={item.title} loading="lazy" />
                </div>
                <div className="essential-card-label">{item.title}</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 5. CURATED 6-GRID COLLECTIONS (2 rows x 3 columns) */}
      <section className="zazzle-section zazzle-grid-showcase">
        <div className="container">
          <div className="collections-grid">
            {gridCollections.map((col) => (
              <Link
                key={col.title}
                to={col.path}
                className={`collection-card ${col.isSpecial ? 'collection-card--special' : ''}`}
              >
                <div className="collection-img-box">
                  <img src={col.image} alt={col.title} loading="lazy" />
                  {col.isSpecial && (
                    <div className="customizer-badge-overlay">
                      <Sparkles size={16} />
                      <span>2D Design Studio</span>
                    </div>
                  )}
                </div>
                <div className="collection-card-label">{col.title}</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 6. B2B / CORPORATE PROMO BANNER ("Sell on Zazzle" -> "Corporate Bulk & Enterprise") */}
      <section className="zazzle-section zazzle-creator-banner">
        <div className="container">
          <div className="creator-banner-box">
            <div className="creator-banner-left">
              <img
                src="https://images.unsplash.com/photo-1542744094-3a31f272c490?w=700&auto=format&fit=crop&q=80"
                alt="Corporate Printing & Merchandise"
                className="banner-side-image"
              />
            </div>
            <div className="creator-banner-right">
              <h2>Corporate Bulk &amp; Enterprise Printing</h2>
              <p>
                Personalize merchandise for your team, client onboarding, or promotional events.
                Volume discounts &amp; dedicated account managers for your business.
              </p>
              <button
                className="zazzle-pill-btn zazzle-pill-btn--dark"
                onClick={() => navigate('/bulk-orders')}
              >
                Get a Custom Quote
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 7. OFFICIALLY TRUSTED BRANDS */}
      <section className="zazzle-section zazzle-licensed-stores">
        <div className="container">
          <h3 className="section-subhead text-center">Trusted by 10,000+ Brands Across India</h3>
          <div className="brands-logos-row">
            <span>TECHNOVATE</span>
            <span>HYPERGROWTH</span>
            <span>BREWCRAFT</span>
            <span>NOVA LABS</span>
            <span>ZENITH MEDIA</span>
            <span>URBAN ROOTS</span>
          </div>
        </div>
      </section>

      {/* 8. "THE PRINTKART24 PROMISE" (3 Columns with Minimal Vector Icons) */}
      <section className="zazzle-section zazzle-promise">
        <div className="container">
          <div className="section-head text-center">
            <h2>The PRINTKART24 Promise</h2>
          </div>

          <div className="promise-grid">
            <div className="promise-col">
              <div className="promise-icon">
                <Box size={38} strokeWidth={1.2} />
              </div>
              <h4>100% Satisfaction Guarantee</h4>
              <p>
                Love it or we'll reprint it. If your custom print isn't picture-perfect, we'll remake it or refund you promptly.
              </p>
            </div>

            <div className="promise-col">
              <div className="promise-icon">
                <Truck size={38} strokeWidth={1.2} />
              </div>
              <h4>Express Pan-India Delivery</h4>
              <p>
                Trackable express dispatch directly to your doorstep across 19,000+ PIN codes in India.
              </p>
            </div>

            <div className="promise-col">
              <div className="promise-icon">
                <ShieldCheck size={38} strokeWidth={1.2} />
              </div>
              <h4>Secure Shopping &amp; Pre-Press</h4>
              <p>
                100% secure payments with SSL encryption and free pre-press quality review by our master printers.
              </p>
            </div>
          </div>

          <div className="promise-footer-link text-center">
            <Link to="/products">See The PRINTKART24 Promise for complete details →</Link>
          </div>
        </div>
      </section>

      {/* 9. "GET EXCLUSIVE OFFERS" EMAIL NEWSLETTER */}
      <section className="zazzle-section zazzle-newsletter">
        <div className="container">
          <div className="newsletter-box text-center">
            <h2>Get Exclusive Offers</h2>
            {newsletterSubscribed ? (
              <div className="newsletter-success">
                <Check size={20} />
                <span>Thank you! Code WELCOME10 is ready to use on your next order.</span>
              </div>
            ) : (
              <form onSubmit={handleNewsletter} className="newsletter-inline-form">
                <input
                  type="email"
                  placeholder="Enter your email address"
                  required
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                />
                <button type="submit">Sign Up Now</button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* Floating "Need Help?" Chat Bubble (from screenshot bottom right) */}
      <a
        href="https://wa.me/919876543210?text=Hi%20PRINTKART24,%20I%20have%20an%20inquiry%20about%20custom%20printing."
        target="_blank"
        rel="noopener noreferrer"
        className="floating-help-pill"
        title="Chat with a Print Specialist"
      >
        <span>💬 Need Help?</span>
      </a>
    </div>
  );
};

export default HomePage;
