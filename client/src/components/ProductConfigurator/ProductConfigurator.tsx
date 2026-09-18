import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, ShoppingCart, Zap, Check, Truck, MapPin } from 'lucide-react';
import { Product } from '../../types';
import { Button } from '../Button/Button';
import { useCartStore } from '../../store/cartStore';
import './ProductConfigurator.scss';

interface ProductConfiguratorProps {
  product: Product;
}

export const ProductConfigurator: React.FC<ProductConfiguratorProps> = ({ product }) => {
  const navigate = useNavigate();
  const { addItem } = useCartStore();

  // Initialize selected options with defaults
  const initialOptions = useMemo(() => {
    const opts: Record<string, string> = {};
    if (product.options) {
      product.options.forEach((opt) => {
        const defaultVal = opt.values.find((v) => v.isDefault) || opt.values[0];
        if (defaultVal) {
          opts[opt.name] = defaultVal.value;
        }
      });
    }
    return opts;
  }, [product]);

  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>(initialOptions);
  const [pincode, setPincode] = useState('');
  const [pincodeMessage, setPincodeMessage] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [addedSuccess, setAddedSuccess] = useState(false);

  // Extract selected quantity tier or fallback
  const quantity = useMemo(() => {
    if (selectedOptions['Quantity']) {
      const parsed = parseInt(selectedOptions['Quantity'], 10);
      if (!isNaN(parsed)) return parsed;
    }
    return product.minQuantity || 1;
  }, [selectedOptions, product]);

  // Calculate live dynamic price
  const { totalPrice, unitPrice } = useMemo(() => {
    let modifierSum = 0;
    if (product.options) {
      product.options.forEach((opt) => {
        const selectedVal = selectedOptions[opt.name];
        const valObj = opt.values.find((v) => v.value === selectedVal);
        if (valObj) {
          modifierSum += valObj.priceModifier;
        }
      });
    }

    const calculatedTotal = (product.salePrice || product.basePrice) + modifierSum;
    const calculatedUnitPrice = quantity > 0 ? calculatedTotal / quantity : calculatedTotal;

    return {
      totalPrice: Math.round(calculatedTotal),
      unitPrice: Math.round(calculatedUnitPrice * 100) / 100,
    };
  }, [product, selectedOptions, quantity]);

  const handleOptionChange = (optionName: string, value: string) => {
    setSelectedOptions((prev) => ({ ...prev, [optionName]: value }));
  };

  const checkPincode = (e: React.FormEvent) => {
    e.preventDefault();
    if (pincode.length === 6 && /^\d+$/.test(pincode)) {
      setPincodeMessage(`Delivery to ${pincode}: Estimated by ${new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric' })} (Standard Free Delivery)`);
    } else {
      setPincodeMessage('Please enter a valid 6-digit Indian PIN code');
    }
  };

  const handleAddToCart = async () => {
    setIsAdding(true);
    const success = await addItem({
      productId: product.id,
      quantity,
      unitPrice,
      totalPrice,
      configuration: selectedOptions,
    });
    setIsAdding(false);
    if (success) {
      setAddedSuccess(true);
      setTimeout(() => setAddedSuccess(false), 3000);
    }
  };

  const handleBuyNow = async () => {
    await handleAddToCart();
    navigate('/cart');
  };

  const handleCustomize = () => {
    navigate(`/customize/${product.slug}`, {
      state: { configuration: selectedOptions, totalPrice, quantity },
    });
  };

  const colorMap: Record<string, string> = {
    navy: '#0B132B',
    black: '#111827',
    white: '#F9FAFB',
    brown: '#78350F',
    olive: '#3F6212',
    silver: '#94A3B8',
    blue: '#1E60D5',
    red: '#E11D48',
    maroon: '#881337',
    grey: '#64748B',
    yellow: '#FACC15',
    gunmetal: '#334155',
    rose_gold: '#E0A899',
    black_gold: '#27272A',
  };

  return (
    <div className="pk-configurator">
      {/* Dynamic Printing Options */}
      {product.options &&
        product.options.map((option) => (
          <div key={option.id} className="pk-configurator__section">
            <div className="section-header">
              <span className="option-name">{option.name}</span>
              <span className="selected-val">
                {option.values.find((v) => v.value === selectedOptions[option.name])?.label}
              </span>
            </div>

            {option.type === 'COLOR' ? (
              <div className="colors-row">
                {option.values.map((val) => (
                  <button
                    key={val.id}
                    type="button"
                    className={`color-swatch ${
                      selectedOptions[option.name] === val.value ? 'color-swatch--active' : ''
                    }`}
                    style={{ backgroundColor: colorMap[val.value] || '#0B132B' }}
                    onClick={() => handleOptionChange(option.name, val.value)}
                    title={val.label}
                  />
                ))}
              </div>
            ) : (
              <div className="options-grid">
                {option.values.map((val) => {
                  const isActive = selectedOptions[option.name] === val.value;
                  return (
                    <button
                      key={val.id}
                      type="button"
                      className={`option-chip ${isActive ? 'option-chip--active' : ''}`}
                      onClick={() => handleOptionChange(option.name, val.value)}
                    >
                      <span className="chip-label">{val.label}</span>
                      {val.priceModifier > 0 && (
                        <span className="chip-price-mod">+₹{val.priceModifier}</span>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        ))}

      {/* Dynamic Pricing Box */}
      <div className="pk-configurator__price-box">
        <div className="price-row">
          <div>
            <div className="total-price">₹{totalPrice.toLocaleString('en-IN')}</div>
            <div className="unit-price">
              {quantity > 1 ? `(₹${unitPrice.toFixed(2)} per piece for ${quantity} pcs)` : 'All taxes included'}
            </div>
          </div>
          {quantity >= 500 && (
            <div className="savings-banner">
              <Check size={16} /> Bulk volume savings applied!
            </div>
          )}
        </div>
      </div>

      {/* Delivery Estimator */}
      <div className="pk-configurator__pincode">
        <span className="pincode-label">
          <Truck size={15} /> Check Delivery Pincode:
        </span>
        <form className="pincode-input-group" onSubmit={checkPincode}>
          <input
            type="text"
            placeholder="e.g. 110001"
            maxLength={6}
            value={pincode}
            onChange={(e) => setPincode(e.target.value)}
          />
          <Button type="submit" variant="outline" size="sm">
            Check
          </Button>
        </form>
        {pincodeMessage && <div className="estimate-result">{pincodeMessage}</div>}
      </div>

      {/* CTAs */}
      <div className="pk-configurator__actions">
        {product.isCustomizable && (
          <Button
            variant="accent"
            size="lg"
            fullWidth
            onClick={handleCustomize}
            leftIcon={<Sparkles size={18} />}
          >
            Customize Design Online
          </Button>
        )}

        <div className="cta-row">
          <Button
            variant="primary"
            size="lg"
            fullWidth
            onClick={handleAddToCart}
            isLoading={isAdding}
            leftIcon={addedSuccess ? <Check size={18} /> : <ShoppingCart size={18} />}
          >
            {addedSuccess ? 'Added to Cart!' : 'Add to Cart'}
          </Button>
          <Button
            variant="secondary"
            size="lg"
            fullWidth
            onClick={handleBuyNow}
            leftIcon={<Zap size={18} />}
          >
            Buy Now
          </Button>
        </div>
      </div>
    </div>
  );
};
