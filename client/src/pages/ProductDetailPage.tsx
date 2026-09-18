import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ChevronRight,
  ChevronDown,
  ChevronLeft,
  Star,
  ShieldCheck,
  Truck,
  RotateCcw,
  Heart,
  Share2,
  Sparkles,
  ShoppingCart,
  Check,
  Eye,
  Gift,
  ThumbsUp,
  Tag,
  Info,
  X,
  Layers,
  Sparkle
} from 'lucide-react';
import api from '../services/api';
import { Product } from '../types';
import { useCartStore } from '../store/cartStore';
import { useWishlistStore } from '../store/wishlistStore';
import './ProductDetailPage.scss';

// Fallback multi-angle gallery views for rich Zazzle presentation
const MUG_GALLERY_FALLBACK = [
  {
    url: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=900&auto=format&fit=crop&q=85',
    label: 'Front View',
  },
  {
    url: 'https://images.unsplash.com/photo-1577937927133-66ef06acdf18?w=900&auto=format&fit=crop&q=85',
    label: 'Angled Handle View',
  },
  {
    url: 'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?w=900&auto=format&fit=crop&q=85',
    label: 'Morning Coffee Lifestyle',
  },
  {
    url: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=900&auto=format&fit=crop&q=85',
    label: 'Desk Workspace Setting',
  },
  {
    url: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=900&auto=format&fit=crop&q=85',
    label: 'Packaging Gift Box',
  },
  {
    url: 'https://images.unsplash.com/photo-1530630458144-014709e10016?w=900&auto=format&fit=crop&q=85',
    label: 'Dishwasher Safe Bottom Stamp',
  },
];

// Other designs you might like
const OTHER_DESIGNS = [
  {
    id: 'des-1',
    name: 'Vintage Botanical Ferns Ceramic Mug',
    slug: 'custom-ceramic-coffee-mug',
    image: 'https://images.unsplash.com/photo-1577937927133-66ef06acdf18?w=600&auto=format&fit=crop&q=80',
    rating: 4.9,
    reviews: 420,
    price: 299,
    originalPrice: 499,
  },
  {
    id: 'des-2',
    name: 'Pastel Sunflower Garden Coffee Mug',
    slug: 'custom-ceramic-coffee-mug',
    image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&auto=format&fit=crop&q=80',
    rating: 4.8,
    reviews: 312,
    price: 299,
    originalPrice: 499,
  },
  {
    id: 'des-3',
    name: 'Minimalist Monogram Modern Mug',
    slug: 'custom-ceramic-coffee-mug',
    image: 'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?w=600&auto=format&fit=crop&q=80',
    rating: 4.7,
    reviews: 189,
    price: 299,
    originalPrice: 499,
  },
  {
    id: 'des-4',
    name: 'Best Mom Ever Wildflower Floral Mug',
    slug: 'custom-ceramic-coffee-mug',
    image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&auto=format&fit=crop&q=80',
    rating: 5.0,
    reviews: 654,
    price: 329,
    originalPrice: 549,
  },
  {
    id: 'des-5',
    name: 'Retro Watercolor Wildflower Ceramic Mug',
    slug: 'custom-ceramic-coffee-mug',
    image: 'https://images.unsplash.com/photo-1530630458144-014709e10016?w=600&auto=format&fit=crop&q=80',
    rating: 4.9,
    reviews: 247,
    price: 299,
    originalPrice: 499,
  },
];

// Other products from this collection (Matching botanical motif)
const COLLECTION_PRODUCTS = [
  {
    id: 'col-1',
    name: 'Wildflowers Linen Canvas Tote Bag',
    category: 'Tote Bags',
    image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=600&auto=format&fit=crop&q=80',
    price: 399,
    originalPrice: 699,
  },
  {
    id: 'col-2',
    name: 'Wildflowers Ceramic Coaster Set (4-Pack)',
    category: 'Home & Living',
    image: 'https://images.unsplash.com/photo-1616401784845-180882ba9ba8?w=600&auto=format&fit=crop&q=80',
    price: 249,
    originalPrice: 399,
  },
  {
    id: 'col-3',
    name: 'Wildflowers Hardcover Executive Journal',
    category: 'Corporate Diaries',
    image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80',
    price: 349,
    originalPrice: 599,
  },
  {
    id: 'col-4',
    name: 'Wildflowers Stainless Insulated Flask',
    category: 'Custom Bottles',
    image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=600&auto=format&fit=crop&q=80',
    price: 599,
    originalPrice: 999,
  },
  {
    id: 'col-5',
    name: 'Wildflowers Satin Velvet Throw Cushion',
    category: 'Personalized Cushions',
    image: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=600&auto=format&fit=crop&q=80',
    price: 449,
    originalPrice: 799,
  },
  {
    id: 'col-6',
    name: 'Wildflowers Anti-Slip Desk Mat / Mousepad',
    category: 'Mouse Pads',
    image: 'https://images.unsplash.com/photo-1616353071588-708dcff912e2?w=600&auto=format&fit=crop&q=80',
    price: 299,
    originalPrice: 499,
  },
];

// Transfer design blanks
const TRANSFER_BLANKS = [
  {
    name: 'Classic T-Shirt',
    type: 'Apparel',
    image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=500&auto=format&fit=crop&q=80',
  },
  {
    name: 'Tall Latte Mug',
    type: 'Drinkware',
    image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=500&auto=format&fit=crop&q=80',
  },
  {
    name: 'Espresso Cup',
    type: 'Drinkware',
    image: 'https://images.unsplash.com/photo-1577937927133-66ef06acdf18?w=500&auto=format&fit=crop&q=80',
  },
  {
    name: 'Travel Tumbler',
    type: 'Drinkware',
    image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500&auto=format&fit=crop&q=80',
  },
  {
    name: 'Eco Canvas Tote',
    type: 'Bags',
    image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=500&auto=format&fit=crop&q=80',
  },
  {
    name: 'Water Bottle',
    type: 'Drinkware',
    image: 'https://images.unsplash.com/photo-1589365278144-c9e705f843ba?w=500&auto=format&fit=crop&q=80',
  },
];

// Customer Reviews sample data
const CUSTOMER_REVIEWS = [
  {
    id: 'rev-1',
    author: 'Jessica R.',
    verified: true,
    date: '15 August 2026',
    rating: 5,
    style: 'Classic White • 11 oz',
    title: 'Absolute perfection! Colors are so vivid and clear',
    comment:
      'I personalized this mug with my sister’s name for her 30th birthday and she squealed with joy! The print quality is razor-sharp, the ceramic has a nice heavy weight to it, and it has already been through the dishwasher ten times without any peeling or fading. 10/10 recommend Printkart24!',
    photos: [
      'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=400&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1577937927133-66ef06acdf18?w=400&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?w=400&auto=format&fit=crop&q=80',
    ],
    helpfulCount: 42,
  },
  {
    id: 'rev-2',
    author: 'David M.',
    verified: true,
    date: '02 August 2026',
    rating: 5,
    style: 'Two-Tone Blue • 15 oz',
    title: 'Top tier print quality, fast delivery!',
    comment:
      'Ordered 5 of these for our small design studio team with individual names. Delivery to Bengaluru took just 3 days and every single piece was securely bubble-wrapped. The colors pop and the finish is smooth as silk.',
    photos: [
      'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1530630458144-014709e10016?w=400&auto=format&fit=crop&q=80',
    ],
    helpfulCount: 28,
  },
  {
    id: 'rev-3',
    author: 'Priya K.',
    verified: true,
    date: '24 July 2026',
    rating: 5,
    style: 'Magic Heat Reveal Mug • 11 oz',
    title: 'Magical gift for my mom',
    comment:
      'The floral artwork is gorgeous. When hot coffee is poured, the design reveals beautifully from dark matte to vibrant blue wildflowers. My mom absolutely loved it!',
    photos: [
      'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=400&auto=format&fit=crop&q=80',
    ],
    helpfulCount: 19,
  },
];

// Customer Photos Strip (real buyer photos)
const BUYER_PHOTOS = [
  'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=300&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1577937927133-66ef06acdf18?w=300&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?w=300&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=300&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=300&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1530630458144-014709e10016?w=300&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=300&auto=format&fit=crop&q=80',
];

export const ProductDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  // Stores
  const { addItem } = useCartStore();
  const { toggleWishlist, isInWishlist } = useWishlistStore();

  // Data states
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Gallery & Image states
  const [activeImageIdx, setActiveImageIdx] = useState(0);

  // Options states
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState('White');
  const [selectedStyle, setSelectedStyle] = useState('Classic White');
  const [selectedSize, setSelectedSize] = useState('11 oz');

  // UI States
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [addedSuccess, setAddedSuccess] = useState(false);
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
  const [shareToast, setShareToast] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [pincode, setPincode] = useState('');
  const [pincodeResult, setPincodeResult] = useState<string | null>(null);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubmitted, setNewsletterSubmitted] = useState(false);

  // Carousel refs for smooth scrolling
  const designsScrollRef = useRef<HTMLDivElement>(null);
  const collectionScrollRef = useRef<HTMLDivElement>(null);

  // Color Swatches Configuration
  const colorSwatches = [
    { label: 'White', hex: '#FFFFFF', border: '#D1D5DB' },
    { label: 'Classic Navy', hex: '#0B132B', border: '#0B132B' },
    { label: 'Forest Green', hex: '#1E392A', border: '#1E392A' },
    { label: 'Sleek Black', hex: '#111827', border: '#111827' },
    { label: 'Crimson Red', hex: '#991B1B', border: '#991B1B' },
    { label: 'Canary Yellow', hex: '#EAB308', border: '#EAB308' },
  ];

  // Style Options with miniature photos
  const styleOptions = [
    {
      name: 'Classic White',
      extraPrice: 0,
      image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=160&auto=format&fit=crop&q=80',
    },
    {
      name: 'Two-Tone Blue',
      extraPrice: 40,
      image: 'https://images.unsplash.com/photo-1577937927133-66ef06acdf18?w=160&auto=format&fit=crop&q=80',
    },
    {
      name: 'Magic Heat Reveal',
      extraPrice: 120,
      image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=160&auto=format&fit=crop&q=80',
    },
    {
      name: 'Frosted Beer Stein',
      extraPrice: 150,
      image: 'https://images.unsplash.com/photo-1530630458144-014709e10016?w=160&auto=format&fit=crop&q=80',
    },
  ];

  // Size Options
  const sizeOptions = [
    { name: '11 oz', label: '11 oz (330ml)', extraPrice: 0 },
    { name: '15 oz', label: '15 oz (450ml)', extraPrice: 80 },
  ];

  // Fetch Product Data
  useEffect(() => {
    async function fetchProduct() {
      if (!slug) return;
      setLoading(true);
      try {
        const res = await api.get(`/products/${slug}`);
        if (res.data.success) {
          setProduct(res.data.data.product);
          setRelatedProducts(res.data.data.relatedProducts || []);
          setActiveImageIdx(0);
        }
      } catch (err) {
        console.error('Error fetching product:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchProduct();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [slug]);

  // Gallery images: prefer product.images if multiple, otherwise enrich with high-res views
  const galleryImages = useMemo(() => {
    if (product?.images && product.images.length >= 3) {
      return product.images.map((img) => ({
        url: img.url,
        label: img.altText || product.name,
      }));
    }
    if (product?.images && product.images.length > 0) {
      const primaryUrl = product.images[0].url;
      const secondaryUrl = product.images[1]?.url || primaryUrl;
      return [
        { url: primaryUrl, label: 'Front View' },
        { url: secondaryUrl, label: 'Angled Handle View' },
        ...MUG_GALLERY_FALLBACK.slice(2),
      ];
    }
    return MUG_GALLERY_FALLBACK;
  }, [product]);

  // Dynamic Pricing Calculation
  const { unitPrice, originalPrice, totalPrice, volumeDiscountPercent } = useMemo(() => {
    const base = product?.salePrice || product?.basePrice || 299;
    const styleExtra = styleOptions.find((s) => s.name === selectedStyle)?.extraPrice || 0;
    const sizeExtra = sizeOptions.find((s) => s.name === selectedSize)?.extraPrice || 0;

    // Volume discount tiers
    let discountRate = 0;
    if (quantity >= 25) discountRate = 0.25;
    else if (quantity >= 10) discountRate = 0.2;
    else if (quantity >= 5) discountRate = 0.15;
    else if (quantity >= 2) discountRate = 0.1;

    const baseUnit = base + styleExtra + sizeExtra;
    const discountedUnit = Math.round(baseUnit * (1 - discountRate));
    const total = discountedUnit * quantity;
    const strike = Math.round((baseUnit + 200) * 1.25);

    return {
      unitPrice: discountedUnit,
      originalPrice: strike,
      totalPrice: total,
      volumeDiscountPercent: Math.round(discountRate * 100),
    };
  }, [product, selectedStyle, selectedSize, quantity]);

  // Wishlist helper
  const inWishlist = product ? isInWishlist(product.id) : false;

  const handleWishlistToggle = async () => {
    if (!product) return;
    await toggleWishlist(product.id);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setShareToast(true);
    setTimeout(() => setShareToast(false), 2500);
  };

  const handlePincodeCheck = (e: React.FormEvent) => {
    e.preventDefault();
    if (pincode.length === 6 && /^\d+$/.test(pincode)) {
      const deliveryDate = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString('en-IN', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
      });
      setPincodeResult(`Delivery to ${pincode}: Guaranteed by ${deliveryDate} (Free Express Dispatch)`);
    } else {
      setPincodeResult('Please enter a valid 6-digit Indian PIN code');
    }
  };

  const handleAddToCart = async () => {
    if (!product) return;
    setIsAddingToCart(true);

    const success = await addItem({
      productId: product.id,
      quantity,
      unitPrice,
      totalPrice,
      configuration: {
        Color: selectedColor,
        Style: selectedStyle,
        Size: selectedSize,
      },
    });

    setIsAddingToCart(false);
    if (success) {
      setAddedSuccess(true);
      setTimeout(() => setAddedSuccess(false), 3000);
    }
  };

  const handlePersonalize = () => {
    if (!product) return;
    navigate(`/customize/${product.slug}`, {
      state: {
        configuration: {
          Color: selectedColor,
          Style: selectedStyle,
          Size: selectedSize,
        },
        quantity,
        unitPrice,
      },
    });
  };

  const scrollCarousel = (ref: React.RefObject<HTMLDivElement | null>, direction: 'left' | 'right') => {
    if (ref.current) {
      const scrollAmount = direction === 'left' ? -360 : 360;
      ref.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const scrollToReviews = (e: React.MouseEvent) => {
    e.preventDefault();
    const reviewsEl = document.getElementById('customer-reviews-section');
    if (reviewsEl) {
      reviewsEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (loading) {
    return (
      <div className="pk-detail-page container" style={{ padding: '8rem 0', textAlign: 'center' }}>
        <span className="spinner" style={{ width: 44, height: 44, color: '#1E60D5' }} />
        <p style={{ marginTop: '1.25rem', color: '#64748B', fontSize: '1.1rem' }}>
          Loading your custom design & options...
        </p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="pk-detail-page container" style={{ padding: '8rem 0', textAlign: 'center' }}>
        <h2 style={{ fontSize: '2rem', color: '#0B132B' }}>Product Not Found</h2>
        <p style={{ color: '#64748B', marginTop: '0.5rem' }}>
          The requested design could not be found in the catalog.
        </p>
        <Link
          to="/products"
          style={{
            display: 'inline-block',
            marginTop: '1.5rem',
            padding: '0.75rem 1.75rem',
            background: '#192A7C',
            color: '#FFFFFF',
            borderRadius: '9999px',
            fontWeight: 600,
          }}
        >
          Browse All Products →
        </Link>
      </div>
    );
  }

  const currentImage = galleryImages[activeImageIdx]?.url || galleryImages[0]?.url;

  return (
    <div className="pk-detail-page">
      {/* Toast Notification for Share */}
      {shareToast && (
        <div className="pk-share-toast">
          <Check size={16} /> Product link copied to clipboard!
        </div>
      )}

      <div className="container">
        {/* Breadcrumb Navigation */}
        <nav className="pk-detail-breadcrumb" aria-label="Breadcrumb">
          <Link to="/">Home</Link>
          <span className="sep"><ChevronRight size={13} /></span>
          <Link to="/products">Products</Link>
          {product.category && (
            <>
              <span className="sep"><ChevronRight size={13} /></span>
              <Link to={`/products?category=${product.category.slug}`}>
                {product.category.name}
              </Link>
            </>
          )}
          <span className="sep"><ChevronRight size={13} /></span>
          <span className="current">{product.name}</span>
        </nav>

        {/* 1. TOP MAIN SHOWCASE (2 Columns) */}
        <div className="pk-showcase-grid">
          {/* LEFT: Multi-Angle Vertical Gallery */}
          <div className="pk-gallery-col">
            <div className="pk-vertical-thumbs">
              {galleryImages.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  className={`thumb-item ${activeImageIdx === idx ? 'thumb-item--active' : ''}`}
                  onClick={() => setActiveImageIdx(idx)}
                  onMouseEnter={() => setActiveImageIdx(idx)}
                  aria-label={`View ${img.label}`}
                >
                  <img src={img.url} alt={img.label} />
                </button>
              ))}
              {galleryImages.length > 5 && (
                <button
                  type="button"
                  className="thumb-down-arrow"
                  onClick={() => setActiveImageIdx((prev) => (prev + 1) % galleryImages.length)}
                  title="Next View"
                >
                  <ChevronDown size={18} />
                </button>
              )}
            </div>

            {/* Main Stage Image */}
            <div className="pk-main-stage">
              <img src={currentImage} alt={product.name} />

              {/* Floating Action Badges (Top Right) */}
              <div className="stage-actions">
                <button
                  type="button"
                  className={`stage-action-btn ${inWishlist ? 'stage-action-btn--active' : ''}`}
                  onClick={handleWishlistToggle}
                  title={inWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
                  aria-label="Wishlist"
                >
                  <Heart size={20} fill={inWishlist ? '#E11D48' : 'none'} color={inWishlist ? '#E11D48' : '#1E293B'} />
                </button>

                <button
                  type="button"
                  className="stage-action-btn"
                  onClick={handleShare}
                  title="Share this design"
                  aria-label="Share"
                >
                  <Share2 size={19} color="#1E293B" />
                </button>
              </div>

              {/* Angle View Tag Indicator */}
              <div className="stage-indicator">
                {galleryImages[activeImageIdx]?.label || 'Original View'}
              </div>
            </div>
          </div>

          {/* RIGHT: Product Details, Configurator & CTAs */}
          <div className="pk-details-col">
            {/* Price Header Row */}
            <div className="pk-price-block">
              <div className="price-values">
                <span className="current-price">₹{unitPrice.toFixed(2)}</span>
                <span className="original-price">₹{originalPrice.toFixed(2)}</span>
              </div>
              <div className="discount-callout">
                40% Off with code <strong>WELCOME10</strong>
              </div>
            </div>

            {/* Product Title */}
            <h1 className="pk-product-title">{product.name}</h1>

            {/* Maker Byline & Reviews Link */}
            <div className="pk-meta-row">
              <span className="maker-tag">
                Sold by <strong>Printkart24 Studio</strong> • Verified Brand
              </span>
              <a href="#customer-reviews-section" className="rating-link" onClick={scrollToReviews}>
                <div className="gold-stars">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={15} fill="#F59E0B" stroke="#F59E0B" />
                  ))}
                </div>
                <span className="score-num">4.8</span>
                <span className="review-count">(2,058 reviews)</span>
              </a>
            </div>

            {/* Bulk Volume Savings Callout Banner */}
            <div className="pk-volume-callout" onClick={() => setIsBulkModalOpen(!isBulkModalOpen)}>
              <span className="callout-icon"><Gift size={16} /></span>
              <span className="callout-text">
                Order 2 or more and save up to 25% (Volume Pricing Available)
              </span>
              <ChevronDown size={16} style={{ transform: isBulkModalOpen ? 'rotate(180deg)' : 'none', transition: '0.2s' }} />
            </div>

            {/* Volume Pricing Accordion Table */}
            {isBulkModalOpen && (
              <div className="pk-bulk-table-dropdown">
                <table>
                  <thead>
                    <tr>
                      <th>Quantity</th>
                      <th>Per Piece</th>
                      <th>Savings</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>1 - 4 pcs</td>
                      <td>₹{unitPrice}</td>
                      <td>Standard</td>
                    </tr>
                    <tr>
                      <td>5 - 9 pcs</td>
                      <td>₹{Math.round(unitPrice * 0.9)}</td>
                      <td className="save-tag">Save 10%</td>
                    </tr>
                    <tr>
                      <td>10 - 24 pcs</td>
                      <td>₹{Math.round(unitPrice * 0.8)}</td>
                      <td className="save-tag">Save 20%</td>
                    </tr>
                    <tr>
                      <td>25+ pcs</td>
                      <td>₹{Math.round(unitPrice * 0.75)}</td>
                      <td className="save-tag">Save 25% (Best Deal)</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}

            {/* Quantity Stepper & Dual Action Buttons */}
            <div className="pk-action-row">
              <div className="pk-qty-picker">
                <button
                  type="button"
                  className="qty-btn"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  disabled={quantity <= 1}
                >
                  -
                </button>
                <input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  className="qty-input"
                  aria-label="Quantity"
                />
                <button
                  type="button"
                  className="qty-btn"
                  onClick={() => setQuantity((q) => q + 1)}
                >
                  +
                </button>
              </div>

              {/* Yellow Add to Cart CTA */}
              <button
                type="button"
                className={`pk-btn-add-cart ${addedSuccess ? 'pk-btn-add-cart--success' : ''}`}
                onClick={handleAddToCart}
                disabled={isAddingToCart}
              >
                {addedSuccess ? (
                  <>
                    <Check size={18} /> Added to Cart!
                  </>
                ) : isAddingToCart ? (
                  <>Adding...</>
                ) : (
                  <>
                    <ShoppingCart size={18} /> Add to Cart
                  </>
                )}
              </button>
            </div>

            {/* Deep Royal Blue "Personalize this design" CTA */}
            <button
              type="button"
              className="pk-btn-personalize"
              onClick={handlePersonalize}
            >
              <Sparkles size={18} /> Personalize this design
            </button>

            {/* Shipping & Guarantee Highlight */}
            <div className="pk-shipping-perks">
              <div className="perk-item">
                <Truck size={17} color="#1E60D5" />
                <span>
                  <strong>Free Shipping</strong> on orders above ₹999 • Express Dispatch in 2–4 Business Days
                </span>
              </div>
              <div className="perk-item">
                <ShieldCheck size={17} color="#10B981" />
                <span>
                  <strong>100% Satisfaction Guarantee</strong> • Free replacement if damaged in transit
                </span>
              </div>
            </div>

            {/* Inline Pincode Delivery Check */}
            <div className="pk-pincode-check">
              <form onSubmit={handlePincodeCheck} className="pincode-form">
                <input
                  type="text"
                  placeholder="Enter 6-digit Delivery Pincode"
                  maxLength={6}
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                />
                <button type="submit">Check</button>
              </form>
              {pincodeResult && <div className="pincode-result">{pincodeResult}</div>}
            </div>

            <hr className="pk-divider" />

            {/* Options Configurator */}
            <div className="pk-options-configurator">
              {/* 1. Handle / Rim Color Swatches */}
              <div className="config-group">
                <div className="group-label">
                  <span className="label-title">Handle Color:</span>
                  <span className="label-val">{selectedColor}</span>
                </div>
                <div className="swatches-row">
                  {colorSwatches.map((color) => (
                    <button
                      key={color.label}
                      type="button"
                      className={`swatch-btn ${selectedColor === color.label ? 'swatch-btn--active' : ''}`}
                      style={{ backgroundColor: color.hex, borderColor: color.border }}
                      onClick={() => setSelectedColor(color.label)}
                      title={color.label}
                      aria-label={color.label}
                    />
                  ))}
                </div>
              </div>

              {/* 2. Style / Model Visual Tiles */}
              <div className="config-group">
                <div className="group-label">
                  <span className="label-title">Style:</span>
                  <span className="label-val">{selectedStyle}</span>
                </div>
                <div className="style-tiles-grid">
                  {styleOptions.map((style) => {
                    const isSelected = selectedStyle === style.name;
                    return (
                      <button
                        key={style.name}
                        type="button"
                        className={`style-tile ${isSelected ? 'style-tile--active' : ''}`}
                        onClick={() => setSelectedStyle(style.name)}
                      >
                        <div className="tile-thumb">
                          <img src={style.image} alt={style.name} />
                        </div>
                        <div className="tile-name">{style.name}</div>
                        {style.extraPrice > 0 && (
                          <div className="tile-extra">+₹{style.extraPrice}</div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 3. Size Pills */}
              <div className="config-group">
                <div className="group-label">
                  <span className="label-title">Size:</span>
                  <span className="label-val">{selectedSize}</span>
                </div>
                <div className="size-pills-row">
                  {sizeOptions.map((sz) => {
                    const isSelected = selectedSize === sz.name;
                    return (
                      <button
                        key={sz.name}
                        type="button"
                        className={`size-pill ${isSelected ? 'size-pill--active' : ''}`}
                        onClick={() => setSelectedSize(sz.name)}
                      >
                        {sz.label}
                        {sz.extraPrice > 0 && ` (+₹${sz.extraPrice})`}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 2. CAROUSEL: "Other designs you might like" */}
        <section className="pk-carousel-section">
          <div className="section-header">
            <h2>Other designs you might like</h2>
            <div className="carousel-nav-arrows">
              <button
                type="button"
                className="nav-arrow"
                onClick={() => scrollCarousel(designsScrollRef, 'left')}
                aria-label="Scroll left"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                type="button"
                className="nav-arrow"
                onClick={() => scrollCarousel(designsScrollRef, 'right')}
                aria-label="Scroll right"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>

          <div className="carousel-track" ref={designsScrollRef}>
            {OTHER_DESIGNS.map((item) => (
              <div key={item.id} className="carousel-card">
                <Link to={`/products/${item.slug}`} className="card-thumb-link">
                  <img src={item.image} alt={item.name} />
                </Link>
                <div className="card-info">
                  <h3 className="card-title">
                    <Link to={`/products/${item.slug}`}>{item.name}</Link>
                  </h3>
                  <div className="card-stars">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={12} fill="#F59E0B" stroke="#F59E0B" />
                    ))}
                    <span className="rating-num">{item.rating}</span>
                    <span className="rev-num">({item.reviews})</span>
                  </div>
                  <div className="card-price">
                    <span className="price-val">₹{item.price.toFixed(2)}</span>
                    <span className="orig-val">₹{item.originalPrice.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 3. CAROUSEL: "Other products from this collection" */}
        <section className="pk-carousel-section">
          <div className="section-header">
            <div>
              <h2>Other products from this collection</h2>
              <p className="collection-sub">Wild Blue Wildflowers Botanical Collection</p>
            </div>
            <div className="carousel-nav-arrows">
              <button
                type="button"
                className="nav-arrow"
                onClick={() => scrollCarousel(collectionScrollRef, 'left')}
                aria-label="Scroll left"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                type="button"
                className="nav-arrow"
                onClick={() => scrollCarousel(collectionScrollRef, 'right')}
                aria-label="Scroll right"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>

          <div className="carousel-track" ref={collectionScrollRef}>
            {COLLECTION_PRODUCTS.map((prod) => (
              <div key={prod.id} className="carousel-card">
                <div className="card-thumb-link">
                  <img src={prod.image} alt={prod.name} />
                </div>
                <div className="card-info">
                  <span className="card-category">{prod.category}</span>
                  <h3 className="card-title">{prod.name}</h3>
                  <div className="card-price">
                    <span className="price-val">₹{prod.price.toFixed(2)}</span>
                    <span className="orig-val">₹{prod.originalPrice.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 4. "Transfer design to a product" BLANKS ROW */}
        <section className="pk-transfer-section">
          <div className="section-header">
            <h2>Transfer design to a product</h2>
            <p className="transfer-sub">Apply this floral artwork to any blank product instantly</p>
          </div>

          <div className="transfer-grid">
            {TRANSFER_BLANKS.map((blank, i) => (
              <div
                key={i}
                className="transfer-item"
                onClick={() => navigate(`/customize/${product.slug}`)}
                title={`Transfer artwork to ${blank.name}`}
              >
                <div className="blank-img-wrap">
                  <img src={blank.image} alt={blank.name} />
                  <span className="transfer-badge">
                    <Sparkle size={12} /> Apply
                  </span>
                </div>
                <div className="blank-name">{blank.name}</div>
                <div className="blank-type">{blank.type}</div>
              </div>
            ))}
          </div>
        </section>

        {/* 5. TWO-COLUMN PRODUCT SPECS & DESIGN STORY BOX */}
        <div className="pk-two-col-info">
          {/* Card 1: About Mugs (Specs) */}
          <div className="info-box">
            <div className="box-header">
              <div>
                <h3>About Mugs</h3>
                <p className="box-sub">Ceramic Mug Specifications & Care</p>
              </div>
              <img
                src="https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=100&auto=format&fit=crop&q=80"
                alt="Ceramic Mug specs preview"
                className="box-icon-thumb"
              />
            </div>

            <ul className="specs-list">
              <li>
                <strong>Dimensions:</strong> 3.8" height x 3.2" diameter (11 oz) / 4.5" height x 3.4" diameter (15 oz)
              </li>
              <li>
                <strong>Capacity:</strong> 11 fl oz / 330 ml (or 15 fl oz / 450 ml)
              </li>
              <li>
                <strong>Material:</strong> 100% Food-Grade Ceramic with brilliant glossy white protective glaze
              </li>
              <li>
                <strong>Durability:</strong> Microwave & dishwasher safe (top rack recommended)
              </li>
              <li>
                <strong>Print Process:</strong> 360° High-Definition dye-sublimation wrap, razor-sharp photographic print, fade-resistant
              </li>
              <li>
                <strong>Safety:</strong> Meets or exceeds FDA, BIS & ISO food contact standards
              </li>
              <li>
                <strong>Production:</strong> Printed on demand & quality checked with care in India
              </li>
            </ul>
          </div>

          {/* Card 2: About the Design */}
          <div className="info-box">
            <div className="box-header">
              <div>
                <h3>About the Design</h3>
                <p className="box-sub">Wild Blue Wildflowers & Botanical Flourish</p>
              </div>
              <img
                src="https://images.unsplash.com/photo-1577937927133-66ef06acdf18?w=100&auto=format&fit=crop&q=80"
                alt="Pattern Swatch"
                className="box-icon-thumb"
              />
            </div>

            <p className="design-story-text">
              Bring a touch of charming countryside blooms into your daily coffee ritual. Featuring delicate forget-me-nots, cornflowers, and lush leafy stems, this design can be effortlessly customized with your own name, monogram, or inspirational quote. Perfect for bridal showers, birthday gifts, or quiet morning tea.
            </p>

            <div className="designer-card">
              <div className="designer-avatar">
                PK
              </div>
              <div className="designer-meta">
                <div className="designer-name">Printkart24 Creative Studio</div>
                <div className="designer-stats">Verified Artist • 14.8k followers</div>
              </div>
              <button
                type="button"
                className={`btn-follow ${isFollowing ? 'btn-follow--active' : ''}`}
                onClick={() => setIsFollowing(!isFollowing)}
              >
                {isFollowing ? 'Following' : 'Follow'}
              </button>
            </div>
          </div>
        </div>

        {/* 6. CUSTOMER REVIEWS & COMMUNITY GALLERY */}
        <section className="pk-reviews-section" id="customer-reviews-section">
          <h2 className="reviews-main-title">Customer Reviews</h2>

          {/* Rating Summary Scorecard */}
          <div className="pk-scorecard">
            <div className="score-big-col">
              <div className="big-number">4.8</div>
              <div className="gold-stars">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={18} fill="#F59E0B" stroke="#F59E0B" />
                ))}
              </div>
              <div className="total-revs-label">2,058 reviews</div>
            </div>

            {/* Star Breakdown Bars */}
            <div className="score-bars-col">
              {[
                { star: 5, pct: 82 },
                { star: 4, pct: 12 },
                { star: 3, pct: 4 },
                { star: 2, pct: 1 },
                { star: 1, pct: 1 },
              ].map((row) => (
                <div key={row.star} className="star-bar-row">
                  <span className="star-label">{row.star} ★</span>
                  <div className="progress-track">
                    <div className="progress-fill" style={{ width: `${row.pct}%` }} />
                  </div>
                  <span className="star-pct">{row.pct}%</span>
                </div>
              ))}
            </div>

            {/* Filter & Sort Controls */}
            <div className="score-filters-col">
              <label>
                Filter by:
                <select aria-label="Filter reviews by rating">
                  <option value="all">All Stars (2,058)</option>
                  <option value="5">5 Stars only (1,687)</option>
                  <option value="photo">With photos (184)</option>
                </select>
              </label>

              <label>
                Sort by:
                <select aria-label="Sort reviews by order">
                  <option value="helpful">Most Helpful</option>
                  <option value="recent">Most Recent</option>
                  <option value="highest">Highest Rating</option>
                </select>
              </label>
            </div>
          </div>

          {/* Customer Photos Horizontal Strip */}
          <div className="pk-buyer-photos-block">
            <div className="photos-header">
              <h3>Customer photos</h3>
              <button type="button" className="see-all-photos-btn">
                See all review photos (184)
              </button>
            </div>
            <div className="buyer-photos-strip">
              {BUYER_PHOTOS.map((src, i) => (
                <div key={i} className="buyer-photo-thumb">
                  <img src={src} alt={`Real customer mug review photo ${i + 1}`} />
                </div>
              ))}
            </div>
          </div>

          {/* Individual Customer Review Cards */}
          <div className="pk-review-cards-list">
            {CUSTOMER_REVIEWS.map((rev) => (
              <div key={rev.id} className="pk-review-card">
                <div className="card-top-row">
                  <div className="author-info">
                    <span className="author-name">{rev.author}</span>
                    {rev.verified && <span className="verified-badge">Verified Buyer</span>}
                  </div>
                  <span className="rev-date">{rev.date}</span>
                </div>

                <div className="rev-sub-row">
                  <div className="stars-row">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} size={14} fill="#F59E0B" stroke="#F59E0B" />
                    ))}
                  </div>
                  <span className="rev-style-tag">{rev.style}</span>
                </div>

                <h4 className="rev-title">{rev.title}</h4>
                <p className="rev-body">{rev.comment}</p>

                {rev.photos && rev.photos.length > 0 && (
                  <div className="rev-user-photos">
                    {rev.photos.map((pUrl, idx) => (
                      <img key={idx} src={pUrl} alt="Review attachment" />
                    ))}
                  </div>
                )}

                <div className="rev-footer-row">
                  <button type="button" className="btn-helpful">
                    <ThumbsUp size={14} /> Helpful ({rev.helpfulCount})
                  </button>
                  <button type="button" className="btn-report">
                    Report
                  </button>
                </div>
              </div>
            ))}

            <div className="load-more-reviews-row">
              <button type="button" className="btn-more-reviews">
                View all 2,058 reviews
              </button>
            </div>
          </div>
        </section>

        {/* 7. TAGS SECTION */}
        <section className="pk-tags-section">
          <h3>Tags</h3>
          <div className="tags-list">
            {[
              'floral mug',
              'wildflowers',
              'personalized gifts',
              'custom coffee mug',
              'botanical pattern',
              'bridesmaid gift',
              'gift for her',
              'custom ceramic mug',
              'blue flowers',
              'coffee lovers',
              'printkart24 studio',
            ].map((tag, idx) => (
              <Link key={idx} to={`/products?q=${encodeURIComponent(tag)}`} className="tag-pill">
                #{tag}
              </Link>
            ))}
          </div>
        </section>

        {/* 8. OTHER INFO SECTION */}
        <section className="pk-other-info-section">
          <h3>Other Info</h3>
          <div className="info-meta-grid">
            <div className="meta-item">
              <span className="item-label">Product SKU:</span>
              <span className="item-value">{product.sku || 'PK24-MUG-WLD-11'}</span>
            </div>
            <div className="meta-item">
              <span className="item-label">Printed & Dispatched by:</span>
              <span className="item-value">Printkart24 Certified Printing Hub (Noida & Bengaluru)</span>
            </div>
            <div className="meta-item">
              <span className="item-label">Replacement Policy:</span>
              <span className="item-value">100% Free Replacement for Transit Breakage</span>
            </div>
            <div className="meta-item">
              <span className="item-label">Safe Packaging:</span>
              <span className="item-value">Shock-absorbent Thermocol & Kraft Mailer Box</span>
            </div>
          </div>
        </section>

        {/* 9. NEWSLETTER / EXCLUSIVE OFFERS PRE-FOOTER */}
        <section className="pk-newsletter-prefooter">
          <div className="prefooter-inner">
            <div className="prefooter-text">
              <h3>GET EXCLUSIVE DEALS</h3>
              <p>Sign up to receive secret discounts, special holiday offers, and new release alerts.</p>
            </div>
            <form
              className="prefooter-form"
              onSubmit={(e) => {
                e.preventDefault();
                if (newsletterEmail) {
                  setNewsletterSubmitted(true);
                  setNewsletterEmail('');
                }
              }}
            >
              <input
                type="email"
                placeholder="Your email address"
                required
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
              />
              <button type="submit">Sign up now</button>
            </form>
            {newsletterSubmitted && (
              <div className="prefooter-success">
                <Check size={16} /> Thank you for subscribing! Check your inbox for your 10% welcome coupon.
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};
