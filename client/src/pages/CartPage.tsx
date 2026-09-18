import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Sparkles, ArrowRight, ShoppingBag, ShieldCheck } from 'lucide-react';
import { useCartStore } from '../store/cartStore';
import { Button } from '../components/Button/Button';
import { CartItem } from '../types';
import './CartPage.scss';

export const CartPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    items,
    subtotal,
    discount,
    shippingFee,
    tax,
    totalAmount,
    couponCode,
    applyCoupon,
    removeCoupon,
    updateQuantity,
    removeItem,
  } = useCartStore();

  const [inputCoupon, setInputCoupon] = useState('');
  const [couponError, setCouponError] = useState<string | null>(null);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError(null);
    if (!inputCoupon.trim()) return;

    const success = applyCoupon(inputCoupon);
    if (success) {
      setInputCoupon('');
    } else {
      setCouponError('Invalid coupon or minimum cart value not met.');
    }
  };

  const freeShippingThreshold = 999;
  const freeShippingNeeded = Math.max(0, freeShippingThreshold - subtotal);
  const freeShippingPercent = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));

  if (items.length === 0) {
    return (
      <div className="container" style={{ padding: '6rem 0', textAlign: 'center' }}>
        <ShoppingBag size={56} style={{ color: '#94A3B8', margin: '0 auto 1.5rem auto' }} />
        <h2>Your Cart is Empty</h2>
        <p style={{ color: '#64748B', marginTop: '0.5rem', marginBottom: '2rem' }}>
          Explore our custom printing categories and build your personalized products today.
        </p>
        <Button variant="primary" size="lg" onClick={() => navigate('/products')}>
          Start Shopping
        </Button>
      </div>
    );
  }

  return (
    <div className="pk-cart">
      <div className="container">
        <h1>Shopping Cart ({items.length} {items.length === 1 ? 'item' : 'items'})</h1>

        <div className="pk-cart__layout">
          {/* Items Section */}
          <div className="pk-cart__items">
            {/* Free shipping meter */}
            <div className="free-shipping-meter">
              <span className="meter-text">
                {freeShippingNeeded === 0
                  ? '🎉 Congratulations! You have unlocked FREE Express Shipping.'
                  : `Add ₹${freeShippingNeeded.toLocaleString('en-IN')} more to unlock FREE Shipping!`}
              </span>
              <div className="meter-bar">
                <div className="fill" style={{ width: `${freeShippingPercent}%` }} />
              </div>
            </div>

            {/* List */}
            {items.map((item: CartItem) => {
              const image =
                item.customDesignPreviewUrl ||
                item.product?.images?.[0]?.url ||
                'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=400';

              let configuration = item.configuration;
              if (!configuration && (item as any).configurationJson) {
                try {
                  configuration = typeof (item as any).configurationJson === 'string'
                    ? JSON.parse((item as any).configurationJson)
                    : (item as any).configurationJson;
                } catch {
                  configuration = undefined;
                }
              }

              return (
                <div key={item.id} className="cart-item-card">
                  <div className="item-image">
                    <img src={image} alt={item.product?.name} />
                  </div>

                  <div className="item-details">
                    <div className="item-top">
                      <div>
                        <h3>{item.product?.name}</h3>
                        {item.customDesign || item.customDesignPreviewUrl ? (
                          <span className="custom-badge">
                            <Sparkles size={12} /> Custom Design Applied
                          </span>
                        ) : null}
                      </div>
                      <button
                        className="delete-btn"
                        onClick={() => removeItem(item.id)}
                        aria-label="Remove item"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>

                    {/* Selected Options configuration pills */}
                    {configuration && (
                      <div className="config-tags">
                        {Object.entries(configuration).map(([key, val]) => (
                          <span key={key} className="tag">
                            {key}: {val as string}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="item-bottom">
                      <div className="qty-controller">
                        <button
                          onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                        >
                          -
                        </button>
                        <span className="qty-val">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                          +
                        </button>
                      </div>

                      <div className="item-price">
                        ₹{(item.totalPrice || item.unitPrice * item.quantity).toLocaleString('en-IN')}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Order Summary Sidebar */}
          <aside className="pk-cart__summary">
            <h3>Order Summary</h3>

            {/* Coupon Code Input */}
            <div>
              {couponCode ? (
                <div className="applied-coupon">
                  <span>Coupon {couponCode} applied!</span>
                  <button onClick={removeCoupon}>Remove</button>
                </div>
              ) : (
                <form className="coupon-box" onSubmit={handleApplyCoupon}>
                  <input
                    type="text"
                    placeholder="Enter Coupon Code (e.g. WELCOME10)"
                    value={inputCoupon}
                    onChange={(e) => setInputCoupon(e.target.value)}
                  />
                  <Button type="submit" variant="outline" size="sm">
                    Apply
                  </Button>
                </form>
              )}
              {couponError && (
                <span style={{ fontSize: 11, color: '#E11D48', marginTop: 4, display: 'block' }}>
                  {couponError}
                </span>
              )}
            </div>

            {/* Price Breakdown */}
            <div className="breakdown">
              <div className="line">
                <span>Subtotal</span>
                <span>₹{subtotal.toLocaleString('en-IN')}</span>
              </div>

              {discount > 0 && (
                <div className="line line--discount">
                  <span>Discount ({couponCode})</span>
                  <span>-₹{discount.toLocaleString('en-IN')}</span>
                </div>
              )}

              <div className="line">
                <span>Estimated Shipping</span>
                <span>{shippingFee === 0 ? 'FREE' : `₹${shippingFee}`}</span>
              </div>

              <div className="line">
                <span>GST (18%)</span>
                <span>₹{tax.toLocaleString('en-IN')}</span>
              </div>

              <div className="line line--total">
                <span>Grand Total</span>
                <span>₹{totalAmount.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <Button
              variant="accent"
              size="lg"
              fullWidth
              onClick={() => navigate('/checkout')}
              rightIcon={<ArrowRight size={18} />}
            >
              Proceed to Checkout
            </Button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#64748B', fontSize: 12, justifyContent: 'center' }}>
              <ShieldCheck size={16} color="#10B981" />
              <span>Safe & Encrypted Checkout via Razorpay</span>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};
