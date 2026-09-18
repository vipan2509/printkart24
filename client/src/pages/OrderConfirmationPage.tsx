import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { CheckCircle2, ArrowRight, Package, Printer, Download, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import api from '../services/api';
import { Order } from '../types';
import { Button } from '../components/Button/Button';

export const OrderConfirmationPage: React.FC = () => {
  const { orderNumber, id } = useParams<{ orderNumber?: string; id?: string }>();
  const targetOrderNum = orderNumber || id;
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Launch celebratory confetti
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch {
      // Ignored if confetti fails
    }

    async function loadOrder() {
      if (!targetOrderNum) return;
      try {
        setLoading(true);
        const res = await api.get(`/orders/${targetOrderNum}`);
        if (res.data.success) {
          setOrder(res.data.data);
        }
      } catch (err) {
        console.error('Error fetching order confirmation:', err);
      } finally {
        setLoading(false);
      }
    }

    loadOrder();
  }, [targetOrderNum]);

  if (loading) {
    return (
      <div className="container" style={{ padding: '6rem 0', textAlign: 'center' }}>
        <span className="spinner" style={{ width: 40, height: 40, color: '#1E60D5' }} />
        <p style={{ marginTop: '1rem', color: '#64748B' }}>Loading order details...</p>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '4rem 1rem 6rem 1rem', maxWidth: '750px' }}>
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '16px',
          border: '1px solid #E2E8F0',
          padding: '2.5rem',
          boxShadow: '0 10px 25px -5px rgba(15, 23, 42, 0.08)',
          textAlign: 'center',
        }}
      >
        <CheckCircle2 size={64} color="#10B981" style={{ margin: '0 auto 1.5rem auto' }} />
        <h1 style={{ fontSize: '2rem', color: '#0B132B', marginBottom: '0.5rem' }}>
          Order Confirmed!
        </h1>
        <p style={{ color: '#64748B', fontSize: '1.1rem', marginBottom: '1.5rem' }}>
          Thank you for choosing <strong>PRINTKART24</strong>. We have received your artwork and instructions.
        </p>

        <div
          style={{
            backgroundColor: '#F8FAFC',
            border: '1px solid #E2E8F0',
            borderRadius: '12px',
            padding: '1.25rem',
            margin: '0 auto 2rem auto',
            textAlign: 'left',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '15px' }}>
            <span>Order Reference:</span>
            <strong style={{ color: '#15013F' }}>#{order?.orderNumber || targetOrderNum}</strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '15px' }}>
            <span>Total Amount Paid:</span>
            <strong style={{ color: '#0B132B' }}>
              ₹{order?.totalAmount != null ? order.totalAmount.toLocaleString('en-IN') : '2,499'}
            </strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '15px' }}>
            <span>Current Production Status:</span>
            <span
              style={{
                backgroundColor: '#ECFDF5',
                color: '#10B981',
                padding: '2px 8px',
                borderRadius: '9999px',
                fontSize: '12px',
                fontWeight: 700,
              }}
            >
              {order?.orderStatus || 'CONFIRMED'}
            </span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '15px' }}>
            <span>Estimated Delivery:</span>
            <span>
              {order?.estimatedDelivery
                ? new Date(order.estimatedDelivery).toLocaleDateString('en-IN', {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric',
                  })
                : 'Within 4-5 business days'}
            </span>
          </div>
        </div>

        {/* Ordered items preview */}
        {order?.items && order.items.length > 0 && (
          <div style={{ textAlign: 'left', marginBottom: '2rem' }}>
            <h4 style={{ fontSize: '14px', color: '#475569', marginBottom: '0.75rem', textTransform: 'uppercase' }}>
              Items in this job:
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {order.items.map((it) => (
                <div
                  key={it.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    padding: '8px 12px',
                    border: '1px solid #E2E8F0',
                    borderRadius: '8px',
                  }}
                >
                  {it.customDesignPreviewUrl && (
                    <img
                      src={it.customDesignPreviewUrl}
                      alt={it.productName}
                      style={{ width: 44, height: 44, objectFit: 'cover', borderRadius: 4 }}
                    />
                  )}
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: '14px' }}>{it.productName}</div>
                    <div style={{ fontSize: '12px', color: '#64748B' }}>Qty: {it.quantity}</div>
                  </div>
                  <div style={{ fontWeight: 700 }}>₹{it.totalPrice.toLocaleString('en-IN')}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Button
            variant="primary"
            size="lg"
            onClick={() => navigate(`/track-order?orderNumber=${order?.orderNumber || orderNumber}`)}
            leftIcon={<Package size={18} />}
          >
            Track Order Status
          </Button>

          <Button
            variant="outline"
            size="lg"
            onClick={() => navigate('/products')}
            rightIcon={<ArrowRight size={18} />}
          >
            Continue Shopping
          </Button>
        </div>
      </div>
    </div>
  );
};
