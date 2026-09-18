import React, { useState, useEffect } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import api from '../services/api';
import { Product } from '../types';
import { CanvasCustomizer } from '../components/CanvasCustomizer/CanvasCustomizer';

export const CustomizerPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const location = useLocation();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  const state = location.state as {
    configuration?: Record<string, string>;
    totalPrice?: number;
    quantity?: number;
  } | null;

  useEffect(() => {
    async function loadProduct() {
      if (!slug) return;
      try {
        setLoading(true);
        const res = await api.get(`/products/${slug}`);
        if (res.data.success) {
          setProduct(res.data.data.product);
        }
      } catch (err) {
        console.error('Error loading product for customizer:', err);
      } finally {
        setLoading(false);
      }
    }

    loadProduct();
  }, [slug]);

  if (loading) {
    return (
      <div style={{ height: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0F172A', color: '#FFFFFF' }}>
        <div style={{ textAlign: 'center' }}>
          <span className="spinner" style={{ width: 40, height: 40, color: '#E11D48' }} />
          <p style={{ marginTop: '1rem', color: '#94A3B8' }}>Loading 2D Design Studio...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div style={{ padding: '4rem', textAlign: 'center', background: '#0F172A', color: '#FFFFFF', minHeight: '80vh' }}>
        <h2>Product Not Found</h2>
        <p style={{ color: '#94A3B8', marginTop: '0.5rem' }}>Unable to launch customizer for this product.</p>
        <Link to="/products" style={{ color: '#1E60D5', marginTop: '1rem', display: 'inline-block' }}>
          ← Return to Products
        </Link>
      </div>
    );
  }

  return (
    <CanvasCustomizer
      product={product}
      initialConfiguration={state?.configuration}
      initialTotalPrice={state?.totalPrice}
      initialQuantity={state?.quantity}
    />
  );
};
