import React, { useState, useEffect } from 'react';
import { useSearchParams, useParams } from 'react-router-dom';
import { Search, CheckCircle, Clock, Truck, Printer, PackageCheck, Box } from 'lucide-react';
import api from '../services/api';
import { Order } from '../types';
import { Button } from '../components/Button/Button';

export const OrderTrackingPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const { orderNumber: routeOrderNum } = useParams<{ orderNumber?: string }>();
  const initialOrderNum = routeOrderNum || searchParams.get('orderNumber') || '';

  const [orderNumberInput, setOrderNumberInput] = useState(initialOrderNum);
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const trackingStages = [
    { key: 'CONFIRMED', label: 'Order Confirmed', icon: <CheckCircle size={18} /> },
    { key: 'DESIGN_REVIEW', label: 'Design Review', icon: <Clock size={18} /> },
    { key: 'DESIGN_APPROVED', label: 'Design Approved', icon: <PackageCheck size={18} /> },
    { key: 'PRINTING', label: 'Printing Press', icon: <Printer size={18} /> },
    { key: 'QUALITY_CHECK', label: 'Quality Check', icon: <CheckCircle size={18} /> },
    { key: 'PACKED', label: 'Packed', icon: <Box size={18} /> },
    { key: 'SHIPPED', label: 'Dispatched', icon: <Truck size={18} /> },
    { key: 'DELIVERED', label: 'Delivered', icon: <CheckCircle size={18} /> },
  ];

  const getStageIndex = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 0;
      case 'CONFIRMED':
        return 0;
      case 'DESIGN_REVIEW':
        return 1;
      case 'DESIGN_APPROVED':
        return 2;
      case 'PRINTING':
        return 3;
      case 'QUALITY_CHECK':
        return 4;
      case 'PACKED':
        return 5;
      case 'SHIPPED':
      case 'OUT_FOR_DELIVERY':
        return 6;
      case 'DELIVERED':
        return 7;
      default:
        return 1;
    }
  };

  const handleTrack = async (numToSearch: string) => {
    if (!numToSearch.trim()) return;
    setLoading(true);
    setErrorMsg(null);
    try {
      const res = await api.get(`/orders/${numToSearch.trim()}`);
      if (res.data.success) {
        setOrder(res.data.data);
      } else {
        setErrorMsg('Order not found. Please verify your order number.');
      }
    } catch (err: any) {
      setErrorMsg('Could not locate an order matching that ID. Check your confirmation email.');
      setOrder(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialOrderNum) {
      handleTrack(initialOrderNum);
    }
  }, [initialOrderNum]);

  const activeIndex = order ? getStageIndex(order.orderStatus) : 0;

  return (
    <div className="container" style={{ padding: '4rem 1rem 6rem 1rem', maxWidth: '850px' }}>
      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <h1 style={{ fontSize: '2.25rem', color: '#0B132B', marginBottom: '0.5rem' }}>
          Track Your Print Order
        </h1>
        <p style={{ color: '#64748B', fontSize: '1.1rem' }}>
          Monitor your custom merchandise from prepress proofing to printing and doorstep dispatch.
        </p>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleTrack(orderNumberInput);
          }}
          style={{
            display: 'flex',
            maxWidth: '480px',
            margin: '2rem auto 0 auto',
            gap: '0.5rem',
          }}
        >
          <input
            type="text"
            placeholder="Enter Order # (e.g. PK10234)"
            value={orderNumberInput}
            onChange={(e) => setOrderNumberInput(e.target.value)}
            style={{
              flex: 1,
              padding: '0.75rem 1rem',
              borderRadius: '8px',
              border: '1.5px solid #CBD5E1',
              fontSize: '15px',
              outline: 'none',
              textTransform: 'uppercase',
            }}
          />
          <Button type="submit" variant="primary" isLoading={loading} leftIcon={<Search size={16} />}>
            Track
          </Button>
        </form>

        {errorMsg && (
          <p style={{ color: '#E11D48', marginTop: '1rem', fontSize: '14px' }}>{errorMsg}</p>
        )}
      </div>

      {order && (
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            border: '1px solid #E2E8F0',
            padding: '2rem',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
          }}
        >
          {/* Order Header */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderBottom: '1px solid #E2E8F0',
              paddingBottom: '1.5rem',
              marginBottom: '2rem',
              flexWrap: 'wrap',
              gap: '1rem',
            }}
          >
            <div>
              <span style={{ fontSize: '12px', color: '#64748B', textTransform: 'uppercase' }}>
                Order Number
              </span>
              <h3 style={{ fontSize: '1.5rem', color: '#1E60D5', margin: '2px 0 0 0' }}>
                #{order.orderNumber}
              </h3>
            </div>

            <div>
              <span style={{ fontSize: '12px', color: '#64748B', textTransform: 'uppercase' }}>
                Current Status
              </span>
              <div
                style={{
                  fontWeight: 700,
                  color: '#10B981',
                  background: '#ECFDF5',
                  padding: '4px 12px',
                  borderRadius: '9999px',
                  fontSize: '13px',
                }}
              >
                {order.orderStatus}
              </div>
            </div>

            {order.trackingNumber && (
              <div>
                <span style={{ fontSize: '12px', color: '#64748B', textTransform: 'uppercase' }}>
                  AWB Tracking
                </span>
                <div style={{ fontWeight: 600, fontSize: '14px' }}>
                  {order.trackingCarrier}: {order.trackingNumber}
                </div>
              </div>
            )}
          </div>

          {/* Timeline */}
          <div style={{ marginBottom: '2.5rem' }}>
            <h4 style={{ fontSize: '15px', color: '#0B132B', marginBottom: '1.5rem' }}>
              Production & Logistics Progress
            </h4>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: `repeat(${trackingStages.length}, 1fr)`,
                gap: '0.5rem',
                textAlign: 'center',
                position: 'relative',
              }}
            >
              {trackingStages.map((stage, idx) => {
                const isPassed = idx <= activeIndex;
                const isCurrent = idx === activeIndex;

                return (
                  <div key={stage.key} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div
                      style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '50%',
                        backgroundColor: isCurrent
                          ? '#1E60D5'
                          : isPassed
                          ? '#10B981'
                          : '#E2E8F0',
                        color: isPassed || isCurrent ? '#FFFFFF' : '#64748B',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: '0.5rem',
                        boxShadow: isCurrent ? '0 0 0 4px rgba(30, 96, 213, 0.2)' : 'none',
                        transition: 'all 0.2s ease',
                      }}
                    >
                      {stage.icon}
                    </div>
                    <span
                      style={{
                        fontSize: '11px',
                        fontWeight: isCurrent ? 700 : 500,
                        color: isCurrent ? '#1E60D5' : isPassed ? '#0F172A' : '#94A3B8',
                        lineHeight: 1.2,
                      }}
                    >
                      {stage.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Items Preview */}
          <div style={{ borderTop: '1px solid #E2E8F0', paddingTop: '1.5rem' }}>
            <h4 style={{ fontSize: '14px', color: '#475569', marginBottom: '1rem' }}>
              Job Artifacts & Custom Artwork
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {order.items.map((it) => (
                <div
                  key={it.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    padding: '10px 14px',
                    border: '1px solid #E2E8F0',
                    borderRadius: '8px',
                    background: '#F8FAFC',
                  }}
                >
                  {it.customDesignPreviewUrl && (
                    <img
                      src={it.customDesignPreviewUrl}
                      alt={it.productName}
                      style={{ width: 50, height: 50, objectFit: 'cover', borderRadius: '6px' }}
                    />
                  )}
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: '15px' }}>{it.productName}</div>
                    <div style={{ fontSize: '12px', color: '#64748B' }}>
                      Configured Quantity: {it.quantity} pcs
                    </div>
                  </div>
                  <div style={{ fontWeight: 700, color: '#0B132B' }}>
                    ₹{it.totalPrice.toLocaleString('en-IN')}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
