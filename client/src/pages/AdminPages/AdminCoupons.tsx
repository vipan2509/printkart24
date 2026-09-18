import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Coupon } from '../../types';
import { Button } from '../../components/Button/Button';
import { Badge } from '../../components/Badge/Badge';
import { Modal } from '../../components/Modal/Modal';
import {
  Tag,
  Plus,
  Percent,
  CheckCircle,
  Clock,
  Scissors
} from 'lucide-react';

export const AdminCoupons: React.FC = () => {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Create Coupon Modal
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [creating, setCreating] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  // Form Fields
  const [code, setCode] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [discountType, setDiscountType] = useState<'PERCENTAGE' | 'FIXED'>('PERCENTAGE');
  const [discountValue, setDiscountValue] = useState<string>('15');
  const [minOrderAmount, setMinOrderAmount] = useState<string>('500');
  const [maxDiscount, setMaxDiscount] = useState<string>('300');

  const fetchCoupons = async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/coupons');
      if (res.data.success) {
        setCoupons(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load coupons', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleCreateCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) {
      setError('Please enter a coupon code.');
      return;
    }
    setError('');
    setCreating(true);

    try {
      const res = await api.post('/admin/coupons', {
        code: code.trim().toUpperCase(),
        description: description.trim(),
        discountType,
        discountValue: parseFloat(discountValue),
        minOrderAmount: parseFloat(minOrderAmount) || 0,
        maxDiscount: maxDiscount ? parseFloat(maxDiscount) : null,
      });

      if (res.data.success) {
        setIsModalOpen(false);
        setCode('');
        setDescription('');
        fetchCoupons();
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create coupon');
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="admin-coupons-page">
      <div className="admin-header-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0B132B' }}>Promo & Discount Coupons</h1>
          <p style={{ color: '#64748B', fontSize: '0.875rem' }}>Create marketing campaigns, tiered order discounts, and volume coupons.</p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Button variant="outline" size="sm" onClick={fetchCoupons} leftIcon={<Clock size={15} />}>Refresh</Button>
          <Button variant="primary" size="sm" onClick={() => setIsModalOpen(true)} leftIcon={<Plus size={15} />}>Create Coupon</Button>
        </div>
      </div>

      {/* Coupons List */}
      <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #E2E8F0', overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: '#64748B' }}>
            Loading coupons...
          </div>
        ) : coupons.length === 0 ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: '#64748B' }}>
            <Scissors size={40} style={{ color: '#94A3B8', marginBottom: '0.5rem' }} />
            <p>No coupons found. Create your first promotional code.</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
              <thead>
                <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0', color: '#475569', fontWeight: 600 }}>
                  <th style={{ padding: '0.85rem 1rem' }}>Code</th>
                  <th style={{ padding: '0.85rem 1rem' }}>Description</th>
                  <th style={{ padding: '0.85rem 1rem' }}>Discount</th>
                  <th style={{ padding: '0.85rem 1rem' }}>Min Order</th>
                  <th style={{ padding: '0.85rem 1rem' }}>Max Cap</th>
                  <th style={{ padding: '0.85rem 1rem' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {coupons.map(cpn => (
                  <tr key={cpn.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                    <td style={{ padding: '0.85rem 1rem' }}>
                      <span style={{ fontFamily: 'monospace', fontWeight: 700, fontSize: '0.95rem', background: '#EFF6FF', color: '#1E60D5', padding: '0.2rem 0.6rem', borderRadius: '4px', border: '1px dashed #93C5FD' }}>
                        {cpn.code}
                      </span>
                    </td>
                    <td style={{ padding: '0.85rem 1rem', color: '#475569' }}>
                      {cpn.description || 'Promotional discount coupon'}
                    </td>
                    <td style={{ padding: '0.85rem 1rem', fontWeight: 600, color: '#0B132B' }}>
                      {cpn.discountType === 'PERCENTAGE' ? `${cpn.discountValue}% OFF` : `₹${cpn.discountValue} FLAT OFF`}
                    </td>
                    <td style={{ padding: '0.85rem 1rem', color: '#64748B' }}>
                      ₹{cpn.minOrderAmount.toLocaleString('en-IN')}
                    </td>
                    <td style={{ padding: '0.85rem 1rem', color: '#64748B' }}>
                      {cpn.maxDiscount ? `₹${cpn.maxDiscount.toLocaleString('en-IN')}` : 'No limit'}
                    </td>
                    <td style={{ padding: '0.85rem 1rem' }}>
                      <Badge variant={cpn.isActive ? 'success' : 'outline'}>
                        {cpn.isActive ? 'ACTIVE' : 'INACTIVE'}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create Coupon Modal */}
      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Create New Promotional Coupon"
          size="md"
        >
          <form onSubmit={handleCreateCoupon}>
            {error && (
              <div style={{ background: '#FEF2F2', color: '#991B1B', padding: '0.65rem 0.85rem', borderRadius: '6px', fontSize: '0.8rem', marginBottom: '1rem' }}>
                {error}
              </div>
            )}

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#334155', marginBottom: '0.35rem' }}>
                Coupon Code *
              </label>
              <input
                type="text"
                placeholder="e.g. PRINTFEST25"
                value={code}
                onChange={e => setCode(e.target.value.toUpperCase())}
                required
                style={{
                  width: '100%',
                  padding: '0.55rem',
                  borderRadius: '6px',
                  border: '1px solid #CBD5E1',
                  fontSize: '0.95rem',
                  fontWeight: 600,
                  textTransform: 'uppercase'
                }}
              />
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#334155', marginBottom: '0.35rem' }}>
                Campaign Description
              </label>
              <input
                type="text"
                placeholder="e.g. 25% off on all business promotional merchandise"
                value={description}
                onChange={e => setDescription(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.55rem',
                  borderRadius: '6px',
                  border: '1px solid #CBD5E1',
                  fontSize: '0.875rem'
                }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#334155', marginBottom: '0.35rem' }}>
                  Discount Type
                </label>
                <select
                  value={discountType}
                  onChange={e => setDiscountType(e.target.value as any)}
                  style={{
                    width: '100%',
                    padding: '0.55rem',
                    borderRadius: '6px',
                    border: '1px solid #CBD5E1',
                    fontSize: '0.875rem'
                  }}
                >
                  <option value="PERCENTAGE">Percentage (%)</option>
                  <option value="FIXED">Flat Amount (₹)</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#334155', marginBottom: '0.35rem' }}>
                  Discount Value *
                </label>
                <input
                  type="number"
                  placeholder={discountType === 'PERCENTAGE' ? 'e.g. 20' : 'e.g. 150'}
                  value={discountValue}
                  onChange={e => setDiscountValue(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '0.55rem',
                    borderRadius: '6px',
                    border: '1px solid #CBD5E1',
                    fontSize: '0.875rem'
                  }}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.25rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#334155', marginBottom: '0.35rem' }}>
                  Min Order Amount (₹)
                </label>
                <input
                  type="number"
                  placeholder="e.g. 500"
                  value={minOrderAmount}
                  onChange={e => setMinOrderAmount(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.55rem',
                    borderRadius: '6px',
                    border: '1px solid #CBD5E1',
                    fontSize: '0.875rem'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#334155', marginBottom: '0.35rem' }}>
                  Max Discount Cap (₹)
                </label>
                <input
                  type="number"
                  placeholder="e.g. 500 (optional)"
                  value={maxDiscount}
                  onChange={e => setMaxDiscount(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.55rem',
                    borderRadius: '6px',
                    border: '1px solid #CBD5E1',
                    fontSize: '0.875rem'
                  }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
              <Button type="submit" variant="primary" isLoading={creating}>
                Create Coupon
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default AdminCoupons;
