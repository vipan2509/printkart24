import React, { useState, useEffect, useRef } from 'react';
import { Link, useSearchParams, useParams, useNavigate } from 'react-router-dom';
import {
  ChevronRight,
  ChevronDown,
  Sparkles,
  Heart,
  Star,
  X,
  Check,
  RotateCcw,
  SlidersHorizontal,
  Plus,
  ArrowRight,
  ShieldCheck,
  Truck,
  Box,
  Eye
} from 'lucide-react';
import api from '../services/api';
import { Product, Category } from '../types';
import { useWishlistStore } from '../store/wishlistStore';
import './ProductListingPage.scss';

// Visual Category Explorer Cards (Top Row from Reference Image)
const VISUAL_EXPLORER_ITEMS = [
  {
    name: 'Stickers & Labels',
    slug: 'stickers-labels',
    image: 'https://images.unsplash.com/photo-1572375992501-4b0892d50c69?w=400&auto=format&fit=crop&q=80',
    tag: 'From ₹49',
  },
  {
    name: 'Mugs & Bottles',
    slug: 'mugs-bottles',
    image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=400&auto=format&fit=crop&q=80',
    tag: 'From ₹199',
  },
  {
    name: 'T-Shirts & Apparel',
    slug: 't-shirts',
    image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=400&auto=format&fit=crop&q=80',
    tag: 'From ₹349',
  },
  {
    name: 'Packaging Boxes',
    slug: 'packaging-boxes',
    image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=400&auto=format&fit=crop&q=80',
    tag: 'From ₹129',
  },
  {
    name: 'Business Cards',
    slug: 'business-cards',
    image: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=400&auto=format&fit=crop&q=80',
    tag: 'From ₹199',
  },
  {
    name: 'Corporate Gifts',
    slug: 'corporate-gift-sets',
    image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400&auto=format&fit=crop&q=80',
    tag: 'From ₹599',
  },
];

// Horizontal Filter Definitions
const PRODUCT_TYPES = [
  { label: 'All Types', slug: '' },
  { label: 'Stickers & Labels', slug: 'stickers-labels' },
  { label: 'Mugs & Bottles', slug: 'mugs-bottles' },
  { label: 'Business Cards', slug: 'business-cards' },
  { label: 'T-Shirts & Apparel', slug: 't-shirts' },
  { label: 'Card Holders', slug: 'card-holders' },
  { label: 'Keychains', slug: 'keychains' },
  { label: 'Pens & Writing', slug: 'pens' },
  { label: 'Diaries & Notepads', slug: 'corporate-diaries' },
  { label: 'Packaging & Boxes', slug: 'packaging-boxes' },
];

const PRICE_RANGES = [
  { label: 'All Prices', min: '', max: '' },
  { label: 'Under ₹250', min: '', max: '249' },
  { label: '₹250 - ₹500', min: '250', max: '500' },
  { label: '₹500 - ₹1,000', min: '500', max: '1000' },
  { label: 'Above ₹1,000', min: '1000', max: '' },
];

const COLOR_OPTIONS = [
  { label: 'White', hex: '#FFFFFF', border: '#CBD5E1' },
  { label: 'Black', hex: '#111827', border: '#111827' },
  { label: 'Navy Blue', hex: '#15013F', border: '#15013F' },
  { label: 'Crimson Red', hex: '#DC2626', border: '#DC2626' },
  { label: 'Forest Green', hex: '#166534', border: '#166534' },
  { label: 'Canary Yellow', hex: '#EAB308', border: '#EAB308' },
  { label: 'Metallic Silver', hex: '#94A3B8', border: '#94A3B8' },
  { label: 'Magenta Pink', hex: '#AE1478', border: '#AE1478' },
];

const MATERIAL_OPTIONS = [
  'Heavy Waterproof Vinyl',
  'Food-Grade Ceramic',
  'Stainless Steel',
  '100% Combed Cotton',
  'Recycled Kraft Board',
  'Vegan Leather',
];

const PRINTING_TYPES = [
  '360° HD Sublimation',
  'Screen Printing',
  'Laser Engraved',
  'Direct-To-Garment (DTG)',
  'Metallic Foil Stamping',
];

export const ProductListingPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { categorySlug } = useParams<{ categorySlug?: string }>();
  const { isInWishlist, toggleWishlist } = useWishlistStore();

  // Active query parameters
  const currentCategory = categorySlug || searchParams.get('category') || '';
  const currentSearch = searchParams.get('search') || '';
  const currentSort = searchParams.get('sortBy') || 'featured';
  const isCustomizableParam = searchParams.get('isCustomizable') === 'true';
  const minPriceParam = searchParams.get('minPrice') || '';
  const maxPriceParam = searchParams.get('maxPrice') || '';
  const activeColor = searchParams.get('color') || '';
  const activeMaterial = searchParams.get('material') || '';
  const activePrintType = searchParams.get('printType') || '';
  const activeType = searchParams.get('type') || '';

  // Component state
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const filterBarRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (filterBarRef.current && !filterBarRef.current.contains(e.target as Node)) {
        setOpenDropdown(null);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleDropdown = (name: string) => {
    setOpenDropdown((prev) => (prev === name ? null : name));
  };

  // Helper to update search params cleanly
  const updateParam = (key: string, val: string | null) => {
    const updated = new URLSearchParams(searchParams);
    if (val) {
      updated.set(key, val);
    } else {
      updated.delete(key);
    }
    setSearchParams(updated);
  };

  const handleResetFilters = () => {
    setSearchParams({});
    setOpenDropdown(null);
    setMobileFilterOpen(false);
  };

  // Fetch products from backend
  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (currentCategory) params.set('category', currentCategory);
        if (currentSearch) params.set('search', currentSearch);
        if (currentSort) params.set('sortBy', currentSort);
        if (isCustomizableParam) params.set('isCustomizable', 'true');
        if (minPriceParam) params.set('minPrice', minPriceParam);
        if (maxPriceParam) params.set('maxPrice', maxPriceParam);
        params.set('limit', '24');

        const res = await api.get(`/products?${params.toString()}`);
        if (res.data.success) {
          setProducts(res.data.data.products);
          setTotalCount(res.data.data.pagination.total || 0);
        }
      } catch (err) {
        console.error('Error fetching listing products:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [
    currentCategory,
    currentSearch,
    currentSort,
    isCustomizableParam,
    minPriceParam,
    maxPriceParam,
  ]);

  // Dynamic Titles & Descriptions
  const categoryTitle = currentSearch
    ? `Search: "${currentSearch}"`
    : currentCategory
    ? currentCategory
        .split('-')
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ')
    : 'Custom Printing & Personalized Products';

  const categoryDesc = currentCategory?.includes('sticker')
    ? 'Waterproof vinyl stickers, die-cut product labels and custom packaging seals.'
    : currentCategory?.includes('mug') || currentCategory?.includes('bottle')
    ? 'Custom ceramic photo mugs and insulated stainless steel drinkware with 360° HD wrap.'
    : currentCategory?.includes('business-card')
    ? 'Premium 350 GSM matte and velvet business cards with luxury foil finishes.'
    : currentCategory?.includes('t-shirt')
    ? 'Bio-washed cotton corporate polo and crewneck t-shirts with high-durability print.'
    : currentCategory?.includes('packaging') || currentCategory?.includes('cup')
    ? 'Custom printed disposable cups, rigid magnetic gift boxes and luxury paper bags for brand unboxing.'
    : 'Discover thousands of customizable products crafted with perfection by master printers.';

  const hasActiveFilters = Boolean(
    currentCategory ||
    currentSearch ||
    isCustomizableParam ||
    minPriceParam ||
    maxPriceParam ||
    activeColor ||
    activeMaterial ||
    activePrintType ||
    activeType
  );

  // Identify first customizable slug for "Create Your Own" card
  const firstCustomizableSlug =
    products.find((p) => p.isCustomizable)?.slug || 'custom-ceramic-coffee-mug';

  return (
    <div className="pk-category-page">
      <div className="container">
        {/* 1. BREADCRUMBS */}
        <nav className="pk-category-breadcrumb" aria-label="Breadcrumb">
          <Link to="/">Home</Link>
          <span className="sep"><ChevronRight size={13} /></span>
          <Link to="/products">All Categories</Link>
          {currentCategory && (
            <>
              <span className="sep"><ChevronRight size={13} /></span>
              <span className="current">{categoryTitle}</span>
            </>
          )}
        </nav>

        {/* 2. PAGE TITLE & DESCRIPTION */}
        <div className="pk-category-header">
          <h1 className="header-title">{categoryTitle}</h1>
          <p className="header-desc">{categoryDesc}</p>
        </div>

        {/* 3. TOP VISUAL CATEGORY EXPLORER (6 Rounded Cards) */}
        <div className="pk-visual-explorer">
          <div className="visual-cards-track">
            {VISUAL_EXPLORER_ITEMS.map((item) => {
              const isActive = currentCategory === item.slug;
              return (
                <button
                  key={item.slug}
                  type="button"
                  className={`visual-card ${isActive ? 'visual-card--active' : ''}`}
                  onClick={() => {
                    if (isActive) {
                      updateParam('category', null);
                    } else {
                      updateParam('category', item.slug);
                    }
                  }}
                >
                  <div className="visual-card-img">
                    <img src={item.image} alt={item.name} loading="lazy" />
                  </div>
                  <span className="visual-card-name">{item.name}</span>
                  <span className="visual-card-tag">{item.tag}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 4. FULL-WIDTH HORIZONTAL FILTER BAR (NO SIDEBAR!) */}
        <div className="pk-horizontal-filter-bar" ref={filterBarRef}>
          <div className="filters-left">
            {/* Filter 1: Product Type Dropdown */}
            <div className="filter-dropdown-wrapper">
              <button
                type="button"
                className={`filter-pill ${activeType || currentCategory ? 'filter-pill--active' : ''}`}
                onClick={() => toggleDropdown('type')}
              >
                <span>
                  {activeType
                    ? PRODUCT_TYPES.find((t) => t.slug === activeType)?.label || 'Type'
                    : 'Product Type'}
                </span>
                <ChevronDown size={14} className={openDropdown === 'type' ? 'rotated' : ''} />
              </button>

              {openDropdown === 'type' && (
                <div className="filter-popover">
                  <div className="popover-title">Product Type</div>
                  <div className="popover-options">
                    {PRODUCT_TYPES.map((pt) => (
                      <label key={pt.slug} className="popover-option">
                        <input
                          type="radio"
                          name="hProductType"
                          checked={activeType === pt.slug || (!activeType && !pt.slug && !currentCategory)}
                          onChange={() => {
                            updateParam('type', pt.slug || null);
                            if (pt.slug) updateParam('category', pt.slug);
                            setOpenDropdown(null);
                          }}
                        />
                        <span>{pt.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Filter 2: Price Range Dropdown */}
            <div className="filter-dropdown-wrapper">
              <button
                type="button"
                className={`filter-pill ${minPriceParam || maxPriceParam ? 'filter-pill--active' : ''}`}
                onClick={() => toggleDropdown('price')}
              >
                <span>
                  {minPriceParam || maxPriceParam
                    ? PRICE_RANGES.find((r) => r.min === minPriceParam && r.max === maxPriceParam)?.label || 'Price'
                    : 'Price'}
                </span>
                <ChevronDown size={14} className={openDropdown === 'price' ? 'rotated' : ''} />
              </button>

              {openDropdown === 'price' && (
                <div className="filter-popover">
                  <div className="popover-title">Price Range</div>
                  <div className="popover-options">
                    {PRICE_RANGES.map((pr, idx) => (
                      <label key={idx} className="popover-option">
                        <input
                          type="radio"
                          name="hPriceRange"
                          checked={minPriceParam === pr.min && maxPriceParam === pr.max}
                          onChange={() => {
                            updateParam('minPrice', pr.min || null);
                            updateParam('maxPrice', pr.max || null);
                            setOpenDropdown(null);
                          }}
                        />
                        <span>{pr.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Filter 3: Color Dropdown */}
            <div className="filter-dropdown-wrapper">
              <button
                type="button"
                className={`filter-pill ${activeColor ? 'filter-pill--active' : ''}`}
                onClick={() => toggleDropdown('color')}
              >
                <span>{activeColor ? `Color: ${activeColor}` : 'Color'}</span>
                <ChevronDown size={14} className={openDropdown === 'color' ? 'rotated' : ''} />
              </button>

              {openDropdown === 'color' && (
                <div className="filter-popover filter-popover--colors">
                  <div className="popover-title">Filter by Color</div>
                  <div className="popover-colors-grid">
                    {COLOR_OPTIONS.map((c) => (
                      <button
                        key={c.label}
                        type="button"
                        className={`color-swatch-btn ${activeColor === c.label ? 'color-swatch-btn--active' : ''}`}
                        style={{ backgroundColor: c.hex, borderColor: c.border }}
                        onClick={() => {
                          updateParam('color', activeColor === c.label ? null : c.label);
                          setOpenDropdown(null);
                        }}
                        title={c.label}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Filter 4: Material Dropdown */}
            <div className="filter-dropdown-wrapper">
              <button
                type="button"
                className={`filter-pill ${activeMaterial ? 'filter-pill--active' : ''}`}
                onClick={() => toggleDropdown('material')}
              >
                <span>{activeMaterial || 'Material'}</span>
                <ChevronDown size={14} className={openDropdown === 'material' ? 'rotated' : ''} />
              </button>

              {openDropdown === 'material' && (
                <div className="filter-popover">
                  <div className="popover-title">Material</div>
                  <div className="popover-options">
                    {MATERIAL_OPTIONS.map((mat) => (
                      <label key={mat} className="popover-option">
                        <input
                          type="checkbox"
                          checked={activeMaterial === mat}
                          onChange={() => {
                            updateParam('material', activeMaterial === mat ? null : mat);
                            setOpenDropdown(null);
                          }}
                        />
                        <span>{mat}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Filter 5: Printing Type Dropdown */}
            <div className="filter-dropdown-wrapper">
              <button
                type="button"
                className={`filter-pill ${activePrintType ? 'filter-pill--active' : ''}`}
                onClick={() => toggleDropdown('printType')}
              >
                <span>{activePrintType || 'Printing Type'}</span>
                <ChevronDown size={14} className={openDropdown === 'printType' ? 'rotated' : ''} />
              </button>

              {openDropdown === 'printType' && (
                <div className="filter-popover">
                  <div className="popover-title">Printing Method</div>
                  <div className="popover-options">
                    {PRINTING_TYPES.map((pt) => (
                      <label key={pt} className="popover-option">
                        <input
                          type="checkbox"
                          checked={activePrintType === pt}
                          onChange={() => {
                            updateParam('printType', activePrintType === pt ? null : pt);
                            setOpenDropdown(null);
                          }}
                        />
                        <span>{pt}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Filter 6: Availability Dropdown */}
            <div className="filter-dropdown-wrapper">
              <button
                type="button"
                className={`filter-pill ${isCustomizableParam ? 'filter-pill--active' : ''}`}
                onClick={() => toggleDropdown('availability')}
              >
                <span>{isCustomizableParam ? 'Customizable Online' : 'Availability'}</span>
                <ChevronDown size={14} className={openDropdown === 'availability' ? 'rotated' : ''} />
              </button>

              {openDropdown === 'availability' && (
                <div className="filter-popover">
                  <div className="popover-title">Availability &amp; Design</div>
                  <div className="popover-options">
                    <label className="popover-option">
                      <input
                        type="checkbox"
                        checked={isCustomizableParam}
                        onChange={() => {
                          updateParam('isCustomizable', isCustomizableParam ? null : 'true');
                          setOpenDropdown(null);
                        }}
                      />
                      <span>Customizable in 2D Studio</span>
                    </label>
                    <label className="popover-option">
                      <input type="checkbox" defaultChecked />
                      <span>In Stock (Pan-India Dispatch)</span>
                    </label>
                  </div>
                </div>
              )}
            </div>

            {/* Reset All Filters Pill */}
            {hasActiveFilters && (
              <button
                type="button"
                className="filter-reset-pill"
                onClick={handleResetFilters}
              >
                <X size={13} />
                <span>Clear All</span>
              </button>
            )}
          </div>

          {/* Right Toolbar: Count & Sort Select */}
          <div className="filters-right">
            <span className="results-count-label">
              <strong>{totalCount || products.length}</strong> Results
            </span>

            <div className="sort-dropdown-box">
              <span className="sort-prefix">Sort by:</span>
              <select
                value={currentSort}
                onChange={(e) => updateParam('sortBy', e.target.value)}
                className="sort-select"
                aria-label="Sort products"
              >
                <option value="featured">Popular</option>
                <option value="newest">Newest</option>
                <option value="price_low">Price: Low to High</option>
                <option value="price_high">Price: High to Low</option>
                <option value="bestseller">Best Selling</option>
              </select>
            </div>
          </div>
        </div>

        {/* 5. FULL-WIDTH 4-COLUMN PRODUCT GRID */}
        {loading ? (
          <div className="pk-loading-state">
            <span className="spinner" style={{ width: 42, height: 42, color: '#15013F' }} />
            <p>Loading catalog items...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="pk-empty-state">
            <h3>No matching products found</h3>
            <p>Try resetting your filters or selecting a different category from above.</p>
            <button type="button" className="btn-reset-state" onClick={handleResetFilters}>
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="pk-fullwidth-grid">
            {/* FIRST CARD: "Create Your Own" Studio Card (from Reference Image) */}
            <div className="pk-create-card">
              <Link to={`/customize/${firstCustomizableSlug}`} className="create-card-inner">
                <div className="create-icon-badge">
                  <Sparkles size={26} color="#15013F" />
                </div>
                <h3 className="create-title">Create your own</h3>
                <p className="create-subtitle">Design from scratch with your artwork &amp; logo</p>
                <span className="create-cta-btn">
                  <span>Start Designing</span>
                  <ArrowRight size={14} />
                </span>
              </Link>
            </div>

            {/* PRODUCT CARDS */}
            {products.map((prod) => {
              const primaryImg =
                prod.images?.[0]?.url ||
                'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600';
              const secondaryImg = prod.images?.[1]?.url || primaryImg;
              const currentPrice = prod.salePrice || prod.basePrice;
              const inWish = isInWishlist(prod.id);

              return (
                <div key={prod.id} className="pk-card">
                  {/* Image Container with 2-Image Hover */}
                  <div className="pk-card-image-wrap">
                    <Link to={`/products/${prod.slug}`} className="image-link">
                      <img
                        src={primaryImg}
                        alt={prod.name}
                        className="card-img card-img--primary"
                        loading="lazy"
                      />
                      <img
                        src={secondaryImg}
                        alt={`${prod.name} alternate`}
                        className="card-img card-img--secondary"
                        loading="lazy"
                      />
                    </Link>

                    {/* Wishlist Heart Icon */}
                    <button
                      type="button"
                      className={`wishlist-heart ${inWish ? 'wishlist-heart--active' : ''}`}
                      onClick={(e) => {
                        e.preventDefault();
                        toggleWishlist(prod.id);
                      }}
                      aria-label={inWish ? 'Remove from wishlist' : 'Add to wishlist'}
                      title="Add to Wishlist"
                    >
                      <Heart
                        size={17}
                        fill={inWish ? '#AE1478' : 'none'}
                        color={inWish ? '#AE1478' : '#1E293B'}
                      />
                    </button>

                    {prod.isCustomizable && (
                      <div className="customizable-mini-badge">
                        <Sparkles size={11} />
                        <span>Customizable</span>
                      </div>
                    )}
                  </div>

                  {/* Card Body */}
                  <div className="pk-card-body">
                    {/* Price Row */}
                    <div className="price-row">
                      <span className="price-val">₹{currentPrice.toLocaleString('en-IN')}</span>
                      {prod.salePrice && prod.basePrice > prod.salePrice && (
                        <span className="price-orig">₹{prod.basePrice.toLocaleString('en-IN')}</span>
                      )}
                    </div>

                    {/* Title */}
                    <h4 className="card-product-title">
                      <Link to={`/products/${prod.slug}`}>{prod.name}</Link>
                    </h4>

                    {/* Rating */}
                    <div className="card-rating-row">
                      <div className="stars">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={11}
                            fill={i < Math.floor(prod.rating || 5) ? '#F59E0B' : 'none'}
                            stroke="#F59E0B"
                          />
                        ))}
                      </div>
                      <span className="rating-num">
                        {prod.rating ? prod.rating.toFixed(1) : '4.9'}
                      </span>
                    </div>

                    {/* Action Button */}
                    <Link
                      to={`/customize/${prod.slug}`}
                      className="card-customize-action"
                    >
                      <span>Customize</span>
                      <ArrowRight size={13} />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* 6. BOTTOM PAGINATION (only show when items are more than 15) */}
        {!loading && (totalCount > 15 || products.length > 15) && (
          <div className="pk-pagination-bar">
            <button type="button" className="pag-btn pag-btn--disabled">
              ‹
            </button>
            <button type="button" className="pag-btn pag-btn--active">
              1
            </button>
            <button type="button" className="pag-btn">
              2
            </button>
            <button type="button" className="pag-btn">
              3
            </button>
            <button type="button" className="pag-btn">
              ›
            </button>
          </div>
        )}

        {/* 7. BOTTOM CATEGORY EXPLORATION CIRCLES */}
        <div className="pk-bottom-exploration">
          <h3 className="section-title">Explore More Print Categories</h3>
          <div className="circles-row">
            {VISUAL_EXPLORER_ITEMS.map((cat) => (
              <button
                key={cat.slug}
                type="button"
                className="category-circle-item"
                onClick={() => updateParam('category', cat.slug)}
              >
                <div className="circle-thumb">
                  <img src={cat.image} alt={cat.name} loading="lazy" />
                </div>
                <span className="circle-name">{cat.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* 8. EDITORIAL SEO / CATEGORY INFORMATION SECTION */}
        <div className="pk-seo-info-box">
          <div className="seo-content">
            <h3>Custom Printing &amp; Personalization at PRINTKART24</h3>
            <p>
              Looking to elevate your brand merchandise or craft one-of-a-kind personalized gifts? PRINTKART24 offers industrial-grade digital UV printing, sublimation, screen printing, and precision laser engraving across thousands of items. From waterproof vinyl logo stickers and luxury business cards to ceramic photo mugs and custom corporate welcome kits, every order undergoes a complimentary pre-press digital proofing review by our master print team.
            </p>
            <p>
              Enjoy flexible order quantities with no mandatory minimums on select gifts, volume tiered wholesale discounts for corporate bulk buyers, and trackable express dispatch across 19,000+ PIN codes in India.
            </p>
          </div>
        </div>

        {/* 9. THE PRINTKART24 PROMISE BADGES */}
        <div className="pk-guarantee-ribbon">
          <div className="guarantee-col">
            <div className="icon-wrap">
              <Box size={28} strokeWidth={1.5} />
            </div>
            <h4>100% Satisfaction Guarantee</h4>
            <p>If your custom print isn’t picture-perfect, we’ll reprint it or refund you promptly.</p>
          </div>

          <div className="guarantee-col">
            <div className="icon-wrap">
              <Truck size={28} strokeWidth={1.5} />
            </div>
            <h4>Express Pan-India Delivery</h4>
            <p>Trackable door-to-door courier dispatch directly to your doorstep in 3–5 business days.</p>
          </div>

          <div className="guarantee-col">
            <div className="icon-wrap">
              <ShieldCheck size={28} strokeWidth={1.5} />
            </div>
            <h4>Pre-Press Review &amp; Proofing</h4>
            <p>Our in-house design specialists inspect alignment and DPI before your order hits the press.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductListingPage;
