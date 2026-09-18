import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, Star, Sparkles, Eye, ShoppingCart } from 'lucide-react';
import { Product } from '../../types';
import { Badge } from '../Badge/Badge';
import { Button } from '../Button/Button';
import { useWishlistStore } from '../../store/wishlistStore';
import './ProductCard.scss';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const navigate = useNavigate();
  const { toggleWishlist, isInWishlist } = useWishlistStore();
  const inWishlist = isInWishlist(product.id);

  const primaryImage = product.images?.[0]?.url || 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600';
  const secondaryImage = product.images?.[1]?.url || primaryImage;

  const currentPrice = product.salePrice || product.basePrice;
  const originalPrice = product.salePrice ? product.basePrice : null;
  const discountPercent = originalPrice
    ? Math.round(((originalPrice - currentPrice) / originalPrice) * 100)
    : null;

  return (
    <div className="pk-product-card">
      {/* Image & Badges */}
      <div className="pk-product-card__image-wrapper">
        <Link to={`/products/${product.slug}`}>
          <img
            src={primaryImage}
            alt={product.name}
            className="product-image product-image--primary"
            loading="lazy"
          />
          <img
            src={secondaryImage}
            alt={`${product.name} alternate view`}
            className="product-image product-image--secondary"
            loading="lazy"
          />
        </Link>

        {/* Badges */}
        <div className="card-badges">
          {product.isCustomizable && (
            <Badge variant="accent">
              <Sparkles size={11} /> Customizable
            </Badge>
          )}
          {discountPercent && (
            <Badge variant="warning">{discountPercent}% OFF</Badge>
          )}
          {product.isBestSeller && (
            <Badge variant="navy">Best Seller</Badge>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          className={`wishlist-btn ${inWishlist ? 'wishlist-btn--active' : ''}`}
          onClick={(e) => {
            e.preventDefault();
            toggleWishlist(product.id);
          }}
          aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart size={18} fill={inWishlist ? '#E11D48' : 'none'} />
        </button>

        {/* Quick View Hover Action */}
        <div className="quick-actions-overlay">
          <Button
            size="sm"
            variant="secondary"
            fullWidth
            onClick={() => navigate(`/products/${product.slug}`)}
            leftIcon={<Eye size={14} />}
          >
            Quick View
          </Button>
        </div>
      </div>

      {/* Card Body */}
      <div className="pk-product-card__content">
        {product.category && (
          <div className="pk-product-card__category">{product.category.name}</div>
        )}

        <h3 className="pk-product-card__title">
          <Link to={`/products/${product.slug}`}>{product.name}</Link>
        </h3>

        {/* Rating */}
        <div className="pk-product-card__rating">
          <div className="stars">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={13}
                fill={i < Math.floor(product.rating || 5) ? '#F59E0B' : 'none'}
                stroke="#F59E0B"
              />
            ))}
          </div>
          <span className="rating-val">{product.rating ? product.rating.toFixed(1) : '5.0'}</span>
          <span className="review-count">({product.reviewCount || 42})</span>
        </div>

        {/* Pricing */}
        <div className="pk-product-card__pricing">
          <span className="starting-label">Starting at</span>
          <div className="price-row">
            <span className="current-price">₹{currentPrice.toLocaleString('en-IN')}</span>
            {originalPrice && (
              <span className="original-price">₹{originalPrice.toLocaleString('en-IN')}</span>
            )}
            {discountPercent && (
              <span className="discount-tag">{discountPercent}% OFF</span>
            )}
          </div>
        </div>

        {/* Bottom CTAs */}
        <div className="pk-product-card__actions">
          {product.isCustomizable ? (
            <>
              <Button
                variant="accent"
                size="sm"
                onClick={() => navigate(`/customize/${product.slug}`)}
                leftIcon={<Sparkles size={14} />}
              >
                Customize
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate(`/products/${product.slug}`)}
              >
                Configure
              </Button>
            </>
          ) : (
            <Button
              variant="primary"
              size="sm"
              fullWidth
              style={{ gridColumn: 'span 2' }}
              onClick={() => navigate(`/products/${product.slug}`)}
              leftIcon={<ShoppingCart size={14} />}
            >
              View Options
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
