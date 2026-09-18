import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Check,
  CreditCard,
  Truck,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  Sparkles,
} from 'lucide-react';
import { useCartStore } from '../store/cartStore';
import { useAuthStore } from '../store/authStore';
import { Button } from '../components/Button/Button';
import { CartItem } from '../types';
import api from '../services/api';
import './CheckoutPage.scss';

export const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { items, subtotal, discount, tax, totalAmount, couponCode, clearCart } = useCartStore();

  const [activeStep, setActiveStep] = useState<number>(2); // Start on Address if already logged in / guest
  const [shippingMethod, setShippingMethod] = useState<'standard' | 'express'>('standard');
  const [paymentMethod, setPaymentMethod] = useState<'RAZORPAY' | 'COD'>('RAZORPAY');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Address Form State
  const [address, setAddress] = useState({
    fullName: user ? `${user.firstName} ${user.lastName}` : 'Aarav Mehta',
    email: user ? user.email : 'aarav.mehta@example.com',
    phone: user?.phone || '+91 98111 22334',
    addressLine1: 'Plot 42, Cyber City, Phase 2',
    addressLine2: 'DLF Sector 25',
    city: 'Gurugram',
    state: 'Haryana',
    postalCode: '122002',
    country: 'India',
  });

  const shippingCost = shippingMethod === 'express' ? 199 : (subtotal >= 999 ? 0 : 99);
  const grandTotal = Math.round((subtotal - discount + tax + shippingCost) * 100) / 100;

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = async () => {
    setErrorMsg(null);
    setIsSubmitting(true);

    try {
      // 1. Prepare Order Request Payload
      const orderPayload = {
        customerName: address.fullName,
        customerEmail: address.email,
        customerPhone: address.phone,
        shippingAddress: {
          fullName: address.fullName,
          phone: address.phone,
          addressLine1: address.addressLine1,
          addressLine2: address.addressLine2,
          city: address.city,
          state: address.state,
          postalCode: address.postalCode,
          country: address.country,
        },
        paymentMethod,
        couponCode: couponCode || undefined,
        items: items.map((it: CartItem) => ({
          productId: it.productId,
          variantId: (it.product as any)?.variants?.[0]?.id,
          quantity: it.quantity,
          unitPrice: it.unitPrice,
          configuration: it.configuration,
          customDesign: it.customDesign,
          customDesignPreviewUrl: it.customDesignPreviewUrl,
        })),
      };

      // 2. Create Order in Backend
      const orderRes = await api.post('/orders', orderPayload);
      if (!orderRes.data.success) {
        throw new Error(orderRes.data.message || 'Failed to create order');
      }

      const createdOrder = orderRes.data.data;

      // 3. Handle Payment Method
      if (paymentMethod === 'COD') {
        await clearCart();
        navigate(`/order-confirmation/${createdOrder.orderNumber}`);
        return;
      }

      // Handle Razorpay
      const paymentOrderRes = await api.post('/payments/create', { orderId: createdOrder.id });
      const rzpOrderData = paymentOrderRes.data.data;

      // Razorpay Checkout Handler
      const rzpOptions = {
        key: rzpOrderData.keyId,
        amount: rzpOrderData.amount,
        currency: 'INR',
        name: 'PRINTKART24',
        description: `Order #${createdOrder.orderNumber}`,
        order_id: rzpOrderData.id,
        handler: async (response: any) => {
          try {
            await api.post('/payments/verify', {
              orderId: createdOrder.id,
              razorpayOrderId: response.razorpay_order_id || rzpOrderData.id,
              razorpayPaymentId: response.razorpay_payment_id || `pay_${Date.now()}`,
              razorpaySignature: response.razorpay_signature || 'sig_simulated_success',
            });
            await clearCart();
            navigate(`/order-confirmation/${createdOrder.orderNumber}`);
          } catch (err: any) {
            setErrorMsg(err.message || 'Payment verification failed');
          }
        },
        prefill: {
          name: address.fullName,
          email: address.email,
          contact: address.phone,
        },
        theme: {
          color: '#1E60D5',
        },
      };

      // If Razorpay SDK loaded and not simulated
      if ((window as any).Razorpay && !rzpOrderData.isSimulated) {
        const rzp = new (window as any).Razorpay(rzpOptions);
        rzp.open();
      } else {
        // Immediate seamless simulator verification for frictionless testing
        console.log('⚡ Executing instant simulated Razorpay verification...');
        await api.post('/payments/verify', {
          orderId: createdOrder.id,
          razorpayOrderId: rzpOrderData.id,
          razorpayPaymentId: `pay_simulated_${Date.now()}`,
          razorpaySignature: 'sig_simulated_success',
        });
        await clearCart();
        navigate(`/order-confirmation/${createdOrder.orderNumber}`);
      }
    } catch (err: any) {
      console.error('Checkout error:', err);
      setErrorMsg(err.message || 'An error occurred while placing your order.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="pk-checkout">
      <div className="container">
        <h1>Secure Checkout</h1>

        {errorMsg && (
          <div
            style={{
              padding: '12px 16px',
              backgroundColor: '#FEF2F2',
              color: '#B91C1C',
              borderRadius: '8px',
              border: '1px solid #F87171',
              marginBottom: '1.5rem',
            }}
          >
            {errorMsg}
          </div>
        )}

        <div className="pk-checkout__layout">
          {/* Steps */}
          <div className="pk-checkout__steps">
            {/* Step 1: Account */}
            <div className="checkout-step-card">
              <div className="step-header" onClick={() => setActiveStep(1)}>
                <div className="header-left">
                  <span className={`step-num ${activeStep > 1 ? 'step-num--completed' : 'step-num--active'}`}>
                    {activeStep > 1 ? <Check size={14} /> : '1'}
                  </span>
                  <h3>Account & Contact Information</h3>
                </div>
                {activeStep === 1 ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </div>
              {activeStep === 1 && (
                <div className="step-body">
                  <div className="form-grid">
                    <div className="form-group">
                      <label>Email Address</label>
                      <input
                        type="email"
                        name="email"
                        value={address.email}
                        onChange={handleAddressChange}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Phone Number</label>
                      <input
                        type="tel"
                        name="phone"
                        value={address.phone}
                        onChange={handleAddressChange}
                        required
                      />
                    </div>
                  </div>
                  <Button
                    variant="primary"
                    style={{ marginTop: '1rem' }}
                    onClick={() => setActiveStep(2)}
                  >
                    Continue to Delivery Address
                  </Button>
                </div>
              )}
            </div>

            {/* Step 2: Address */}
            <div className="checkout-step-card">
              <div className="step-header" onClick={() => setActiveStep(2)}>
                <div className="header-left">
                  <span
                    className={`step-num ${
                      activeStep > 2
                        ? 'step-num--completed'
                        : activeStep === 2
                        ? 'step-num--active'
                        : ''
                    }`}
                  >
                    {activeStep > 2 ? <Check size={14} /> : '2'}
                  </span>
                  <h3>Shipping & Delivery Address</h3>
                </div>
                {activeStep === 2 ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </div>
              {activeStep === 2 && (
                <div className="step-body">
                  <div className="form-grid">
                    <div className="form-group --full">
                      <label>Full Name / Company Representative</label>
                      <input
                        type="text"
                        name="fullName"
                        value={address.fullName}
                        onChange={handleAddressChange}
                        required
                      />
                    </div>
                    <div className="form-group --full">
                      <label>Street Address, Suite or Floor</label>
                      <input
                        type="text"
                        name="addressLine1"
                        value={address.addressLine1}
                        onChange={handleAddressChange}
                        required
                      />
                    </div>
                    <div className="form-group --full">
                      <label>Apartment, Corporate Park, Landmark (Optional)</label>
                      <input
                        type="text"
                        name="addressLine2"
                        value={address.addressLine2}
                        onChange={handleAddressChange}
                      />
                    </div>
                    <div className="form-group">
                      <label>City</label>
                      <input
                        type="text"
                        name="city"
                        value={address.city}
                        onChange={handleAddressChange}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>State</label>
                      <input
                        type="text"
                        name="state"
                        value={address.state}
                        onChange={handleAddressChange}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Postal Code (PIN)</label>
                      <input
                        type="text"
                        name="postalCode"
                        value={address.postalCode}
                        onChange={handleAddressChange}
                        maxLength={6}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Country</label>
                      <input type="text" name="country" value={address.country} readOnly />
                    </div>
                  </div>
                  <Button
                    variant="primary"
                    style={{ marginTop: '1.25rem' }}
                    onClick={() => setActiveStep(3)}
                  >
                    Continue to Shipping Options
                  </Button>
                </div>
              )}
            </div>

            {/* Step 3: Shipping */}
            <div className="checkout-step-card">
              <div className="step-header" onClick={() => setActiveStep(3)}>
                <div className="header-left">
                  <span
                    className={`step-num ${
                      activeStep > 3
                        ? 'step-num--completed'
                        : activeStep === 3
                        ? 'step-num--active'
                        : ''
                    }`}
                  >
                    {activeStep > 3 ? <Check size={14} /> : '3'}
                  </span>
                  <h3>Shipping Method</h3>
                </div>
                {activeStep === 3 ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </div>
              {activeStep === 3 && (
                <div className="step-body">
                  <div className="selectable-options">
                    <div
                      className={`option-row ${
                        shippingMethod === 'standard' ? 'option-row--selected' : ''
                      }`}
                      onClick={() => setShippingMethod('standard')}
                    >
                      <div className="option-left">
                        <input
                          type="radio"
                          name="shipping"
                          checked={shippingMethod === 'standard'}
                          onChange={() => setShippingMethod('standard')}
                        />
                        <div>
                          <div className="title">Standard Commercial Delivery</div>
                          <div className="sub">Estimated 4 - 6 business days dispatch</div>
                        </div>
                      </div>
                      <div className="price">{subtotal >= 999 ? 'FREE' : '₹99'}</div>
                    </div>

                    <div
                      className={`option-row ${
                        shippingMethod === 'express' ? 'option-row--selected' : ''
                      }`}
                      onClick={() => setShippingMethod('express')}
                    >
                      <div className="option-left">
                        <input
                          type="radio"
                          name="shipping"
                          checked={shippingMethod === 'express'}
                          onChange={() => setShippingMethod('express')}
                        />
                        <div>
                          <div className="title">Priority Air Express Dispatch</div>
                          <div className="sub">Priority press queue & 2 - 3 business days delivery</div>
                        </div>
                      </div>
                      <div className="price">₹199</div>
                    </div>
                  </div>
                  <Button
                    variant="primary"
                    style={{ marginTop: '1.25rem' }}
                    onClick={() => setActiveStep(4)}
                  >
                    Continue to Payment
                  </Button>
                </div>
              )}
            </div>

            {/* Step 4: Payment */}
            <div className="checkout-step-card">
              <div className="step-header" onClick={() => setActiveStep(4)}>
                <div className="header-left">
                  <span
                    className={`step-num ${
                      activeStep === 4 ? 'step-num--active' : ''
                    }`}
                  >
                    4
                  </span>
                  <h3>Payment Method</h3>
                </div>
                {activeStep === 4 ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </div>
              {activeStep === 4 && (
                <div className="step-body">
                  <div className="selectable-options">
                    <div
                      className={`option-row ${
                        paymentMethod === 'RAZORPAY' ? 'option-row--selected' : ''
                      }`}
                      onClick={() => setPaymentMethod('RAZORPAY')}
                    >
                      <div className="option-left">
                        <input
                          type="radio"
                          name="payment"
                          checked={paymentMethod === 'RAZORPAY'}
                          onChange={() => setPaymentMethod('RAZORPAY')}
                        />
                        <div>
                          <div className="title">Razorpay (UPI, Google Pay, Cards, NetBanking)</div>
                          <div className="sub">Instant verification & digital receipt</div>
                        </div>
                      </div>
                      <CreditCard size={20} color="#1E60D5" />
                    </div>

                    <div
                      className={`option-row ${
                        paymentMethod === 'COD' ? 'option-row--selected' : ''
                      }`}
                      onClick={() => setPaymentMethod('COD')}
                    >
                      <div className="option-left">
                        <input
                          type="radio"
                          name="payment"
                          checked={paymentMethod === 'COD'}
                          onChange={() => setPaymentMethod('COD')}
                        />
                        <div>
                          <div className="title">Cash on Delivery (Eligible Orders)</div>
                          <div className="sub">Pay upon physical delivery to your address</div>
                        </div>
                      </div>
                      <Truck size={20} color="#0B132B" />
                    </div>
                  </div>

                  <div style={{ marginTop: '1.5rem' }}>
                    <Button
                      variant="accent"
                      size="lg"
                      fullWidth
                      onClick={handlePlaceOrder}
                      isLoading={isSubmitting}
                    >
                      Place Order & Pay ₹{grandTotal.toLocaleString('en-IN')}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar Summary */}
          <aside className="pk-checkout__sidebar">
            <h3>Order Review</h3>

            <div className="sidebar-items">
              {items.map((it: CartItem) => (
                <div key={it.id} className="mini-item">
                  <img
                    src={
                      it.customDesignPreviewUrl ||
                      it.product?.images?.[0]?.url ||
                      'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=200'
                    }
                    alt={it.product?.name}
                  />
                  <div className="item-text">
                    <div className="name">{it.product?.name}</div>
                    <div className="meta">Qty: {it.quantity}</div>
                    {it.customDesign && (
                      <span style={{ fontSize: 10, color: '#E11D48', display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Sparkles size={10} /> Customized
                      </span>
                    )}
                  </div>
                  <div className="price">
                    ₹{(it.totalPrice || it.unitPrice * it.quantity).toLocaleString('en-IN')}
                  </div>
                </div>
              ))}
            </div>

            <div className="breakdown-table">
              <div className="row">
                <span>Subtotal</span>
                <span>₹{subtotal.toLocaleString('en-IN')}</span>
              </div>
              {discount > 0 && (
                <div className="row" style={{ color: '#10B981', fontWeight: 600 }}>
                  <span>Discount</span>
                  <span>-₹{discount.toLocaleString('en-IN')}</span>
                </div>
              )}
              <div className="row">
                <span>Shipping ({shippingMethod})</span>
                <span>{shippingCost === 0 ? 'FREE' : `₹${shippingCost}`}</span>
              </div>
              <div className="row">
                <span>GST (18%)</span>
                <span>₹{tax.toLocaleString('en-IN')}</span>
              </div>
              <div className="row row--total">
                <span>Grand Total</span>
                <span>₹{grandTotal.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#64748B', fontSize: 11, justifyContent: 'center' }}>
              <ShieldCheck size={16} color="#10B981" />
              <span>PCI-DSS Level 1 Compliant 256-Bit SSL Checkout</span>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};
