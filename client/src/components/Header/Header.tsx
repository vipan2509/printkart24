import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Search,
  ShoppingCart,
  Heart,
  User as UserIcon,
  X,
  Menu,
  ChevronDown,
  ChevronRight,
  ArrowLeft,
  LayoutDashboard,
  Package,
  ShieldCheck,
  LogOut,
  Sparkles,
  ArrowRight,
  Gift,
  Box,
  Layers,
  FileText,
  Tag,
  PhoneCall
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useCartStore } from '../../store/cartStore';
import { useWishlistStore } from '../../store/wishlistStore';
import api from '../../services/api';
import { Product, Category } from '../../types';
import './Header.scss';

// =========================================================================
// MEGA MENU DATA STRUCTURE (Matching Prompt Specifications 2, 3, 4, 5, 6)
// =========================================================================

interface NavCategory {
  id: 'corporate' | 'personalized' | 'packaging' | 'combo' | 'stickers';
  name: string;
  href: string;
  subcategories: { name: string; href: string; badge?: string }[];
  featuredTitle?: string;
  viewAllText: string;
  viewAllHref: string;
}

const NAV_DATA: Record<string, NavCategory> = {
  corporate: {
    id: 'corporate',
    name: 'Corporate Gifts',
    href: '/products?category=corporate-gifts',
    subcategories: [
      { name: 'Mugs / Bottles', href: '/products?category=photo-mugs' },
      { name: 'Business Cards', href: '/products?category=business-cards' },
      { name: 'T-Shirts', href: '/products?category=custom-tshirts' },
      { name: 'Card Holders', href: '/products?category=card-holders' },
      { name: 'Keychains', href: '/products?category=keychains' },
      { name: 'Pens', href: '/products?category=executive-pens' },
      { name: 'Diaries / Notepads', href: '/products?category=corporate-diaries' },
    ],
    viewAllText: 'View All Corporate Gifts',
    viewAllHref: '/products?category=corporate-gifts',
  },
  personalized: {
    id: 'personalized',
    name: 'Personalized Gifts',
    href: '/products?category=personalized-gifts',
    subcategories: [
      { name: 'Mugs', href: '/products?category=photo-mugs' },
      { name: 'Photo Frames', href: '/products?category=photo-frames' },
      { name: 'T-Shirts', href: '/products?category=custom-tshirts' },
      { name: 'Cushions', href: '/products?category=personalized-cushions' },
    ],
    viewAllText: 'View All Personalized Gifts',
    viewAllHref: '/products?category=personalized-gifts',
  },
  packaging: {
    id: 'packaging',
    name: 'Packaging',
    href: '/products?category=packaging-boxes',
    subcategories: [
      { name: 'Disposable Cups with Brand Name', href: '/products?category=coffee-cups', badge: 'High Volume' },
      { name: 'Rigid Magnetic Boxes', href: '/products?category=packaging-boxes' },
      { name: 'Luxury Kraft Paper Bags', href: '/products?category=paper-bags' },
      { name: 'Custom Mailing Envelopes', href: '/products?category=envelopes' },
    ],
    viewAllText: 'View All Packaging Products',
    viewAllHref: '/products?category=packaging-boxes',
  },
  combo: {
    id: 'combo',
    name: 'Combo Gifts',
    href: '/products?category=corporate-gift-sets',
    subcategories: [
      { name: 'Laptop Bag', href: '/products?category=corporate-gift-sets' },
      { name: 'Bottle', href: '/products?category=custom-bottles' },
      { name: 'Diary', href: '/products?category=corporate-diaries' },
      { name: 'Pen', href: '/products?category=executive-pens' },
      { name: 'Keychain', href: '/products?category=keychains' },
      { name: 'Card Holder', href: '/products?category=card-holders' },
    ],
    viewAllText: 'View All Combo Kits',
    viewAllHref: '/products?category=corporate-gift-sets',
  },
  stickers: {
    id: 'stickers',
    name: 'Stickers',
    href: '/products?category=stickers-labels',
    subcategories: [
      { name: 'Logo Stickers', href: '/products?category=stickers-labels&type=logo' },
      { name: 'Product Labels', href: '/products?category=stickers-labels&type=labels' },
      { name: 'Custom Stickers', href: '/products?category=stickers-labels&type=custom' },
      { name: 'Business Stickers', href: '/products?category=stickers-labels&type=business' },
      { name: 'Packaging Stickers', href: '/products?category=stickers-labels&type=packaging' },
    ],
    viewAllText: 'View All Stickers & Labels',
    viewAllHref: '/products?category=stickers-labels',
  },
};

export const Header: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuthStore();
  const { totalCount } = useCartStore();
  const { productIds } = useWishlistStore();

  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<{ products: Product[]; categories: Category[] }>({
    products: [],
    categories: [],
  });
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);

  // Menu states
  const [activeMegaMenu, setActiveMegaMenu] = useState<string | null>(null);
  const [showAccountMenu, setShowAccountMenu] = useState(false);

  // Mobile drawer states
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSubmenu, setMobileSubmenu] = useState<NavCategory | null>(null);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  // Refs for click outside & hover management
  const searchRef = useRef<HTMLDivElement>(null);
  const accountMenuRef = useRef<HTMLDivElement>(null);
  const megaMenuTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Debounced search suggestions
  useEffect(() => {
    if (!searchQuery.trim() || searchQuery.trim().length < 2) {
      setSuggestions({ products: [], categories: [] });
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const res = await api.get(`/products/search/suggestions?q=${encodeURIComponent(searchQuery)}`);
        if (res.data.success) {
          setSuggestions(res.data.data);
          setShowSearchDropdown(true);
        }
      } catch (err) {
        console.error('Search error:', err);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Click outside listener
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowSearchDropdown(false);
      }
      if (accountMenuRef.current && !accountMenuRef.current.contains(e.target as Node)) {
        setShowAccountMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close menus on route change & unlock scroll
  useEffect(() => {
    setMobileMenuOpen(false);
    setMobileSubmenu(null);
    setMobileSearchOpen(false);
    setShowAccountMenu(false);
    setShowSearchDropdown(false);
    setActiveMegaMenu(null);
    document.body.style.overflow = '';
  }, [location.pathname]);

  // Prevent background scroll when mobile drawer is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setShowSearchDropdown(false);
      setMobileSearchOpen(false);
    }
  };

  // Safe hover timeout for mega menu
  const handleNavMouseEnter = (menuKey: string) => {
    if (megaMenuTimerRef.current) {
      clearTimeout(megaMenuTimerRef.current);
      megaMenuTimerRef.current = null;
    }
    setActiveMegaMenu(menuKey);
  };

  const handleNavMouseLeave = () => {
    megaMenuTimerRef.current = setTimeout(() => {
      setActiveMegaMenu(null);
    }, 180);
  };

  const handleMegaMenuEnter = () => {
    if (megaMenuTimerRef.current) {
      clearTimeout(megaMenuTimerRef.current);
      megaMenuTimerRef.current = null;
    }
  };

  return (
    <header className="pk-header">
      {/* 1. TOP ANNOUNCEMENT BAR (Vistaprint / Zazzle style) */}
      <div className="pk-header__topbar">
        <div className="container">
          <div className="topbar-inner">
            <span className="topbar-badge">OFFICIAL LAUNCH OFFER</span>
            <span className="topbar-text">
              Save up to 40% on Bulk Corporate Gifts & Personalized Printing with code{' '}
              <strong>WELCOME10</strong>
            </span>
            <Link to="/products" className="topbar-link">
              Explore Catalog →
            </Link>
          </div>
        </div>
      </div>

      {/* 2. MAIN HEADER (Logo, Search, Account, Wishlist, Cart) */}
      <div className="pk-header__main">
        <div className="container">
          <div className="main-header-content">
            {/* Mobile: Hamburger Button */}
            <button
              className="mobile-menu-btn hide-on-desktop"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open mobile navigation menu"
            >
              <Menu size={24} />
            </button>

            {/* Brand Logo */}
            <Link to="/" className="pk-header__logo" aria-label="Printkart24 Homepage">
              <span className="logo-brand">
                Printkart<span className="logo-accent">24</span>
              </span>
              <span className="logo-tagline hide-on-mobile">CUSTOM PRINTING & GIFTS</span>
            </Link>

            {/* Desktop Large Search Bar */}
            <div className="pk-header__search hide-on-mobile" ref={searchRef}>
              <form onSubmit={handleSearchSubmit} className="search-form">
                <Search size={18} className="search-icon-left" />
                <input
                  type="text"
                  placeholder="Search for corporate gifts, mugs, business cards, t-shirts, packaging..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => {
                    if (suggestions.products.length > 0 || suggestions.categories.length > 0) {
                      setShowSearchDropdown(true);
                    }
                  }}
                  aria-label="Search catalog"
                />
                {searchQuery && (
                  <button
                    type="button"
                    className="clear-btn"
                    onClick={() => {
                      setSearchQuery('');
                      setSuggestions({ products: [], categories: [] });
                    }}
                    aria-label="Clear search"
                  >
                    <X size={15} />
                  </button>
                )}
                <button type="submit" className="search-submit-btn">
                  Search
                </button>
              </form>

              {/* Search Suggestions Dropdown */}
              {showSearchDropdown && (suggestions.products.length > 0 || suggestions.categories.length > 0) && (
                <div className="search-dropdown">
                  {suggestions.categories.length > 0 && (
                    <div className="dropdown-group">
                      <div className="group-title">Matching Categories</div>
                      <div className="category-pills">
                        {suggestions.categories.map((cat) => (
                          <Link
                            key={cat.id}
                            to={`/products?category=${cat.slug}`}
                            className="cat-pill"
                            onClick={() => setShowSearchDropdown(false)}
                          >
                            {cat.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}

                  {suggestions.products.length > 0 && (
                    <div className="dropdown-group">
                      <div className="group-title">Featured Products</div>
                      {suggestions.products.map((prod) => (
                        <Link
                          key={prod.id}
                          to={`/products/${prod.slug}`}
                          className="product-suggestion-row"
                          onClick={() => setShowSearchDropdown(false)}
                        >
                          <img
                            src={prod.images?.[0]?.url || 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=100'}
                            alt={prod.name}
                          />
                          <div className="prod-meta">
                            <span className="prod-title">{prod.name}</span>
                            <span className="prod-price">Starting from ₹{prod.basePrice}</span>
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Quick Actions (Right): Account, Wishlist, Cart */}
            <div className="pk-header__actions">
              {/* Mobile Search Toggle Icon */}
              <button
                className="action-icon-btn hide-on-desktop"
                onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
                aria-label="Search"
              >
                <Search size={22} />
              </button>

              {/* User Account / Login */}
              <div className="account-dropdown-wrapper" ref={accountMenuRef}>
                {isAuthenticated ? (
                  <button
                    className="action-icon-btn account-trigger"
                    onClick={() => setShowAccountMenu((prev) => !prev)}
                    type="button"
                    aria-label="User account menu"
                  >
                    <UserIcon size={21} />
                    <span className="action-text hide-on-mobile">{user?.firstName || 'Account'}</span>
                    <ChevronDown size={14} className="hide-on-mobile" />
                  </button>
                ) : (
                  <Link to="/login" className="action-icon-btn account-trigger" aria-label="Sign in">
                    <UserIcon size={21} />
                    <span className="action-text hide-on-mobile">Sign In</span>
                  </Link>
                )}

                {showAccountMenu && isAuthenticated && (
                  <div className="account-popover">
                    <div className="popover-header">
                      <div className="user-fullname">{user?.firstName} {user?.lastName}</div>
                      <div className="user-email-text">{user?.email}</div>
                    </div>
                    <Link to="/account" className="popover-item">
                      <LayoutDashboard size={16} />
                      <span>My Dashboard</span>
                    </Link>
                    <Link to="/account?tab=orders" className="popover-item">
                      <Package size={16} />
                      <span>Order History</span>
                    </Link>
                    <Link to="/account?tab=wishlist" className="popover-item">
                      <Heart size={16} />
                      <span>Saved Items</span>
                    </Link>
                    {['ADMIN', 'SUPER_ADMIN'].includes(user?.role || '') && (
                      <Link to="/admin" className="popover-item popover-item--admin">
                        <ShieldCheck size={16} />
                        <span>Admin Console</span>
                      </Link>
                    )}
                    <button
                      type="button"
                      className="popover-item popover-item--logout"
                      onClick={() => {
                        logout();
                        setShowAccountMenu(false);
                        navigate('/');
                      }}
                    >
                      <LogOut size={16} />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Wishlist Link */}
              <Link
                to="/account?tab=wishlist"
                className="action-icon-btn wishlist-action hide-on-mobile"
                aria-label="Wishlist"
                title="Saved Items"
              >
                <Heart size={21} />
                <span className="action-text">Wishlist</span>
                {productIds.length > 0 && <span className="action-badge">{productIds.length}</span>}
              </Link>

              {/* Cart Link with Badge */}
              <Link to="/cart" className="action-icon-btn cart-action" aria-label="Shopping Cart">
                <div className="cart-icon-wrap">
                  <ShoppingCart size={22} />
                  {totalCount > 0 && <span className="action-badge">{totalCount}</span>}
                </div>
                <span className="action-text hide-on-mobile">Cart</span>
              </Link>
            </div>
          </div>

          {/* Mobile Expandable Search Bar */}
          {mobileSearchOpen && (
            <div className="mobile-search-bar hide-on-desktop">
              <form onSubmit={handleSearchSubmit}>
                <input
                  type="text"
                  placeholder="Search corporate gifts, mugs, t-shirts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                />
                <button type="submit">
                  <Search size={16} />
                </button>
              </form>
            </div>
          )}
        </div>
      </div>

      {/* 3. DESKTOP MAIN NAVIGATION (5 Prompt Categories) */}
      <nav className="pk-header__nav hide-on-mobile" aria-label="Main Navigation">
        <div className="container">
          <ul className="nav-menu-bar">
            {/* 1. Corporate Gifts */}
            <li
              className={`nav-menu-item ${activeMegaMenu === 'corporate' ? 'nav-menu-item--active' : ''}`}
              onMouseEnter={() => handleNavMouseEnter('corporate')}
              onMouseLeave={handleNavMouseLeave}
            >
              <Link to={NAV_DATA.corporate.href} className="nav-menu-link">
                <span>Corporate Gifts</span>
                <ChevronDown size={14} className="nav-chevron" />
              </Link>
            </li>

            {/* 2. Personalized Gifts */}
            <li
              className={`nav-menu-item ${activeMegaMenu === 'personalized' ? 'nav-menu-item--active' : ''}`}
              onMouseEnter={() => handleNavMouseEnter('personalized')}
              onMouseLeave={handleNavMouseLeave}
            >
              <Link to={NAV_DATA.personalized.href} className="nav-menu-link">
                <span>Personalized Gifts</span>
                <ChevronDown size={14} className="nav-chevron" />
              </Link>
            </li>

            {/* 3. Packaging */}
            <li
              className={`nav-menu-item ${activeMegaMenu === 'packaging' ? 'nav-menu-item--active' : ''}`}
              onMouseEnter={() => handleNavMouseEnter('packaging')}
              onMouseLeave={handleNavMouseLeave}
            >
              <Link to={NAV_DATA.packaging.href} className="nav-menu-link">
                <span>Packaging</span>
                <ChevronDown size={14} className="nav-chevron" />
              </Link>
            </li>

            {/* 4. Combo Gifts */}
            <li
              className={`nav-menu-item ${activeMegaMenu === 'combo' ? 'nav-menu-item--active' : ''}`}
              onMouseEnter={() => handleNavMouseEnter('combo')}
              onMouseLeave={handleNavMouseLeave}
            >
              <Link to={NAV_DATA.combo.href} className="nav-menu-link">
                <span>Combo Gifts</span>
                <ChevronDown size={14} className="nav-chevron" />
              </Link>
            </li>

            {/* 5. Stickers */}
            <li
              className={`nav-menu-item ${activeMegaMenu === 'stickers' ? 'nav-menu-item--active' : ''}`}
              onMouseEnter={() => handleNavMouseEnter('stickers')}
              onMouseLeave={handleNavMouseLeave}
            >
              <Link to={NAV_DATA.stickers.href} className="nav-menu-link">
                <span>Stickers</span>
                <ChevronDown size={14} className="nav-chevron" />
              </Link>
            </li>

            {/* Quick Link: Bulk Quotes */}
            <li className="nav-menu-item nav-menu-item--quote">
              <Link to="/bulk-orders" className="nav-menu-link">
                <PhoneCall size={14} />
                <span>Bulk Quotes</span>
              </Link>
            </li>
          </ul>
        </div>

        {/* =========================================================================
            DESKTOP MEGA MENUS (RENDERED ON HOVER)
        ========================================================================= */}
        {activeMegaMenu && (
          <div
            className="pk-mega-dropdown"
            onMouseEnter={handleMegaMenuEnter}
            onMouseLeave={handleNavMouseLeave}
          >
            <div className="container">
              {/* 1. CORPORATE GIFTS MEGA MENU */}
              {activeMegaMenu === 'corporate' && (
                <div className="mega-content mega-content--corporate">
                  {/* Left Column: Category List */}
                  <div className="mega-left-col">
                    <h3 className="col-title">Corporate Categories</h3>
                    <ul className="category-links-list">
                      {NAV_DATA.corporate.subcategories.map((sub, i) => (
                        <li key={i}>
                          <Link to={sub.href} className="subcat-link">
                            <ChevronRight size={14} className="subcat-arrow" />
                            <span>{sub.name}</span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                    <Link to={NAV_DATA.corporate.viewAllHref} className="view-all-cta-btn">
                      <span>View All Corporate Gifts</span>
                      <ArrowRight size={15} />
                    </Link>
                  </div>

                  {/* Right Column: Featured Product Cards */}
                  <div className="mega-right-col">
                    <div className="mega-right-header">
                      <h4 className="featured-heading">Popular Corporate Solutions</h4>
                      <span className="tag-pill">Volume Discounts Available</span>
                    </div>

                    <div className="featured-cards-grid featured-cards-grid--4col">
                      {/* Card 1: Custom Mug */}
                      <div className="mega-prod-card">
                        <div className="card-thumb">
                          <img
                            src="https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=300&auto=format&fit=crop&q=80"
                            alt="Custom Mug"
                          />
                        </div>
                        <div className="card-meta">
                          <span className="card-name">Custom Mug</span>
                          <span className="card-price">From ₹199</span>
                          <Link to="/customize/custom-ceramic-coffee-mug" className="btn-customize-sm">
                            Customize
                          </Link>
                        </div>
                      </div>

                      {/* Card 2: Corporate Bottle */}
                      <div className="mega-prod-card">
                        <div className="card-thumb">
                          <img
                            src="https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=300&auto=format&fit=crop&q=80"
                            alt="Corporate Bottle"
                          />
                        </div>
                        <div className="card-meta">
                          <span className="card-name">Corporate Bottle</span>
                          <span className="card-price">From ₹399</span>
                          <Link to="/customize/smart-temperature-stainless-bottle" className="btn-customize-sm">
                            Customize
                          </Link>
                        </div>
                      </div>

                      {/* Card 3: Premium Business Cards */}
                      <div className="mega-prod-card">
                        <div className="card-thumb">
                          <img
                            src="https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=300&auto=format&fit=crop&q=80"
                            alt="Premium Business Cards"
                          />
                        </div>
                        <div className="card-meta">
                          <span className="card-name">Premium Business Cards</span>
                          <span className="card-price">From ₹199 / 100 pcs</span>
                          <Link to="/customize/premium-business-cards" className="btn-customize-sm">
                            Customize
                          </Link>
                        </div>
                      </div>

                      {/* Card 4: Corporate T-Shirts */}
                      <div className="mega-prod-card">
                        <div className="card-thumb">
                          <img
                            src="https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=300&auto=format&fit=crop&q=80"
                            alt="Corporate T-Shirts"
                          />
                        </div>
                        <div className="card-meta">
                          <span className="card-name">Corporate T-Shirts</span>
                          <span className="card-price">From ₹349</span>
                          <Link to="/customize/custom-cotton-polo-tshirt" className="btn-customize-sm">
                            Customize
                          </Link>
                        </div>
                      </div>

                      {/* Card 5: Custom Card Holder */}
                      <div className="mega-prod-card">
                        <div className="card-thumb">
                          <img
                            src="https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=300&auto=format&fit=crop&q=80"
                            alt="Custom Card Holder"
                          />
                        </div>
                        <div className="card-meta">
                          <span className="card-name">Custom Card Holder</span>
                          <span className="card-price">From ₹249</span>
                          <Link to="/products?category=card-holders" className="btn-customize-sm">
                            Customize
                          </Link>
                        </div>
                      </div>

                      {/* Card 6: Logo Keychain */}
                      <div className="mega-prod-card">
                        <div className="card-thumb">
                          <img
                            src="https://images.unsplash.com/photo-1584824486509-112e4181ff6b?w=300&auto=format&fit=crop&q=80"
                            alt="Logo Keychain"
                          />
                        </div>
                        <div className="card-meta">
                          <span className="card-name">Logo Keychain</span>
                          <span className="card-price">From ₹129</span>
                          <Link to="/products?category=keychains" className="btn-customize-sm">
                            Customize
                          </Link>
                        </div>
                      </div>

                      {/* Card 7: Branded Pens */}
                      <div className="mega-prod-card">
                        <div className="card-thumb">
                          <img
                            src="https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?w=300&auto=format&fit=crop&q=80"
                            alt="Branded Pens"
                          />
                        </div>
                        <div className="card-meta">
                          <span className="card-name">Branded Pens</span>
                          <span className="card-price">From ₹99</span>
                          <Link to="/customize/metal-engraved-rollerball-pen" className="btn-customize-sm">
                            Customize
                          </Link>
                        </div>
                      </div>

                      {/* Card 8: Corporate Diary */}
                      <div className="mega-prod-card">
                        <div className="card-thumb">
                          <img
                            src="https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=300&auto=format&fit=crop&q=80"
                            alt="Corporate Diary"
                          />
                        </div>
                        <div className="card-meta">
                          <span className="card-name">Corporate Diary</span>
                          <span className="card-price">From ₹299</span>
                          <Link to="/customize/executive-corporate-diary" className="btn-customize-sm">
                            Customize
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 2. PERSONALIZED GIFTS MEGA MENU */}
              {activeMegaMenu === 'personalized' && (
                <div className="mega-content mega-content--personalized">
                  {/* Left Column */}
                  <div className="mega-left-col">
                    <h3 className="col-title">Personalized Gifts</h3>
                    <ul className="category-links-list">
                      {NAV_DATA.personalized.subcategories.map((sub, i) => (
                        <li key={i}>
                          <Link to={sub.href} className="subcat-link">
                            <ChevronRight size={14} className="subcat-arrow" />
                            <span>{sub.name}</span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                    <Link to={NAV_DATA.personalized.viewAllHref} className="view-all-cta-btn">
                      <span>View All Personalized Gifts</span>
                      <ArrowRight size={15} />
                    </Link>
                  </div>

                  {/* Right Column: 4 Large Lifestyle Cards */}
                  <div className="mega-right-col">
                    <div className="mega-right-header">
                      <h4 className="featured-heading">Create Memories That Last</h4>
                      <span className="tag-pill tag-pill--magenta">Online 2D Customizer Ready</span>
                    </div>

                    <div className="featured-cards-grid featured-cards-grid--lifestyle">
                      {/* Product 1: Personalized Photo Mug */}
                      <div className="lifestyle-card">
                        <div className="lifestyle-img">
                          <img
                            src="https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=450&auto=format&fit=crop&q=80"
                            alt="Personalized Photo Mug"
                          />
                        </div>
                        <div className="lifestyle-body">
                          <span className="lifestyle-title">Personalized Photo Mug</span>
                          <p className="lifestyle-desc">360° HD wrap print on food-grade glossy ceramic.</p>
                          <div className="lifestyle-bottom">
                            <span className="lifestyle-price">From ₹229</span>
                            <Link to="/customize/custom-ceramic-coffee-mug" className="btn-personalize-pill">
                              Personalize
                            </Link>
                          </div>
                        </div>
                      </div>

                      {/* Product 2: Personalized Photo Frame */}
                      <div className="lifestyle-card">
                        <div className="lifestyle-img">
                          <img
                            src="https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=450&auto=format&fit=crop&q=80"
                            alt="Personalized Photo Frame"
                          />
                        </div>
                        <div className="lifestyle-body">
                          <span className="lifestyle-title">Personalized Photo Frame</span>
                          <p className="lifestyle-desc">Museum-grade stretched canvas and acrylic wall frames.</p>
                          <div className="lifestyle-bottom">
                            <span className="lifestyle-price">From ₹399</span>
                            <Link to="/customize/museum-stretched-canvas-print" className="btn-personalize-pill">
                              Personalize
                            </Link>
                          </div>
                        </div>
                      </div>

                      {/* Product 3: Personalized T-Shirt */}
                      <div className="lifestyle-card">
                        <div className="lifestyle-img">
                          <img
                            src="https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=450&auto=format&fit=crop&q=80"
                            alt="Personalized T-Shirt"
                          />
                        </div>
                        <div className="lifestyle-body">
                          <span className="lifestyle-title">Personalized T-Shirt</span>
                          <p className="lifestyle-desc">100% combed cotton with breathable, vibrant DTG prints.</p>
                          <div className="lifestyle-bottom">
                            <span className="lifestyle-price">From ₹349</span>
                            <Link to="/customize/custom-cotton-polo-tshirt" className="btn-personalize-pill">
                              Personalize
                            </Link>
                          </div>
                        </div>
                      </div>

                      {/* Product 4: Personalized Cushion */}
                      <div className="lifestyle-card">
                        <div className="lifestyle-img">
                          <img
                            src="https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=450&auto=format&fit=crop&q=80"
                            alt="Personalized Cushion"
                          />
                        </div>
                        <div className="lifestyle-body">
                          <span className="lifestyle-title">Personalized Cushion</span>
                          <p className="lifestyle-desc">Plush satin velvet with concealed zipper & fiber filler.</p>
                          <div className="lifestyle-bottom">
                            <span className="lifestyle-price">From ₹299</span>
                            <Link to="/customize/personalized-satin-cushion" className="btn-personalize-pill">
                              Personalize
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 3. PACKAGING MEGA MENU */}
              {activeMegaMenu === 'packaging' && (
                <div className="mega-content mega-content--packaging">
                  {/* Left Column */}
                  <div className="mega-left-col">
                    <h3 className="col-title">Branded Packaging</h3>
                    <ul className="category-links-list">
                      {NAV_DATA.packaging.subcategories.map((sub, i) => (
                        <li key={i}>
                          <Link to={sub.href} className="subcat-link">
                            <ChevronRight size={14} className="subcat-arrow" />
                            <span>{sub.name}</span>
                            {sub.badge && <span className="subcat-badge">{sub.badge}</span>}
                          </Link>
                        </li>
                      ))}
                    </ul>
                    <Link to={NAV_DATA.packaging.viewAllHref} className="view-all-cta-btn">
                      <span>View All Packaging</span>
                      <ArrowRight size={15} />
                    </Link>
                  </div>

                  {/* Right Column: Featured Branded Cups + Bulk Quote Card */}
                  <div className="mega-right-col">
                    <div className="packaging-spotlight-grid">
                      {/* Featured: Custom Printed Disposable Cups */}
                      <div className="packaging-hero-card">
                        <div className="hero-card-img">
                          <img
                            src="https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=500&auto=format&fit=crop&q=80"
                            alt="Custom Printed Disposable Cups"
                          />
                          <span className="hero-card-badge">Custom Logo Printing</span>
                        </div>
                        <div className="hero-card-info">
                          <span className="hero-card-title">Custom Printed Disposable Cups</span>
                          <p className="hero-card-desc">
                            Double-wall insulated coffee & cold beverage cups. Leak-resistant, heat-safe, and 100% eco-recyclable food-grade board.
                          </p>
                          <div className="perks-row">
                            <span className="perk-bullet">✓ Custom Logo Printing</span>
                            <span className="perk-bullet">✓ Bulk Orders Available (500+ pcs)</span>
                          </div>
                          <div className="hero-card-bottom">
                            <div className="price-tag">
                              <span className="label">Starting at</span>
                              <span className="val">₹1.80 / pc</span>
                            </div>
                            <Link to="/bulk-orders?product=disposable-cups" className="btn-get-quote">
                              Get Quote
                            </Link>
                          </div>
                        </div>
                      </div>

                      {/* Secondary Card: Need Bulk Packaging? */}
                      <div className="bulk-packaging-cta-card">
                        <Box size={36} className="bulk-icon" />
                        <h4 className="cta-heading">Need Bulk Packaging? Get a Quote</h4>
                        <p className="cta-text">
                          Rigid magnetic boxes, luxury shopping bags, corrugated mailers & branded tape with wholesale tiered discounts up to 40%.
                        </p>
                        <div className="bulk-turnaround">⚡ 3-Day Turnaround • Free Digital Mockup</div>
                        <Link to="/bulk-orders" className="btn-bulk-quote-action">
                          Request Packaging Quote
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 4. COMBO GIFTS MEGA MENU */}
              {activeMegaMenu === 'combo' && (
                <div className="mega-content mega-content--combo">
                  {/* Left Column: Combo Contents */}
                  <div className="mega-left-col">
                    <h3 className="col-title">Combo Contents</h3>
                    <p className="col-sub">All-in-one curated executive gift hampers</p>
                    <ul className="category-links-list">
                      {NAV_DATA.combo.subcategories.map((sub, i) => (
                        <li key={i}>
                          <Link to={sub.href} className="subcat-link">
                            <Sparkles size={13} className="subcat-sparkle" />
                            <span>{sub.name}</span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                    <Link to={NAV_DATA.combo.viewAllHref} className="view-all-cta-btn">
                      <span>View All Combo Kits</span>
                      <ArrowRight size={15} />
                    </Link>
                  </div>

                  {/* Right Column: Featured Corporate Welcome Kit */}
                  <div className="mega-right-col">
                    <div className="combo-featured-hero">
                      <div className="combo-img-wrap">
                        <img
                          src="https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80"
                          alt="Corporate Welcome Kit"
                        />
                        <div className="combo-bundle-tag">
                          <span>Complete 6-Piece Kit</span>
                        </div>
                      </div>

                      <div className="combo-details">
                        <div className="combo-badge-row">
                          <span className="combo-tag">Custom Branding</span>
                          <span className="combo-tag combo-tag--accent">Bulk Order Available</span>
                        </div>

                        <h3 className="combo-title">Corporate Welcome Kit</h3>
                        <p className="combo-items-list">
                          <strong>Includes:</strong> Laptop Bag + Stainless Bottle + Vegan Leather Diary + Metal Matte Pen + Logo Keychain + Card Holder.
                        </p>
                        <p className="combo-desc">
                          Delight new team members and VIP clients with our most sought-after executive onboarding kit, personalized with your corporate logo in laser engraving and UV screen print.
                        </p>

                        <div className="combo-price-action-row">
                          <div className="price-meta">
                            <span className="price-lbl">Starting price</span>
                            <span className="price-val">₹1,499 <small>/ kit</small></span>
                          </div>

                          <div className="combo-buttons">
                            <Link to="/customize/luxury-corporate-gift-set" className="btn-customize-combo">
                              Customize Combo
                            </Link>
                            <Link to="/bulk-orders?kit=welcome-kit" className="btn-get-bulk-quote">
                              Get Bulk Quote
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 5. STICKERS MEGA MENU */}
              {activeMegaMenu === 'stickers' && (
                <div className="mega-content mega-content--stickers">
                  {/* Left Column */}
                  <div className="mega-left-col">
                    <h3 className="col-title">Stickers & Labels</h3>
                    <ul className="category-links-list">
                      {NAV_DATA.stickers.subcategories.map((sub, i) => (
                        <li key={i}>
                          <Link to={sub.href} className="subcat-link">
                            <ChevronRight size={14} className="subcat-arrow" />
                            <span>{sub.name}</span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                    <Link to={NAV_DATA.stickers.viewAllHref} className="view-all-cta-btn">
                      <span>View All Stickers</span>
                      <ArrowRight size={15} />
                    </Link>
                  </div>

                  {/* Right Column: Stickers Cards & Create Your Own Banner */}
                  <div className="mega-right-col">
                    <div className="stickers-grid">
                      {/* Card 1: Logo Stickers */}
                      <div className="sticker-card">
                        <div className="sticker-img">
                          <img
                            src="https://images.unsplash.com/photo-1572375992501-4b0892d50c69?w=350&auto=format&fit=crop&q=80"
                            alt="Logo Stickers"
                          />
                        </div>
                        <div className="sticker-info">
                          <span className="sticker-name">Die-Cut Vinyl Logo Stickers</span>
                          <span className="sticker-material">Waterproof Heavy Matte Vinyl</span>
                          <div className="sticker-bottom">
                            <span className="sticker-price">From ₹49</span>
                            <Link to="/customize/die-cut-vinyl-stickers" className="btn-customize-sm">
                              Customize
                            </Link>
                          </div>
                        </div>
                      </div>

                      {/* Card 2: Product Labels */}
                      <div className="sticker-card">
                        <div className="sticker-img">
                          <img
                            src="https://images.unsplash.com/photo-1616401784845-180882ba9ba8?w=350&auto=format&fit=crop&q=80"
                            alt="Product Labels"
                          />
                        </div>
                        <div className="sticker-info">
                          <span className="sticker-name">Roll Packaging Labels</span>
                          <span className="sticker-material">Gloss / Foil Finishes Available</span>
                          <div className="sticker-bottom">
                            <span className="sticker-price">From ₹99 / 50 pcs</span>
                            <Link to="/products?category=stickers-labels" className="btn-customize-sm">
                              Customize
                            </Link>
                          </div>
                        </div>
                      </div>

                      {/* Card 3: Holographic Stickers */}
                      <div className="sticker-card">
                        <div className="sticker-img">
                          <img
                            src="https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=350&auto=format&fit=crop&q=80"
                            alt="Holographic Stickers"
                          />
                        </div>
                        <div className="sticker-info">
                          <span className="sticker-name">Holographic Rainbow Stickers</span>
                          <span className="sticker-material">Prismatic Shimmer Finish</span>
                          <div className="sticker-bottom">
                            <span className="sticker-price">From ₹79</span>
                            <Link to="/products?category=stickers-labels" className="btn-customize-sm">
                              Customize
                            </Link>
                          </div>
                        </div>
                      </div>

                      {/* Banner Card: Create Your Own Sticker */}
                      <div className="create-sticker-banner-card">
                        <Sparkles size={28} className="create-icon" />
                        <h4 className="banner-title">Create Your Own Sticker</h4>
                        <p className="banner-desc">
                          Upload your vector logo or artwork, choose custom die-cut borders, and preview instant 3D proofing.
                        </p>
                        <Link to="/products?category=stickers-labels&isCustomizable=true" className="btn-create-sticker">
                          Start Creating Now →
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* =========================================================================
          4. FULL-HEIGHT MOBILE NAVIGATION DRAWER (Drill-Down Submenu Support)
      ========================================================================= */}
      {mobileMenuOpen && (
        <div className="pk-mobile-drawer">
          <div className="drawer-overlay" onClick={() => setMobileMenuOpen(false)} />
          <div className="drawer-container">
            {/* LEVEL 1: MAIN CATEGORIES */}
            {!mobileSubmenu && (
              <div className="drawer-level drawer-level--main">
                <div className="drawer-header">
                  <span className="drawer-title">Menu</span>
                  <button
                    type="button"
                    className="drawer-close-btn"
                    onClick={() => setMobileMenuOpen(false)}
                    aria-label="Close menu"
                  >
                    <X size={22} />
                  </button>
                </div>

                <nav className="drawer-nav-list">
                  {/* Category 1: Corporate Gifts */}
                  <button
                    type="button"
                    className="drawer-nav-item"
                    onClick={() => setMobileSubmenu(NAV_DATA.corporate)}
                  >
                    <span>Corporate Gifts</span>
                    <ChevronRight size={18} className="item-arrow" />
                  </button>

                  {/* Category 2: Personalized Gifts */}
                  <button
                    type="button"
                    className="drawer-nav-item"
                    onClick={() => setMobileSubmenu(NAV_DATA.personalized)}
                  >
                    <span>Personalized Gifts</span>
                    <ChevronRight size={18} className="item-arrow" />
                  </button>

                  {/* Category 3: Packaging */}
                  <button
                    type="button"
                    className="drawer-nav-item"
                    onClick={() => setMobileSubmenu(NAV_DATA.packaging)}
                  >
                    <span>Packaging</span>
                    <ChevronRight size={18} className="item-arrow" />
                  </button>

                  {/* Category 4: Combo Gifts */}
                  <button
                    type="button"
                    className="drawer-nav-item"
                    onClick={() => setMobileSubmenu(NAV_DATA.combo)}
                  >
                    <span>Combo Gifts</span>
                    <ChevronRight size={18} className="item-arrow" />
                  </button>

                  {/* Category 5: Stickers */}
                  <button
                    type="button"
                    className="drawer-nav-item"
                    onClick={() => setMobileSubmenu(NAV_DATA.stickers)}
                  >
                    <span>Stickers</span>
                    <ChevronRight size={18} className="item-arrow" />
                  </button>

                  <hr className="drawer-divider" />

                  {/* Quick Utility Links */}
                  <Link
                    to="/bulk-orders"
                    className="drawer-util-link"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <PhoneCall size={16} />
                    <span>Need Bulk Quotes?</span>
                  </Link>
                  <Link
                    to="/account?tab=wishlist"
                    className="drawer-util-link"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Heart size={16} />
                    <span>My Wishlist ({productIds.length})</span>
                  </Link>
                  <Link
                    to="/track-order"
                    className="drawer-util-link"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Package size={16} />
                    <span>Track Order</span>
                  </Link>

                  {isAuthenticated ? (
                    <Link
                      to="/account"
                      className="drawer-util-link"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <UserIcon size={16} />
                      <span>My Account ({user?.firstName})</span>
                    </Link>
                  ) : (
                    <Link
                      to="/login"
                      className="drawer-util-link"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <UserIcon size={16} />
                      <span>Sign In / Register</span>
                    </Link>
                  )}
                </nav>
              </div>
            )}

            {/* LEVEL 2: SUBMENU DRILL-DOWN */}
            {mobileSubmenu && (
              <div className="drawer-level drawer-level--sub">
                <div className="drawer-header drawer-header--sub">
                  <button
                    type="button"
                    className="drawer-back-btn"
                    onClick={() => setMobileSubmenu(null)}
                    aria-label="Back to main menu"
                  >
                    <ArrowLeft size={18} />
                    <span>Back</span>
                  </button>
                  <button
                    type="button"
                    className="drawer-close-btn"
                    onClick={() => setMobileMenuOpen(false)}
                    aria-label="Close menu"
                  >
                    <X size={22} />
                  </button>
                </div>

                <div className="submenu-title-row">
                  <h3>{mobileSubmenu.name}</h3>
                </div>

                <div className="submenu-items-list">
                  {mobileSubmenu.subcategories.map((sub, idx) => (
                    <Link
                      key={idx}
                      to={sub.href}
                      className="submenu-item-link"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <span>{sub.name}</span>
                      {sub.badge && <span className="item-badge">{sub.badge}</span>}
                      <ChevronRight size={16} className="sub-arrow" />
                    </Link>
                  ))}
                </div>

                <div className="submenu-cta-wrapper">
                  <Link
                    to={mobileSubmenu.viewAllHref}
                    className="submenu-view-all-btn"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <span>{mobileSubmenu.viewAllText} →</span>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
