import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Order, OrderItem } from '../../types';
import { Button } from '../../components/Button/Button';
import { Badge } from '../../components/Badge/Badge';
import { Modal } from '../../components/Modal/Modal';
import {
  Eye,
  Truck,
  Search,
  CheckCircle,
  Clock,
  Box,
  Layers,
  Download,
} from 'lucide-react';

const STATUS_OPTIONS = [
  'ALL',
  'PENDING',
  'CONFIRMED',
  'DESIGN_REVIEW',
  'DESIGN_APPROVED',
  'PRINTING',
  'PACKED',
  'SHIPPED',
  'DELIVERED',
  'CANCELLED'
];

export const AdminOrders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Modal state
  const [activeOrder, setActiveOrder] = useState<Order | null>(null);
  const [inspectItem, setInspectItem] = useState<OrderItem | null>(null);
  const [updating, setUpdating] = useState<boolean>(false);
  const [updateSuccess, setUpdateSuccess] = useState<string>('');

  // Form state for order status & tracking
  const [newStatus, setNewStatus] = useState<string>('');
  const [trackingNumber, setTrackingNumber] = useState<string>('');
  const [internalNotes, setInternalNotes] = useState<string>('');

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const params: any = {};
      if (selectedStatus !== 'ALL') params.status = selectedStatus;
      if (searchQuery.trim()) params.search = searchQuery.trim();

      const res = await api.get('/admin/orders', { params });
      if (res.data.success) {
        setOrders(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load orders', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [selectedStatus]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchOrders();
  };

  const handleOpenOrder = (order: Order) => {
    setActiveOrder(order);
    setNewStatus(order.orderStatus);
    setTrackingNumber(order.trackingNumber || '');
    setInternalNotes('');
    setUpdateSuccess('');
    // If order has items with custom design, pre-select first custom design item
    const customItem = order.items.find(i => i.customDesignPreviewUrl || i.customDesignJson);
    setInspectItem(customItem || order.items[0] || null);
  };

  const handleUpdateStatus = async () => {
    if (!activeOrder) return;
    setUpdating(true);
    setUpdateSuccess('');
    try {
      const res = await api.put(`/admin/orders/${activeOrder.id}/status`, {
        orderStatus: newStatus,
        trackingNumber: trackingNumber.trim() || undefined,
        internalNotes: internalNotes.trim() || undefined
      });

      if (res.data.success) {
        setUpdateSuccess(`Order status updated to ${newStatus}`);
        setOrders(prev =>
          prev.map(o => (o.id === activeOrder.id ? { ...o, orderStatus: newStatus, trackingNumber } : o))
        );
        setActiveOrder(prev => (prev ? { ...prev, orderStatus: newStatus, trackingNumber } : null));
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to update order');
    } finally {
      setUpdating(false);
    }
  };

  const getStatusBadgeVariant = (status: string): 'primary' | 'accent' | 'success' | 'warning' | 'navy' | 'outline' => {
    switch (status) {
      case 'DELIVERED':
        return 'success';
      case 'SHIPPED':
      case 'PACKED':
      case 'DESIGN_APPROVED':
        return 'primary';
      case 'PRINTING':
      case 'DESIGN_REVIEW':
        return 'warning';
      case 'CANCELLED':
        return 'accent';
      default:
        return 'outline';
    }
  };

  return (
    <div className="admin-orders-page">
      <div className="admin-header-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0B132B' }}>Orders Management</h1>
          <p style={{ color: '#64748B', fontSize: '0.875rem' }}>Review customer printing orders, verify custom proofs, and manage fulfillment.</p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Button variant="outline" size="sm" onClick={fetchOrders} leftIcon={<Clock size={15} />}>Refresh</Button>
        </div>
      </div>

      {/* Filters & Search Bar */}
      <div style={{ background: '#fff', padding: '1rem 1.25rem', borderRadius: '12px', border: '1px solid #E2E8F0', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          {/* Status Tabs */}
          <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.25rem' }}>
            {STATUS_OPTIONS.map(st => (
              <button
                key={st}
                onClick={() => setSelectedStatus(st)}
                style={{
                  padding: '0.4rem 0.85rem',
                  borderRadius: '20px',
                  border: selectedStatus === st ? '1px solid #1E60D5' : '1px solid #CBD5E1',
                  background: selectedStatus === st ? '#EFF6FF' : '#F8FAFC',
                  color: selectedStatus === st ? '#1E60D5' : '#475569',
                  fontWeight: selectedStatus === st ? 600 : 500,
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap'
                }}
              >
                {st.replace(/_/g, ' ')}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '0.5rem', minWidth: '260px' }}>
            <div style={{ position: 'relative', width: '100%' }}>
              <Search size={16} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
              <input
                type="text"
                placeholder="Search by Order #, Name..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.45rem 0.75rem 0.45rem 2rem',
                  fontSize: '0.875rem',
                  borderRadius: '8px',
                  border: '1px solid #CBD5E1',
                  outline: 'none'
                }}
              />
            </div>
            <Button type="submit" size="sm">Search</Button>
          </form>
        </div>
      </div>

      {/* Orders Table */}
      <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #E2E8F0', overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: '#64748B' }}>
            Loading print orders...
          </div>
        ) : orders.length === 0 ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: '#64748B' }}>
            <Box size={40} style={{ color: '#94A3B8', marginBottom: '0.5rem' }} />
            <p>No orders found matching this filter.</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
              <thead>
                <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0', color: '#475569', fontWeight: 600 }}>
                  <th style={{ padding: '0.85rem 1rem' }}>Order ID</th>
                  <th style={{ padding: '0.85rem 1rem' }}>Date</th>
                  <th style={{ padding: '0.85rem 1rem' }}>Customer</th>
                  <th style={{ padding: '0.85rem 1rem' }}>Items</th>
                  <th style={{ padding: '0.85rem 1rem' }}>Amount</th>
                  <th style={{ padding: '0.85rem 1rem' }}>Payment</th>
                  <th style={{ padding: '0.85rem 1rem' }}>Fulfillment Status</th>
                  <th style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map(order => {
                  const hasCustomDesign = order.items.some(i => i.customDesignPreviewUrl || i.customDesignJson);
                  return (
                    <tr key={order.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                      <td style={{ padding: '0.85rem 1rem', fontWeight: 600, color: '#1E60D5' }}>
                        #{order.orderNumber}
                      </td>
                      <td style={{ padding: '0.85rem 1rem', color: '#64748B', fontSize: '0.8rem' }}>
                        {new Date(order.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </td>
                      <td style={{ padding: '0.85rem 1rem' }}>
                        <div style={{ fontWeight: 600, color: '#0B132B' }}>{order.customerName}</div>
                        <div style={{ fontSize: '0.75rem', color: '#64748B' }}>{order.customerEmail}</div>
                      </td>
                      <td style={{ padding: '0.85rem 1rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                          <span>{order.items.length} item{order.items.length > 1 ? 's' : ''}</span>
                          {hasCustomDesign && (
                            <span style={{ background: '#FDF2F8', color: '#BE185D', fontSize: '0.65rem', padding: '0.1rem 0.35rem', borderRadius: '4px', fontWeight: 600 }}>
                              Custom Proof
                            </span>
                          )}
                        </div>
                      </td>
                      <td style={{ padding: '0.85rem 1rem', fontWeight: 600, color: '#0B132B' }}>
                        ₹{order.totalAmount.toLocaleString('en-IN')}
                      </td>
                      <td style={{ padding: '0.85rem 1rem' }}>
                        <Badge variant={order.paymentStatus === 'COMPLETED' ? 'success' : 'warning'}>
                          {order.paymentStatus}
                        </Badge>
                      </td>
                      <td style={{ padding: '0.85rem 1rem' }}>
                        <Badge variant={getStatusBadgeVariant(order.orderStatus)}>
                          {order.orderStatus.replace(/_/g, ' ')}
                        </Badge>
                      </td>
                      <td style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>
                        <Button
                          variant="secondary"
                          size="sm"
                          leftIcon={<Eye size={14} />}
                          onClick={() => handleOpenOrder(order)}
                        >
                          Review & Ship
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Order & Custom Proof Inspector Modal */}
      {activeOrder && (
        <Modal
          isOpen={!!activeOrder}
          onClose={() => setActiveOrder(null)}
          title={`Order #${activeOrder.orderNumber} Review & Proof Verification`}
          size="lg"
        >
          <div className="order-modal-content" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', maxHeight: '75vh', overflowY: 'auto', paddingRight: '0.5rem' }}>
            {/* Left Column: Proof Inspector & Items */}
            <div>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#0B132B', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Layers size={18} style={{ color: '#1E60D5' }} /> Print Items & Proof Inspector
              </h3>

              {/* Item Selector Pills */}
              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
                {activeOrder.items.map((item, idx) => (
                  <button
                    key={item.id}
                    onClick={() => setInspectItem(item)}
                    style={{
                      padding: '0.35rem 0.65rem',
                      borderRadius: '6px',
                      border: inspectItem?.id === item.id ? '2px solid #1E60D5' : '1px solid #CBD5E1',
                      background: inspectItem?.id === item.id ? '#EFF6FF' : '#FFF',
                      fontSize: '0.75rem',
                      fontWeight: inspectItem?.id === item.id ? 700 : 500,
                      cursor: 'pointer'
                    }}
                  >
                    #{idx + 1} {item.productName.substring(0, 18)}... ({item.quantity} pcs)
                  </button>
                ))}
              </div>

              {/* Selected Item Proof Card */}
              {inspectItem && (
                <div style={{ border: '1px solid #E2E8F0', borderRadius: '8px', padding: '1rem', background: '#F8FAFC' }}>
                  <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#0B132B', marginBottom: '0.25rem' }}>
                    {inspectItem.productName}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#64748B', marginBottom: '0.75rem' }}>
                    SKU: {inspectItem.productSku} | Qty: {inspectItem.quantity} | Total: ₹{inspectItem.totalPrice.toLocaleString('en-IN')}
                  </div>

                  {/* Visual Proof / Canvas Snapshot */}
                  <div style={{ background: '#FFF', border: '1px solid #CBD5E1', borderRadius: '6px', padding: '0.75rem', textAlign: 'center', marginBottom: '0.75rem' }}>
                    {inspectItem.customDesignPreviewUrl ? (
                      <div>
                        <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#1E60D5', marginBottom: '0.5rem' }}>
                          Custom Customer Print Proof
                        </div>
                        <img
                          src={inspectItem.customDesignPreviewUrl}
                          alt="Custom Proof"
                          style={{ maxWidth: '100%', maxHeight: '220px', objectFit: 'contain', borderRadius: '4px', border: '1px dashed #94A3B8' }}
                        />
                        <div style={{ marginTop: '0.5rem' }}>
                          <a
                            href={inspectItem.customDesignPreviewUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            download={`proof-${activeOrder.orderNumber}-${inspectItem.productSku}.png`}
                            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.75rem', color: '#1E60D5', fontWeight: 600, textDecoration: 'none' }}
                          >
                            <Download size={14} /> Open High-Res Print File
                          </a>
                        </div>
                      </div>
                    ) : inspectItem.productImage ? (
                      <div>
                        <div style={{ fontSize: '0.75rem', color: '#64748B', marginBottom: '0.5rem' }}>Standard Product Image</div>
                        <img
                          src={inspectItem.productImage}
                          alt={inspectItem.productName}
                          style={{ maxWidth: '100%', maxHeight: '180px', objectFit: 'contain' }}
                        />
                      </div>
                    ) : (
                      <div style={{ padding: '1.5rem', color: '#94A3B8', fontSize: '0.8rem' }}>No visual preview available</div>
                    )}
                  </div>

                  {/* Print Options & Specs */}
                  {inspectItem.configurationJson && (
                    <div style={{ background: '#FFF', padding: '0.65rem', borderRadius: '6px', border: '1px solid #E2E8F0', fontSize: '0.75rem' }}>
                      <div style={{ fontWeight: 600, color: '#334155', marginBottom: '0.25rem' }}>Chosen Print Specifications:</div>
                      {(() => {
                        try {
                          const config = JSON.parse(inspectItem.configurationJson);
                          return (
                            <ul style={{ paddingLeft: '1.2rem', margin: 0, color: '#475569' }}>
                              {Object.entries(config).map(([k, v]) => (
                                <li key={k}><strong>{k}:</strong> {String(v)}</li>
                              ))}
                            </ul>
                          );
                        } catch {
                          return <div>{inspectItem.configurationJson}</div>;
                        }
                      })()}
                    </div>
                  )}
                </div>
              )}

              {/* Shipping Address */}
              <div style={{ marginTop: '1rem', padding: '0.75rem', background: '#F8FAFC', borderRadius: '8px', border: '1px solid #E2E8F0', fontSize: '0.8rem' }}>
                <div style={{ fontWeight: 600, color: '#0B132B', marginBottom: '0.25rem' }}>Shipping Address</div>
                {(() => {
                  try {
                    const addr = JSON.parse(activeOrder.shippingAddressJson);
                    return (
                      <div style={{ color: '#475569', lineHeight: 1.4 }}>
                        <div>{addr.fullName} ({addr.phone})</div>
                        <div>{addr.addressLine1} {addr.addressLine2 || ''}</div>
                        <div>{addr.city}, {addr.state} - {addr.postalCode}</div>
                        <div>{addr.country}</div>
                      </div>
                    );
                  } catch {
                    return <div>{activeOrder.shippingAddressJson}</div>;
                  }
                })()}
              </div>
            </div>

            {/* Right Column: Order Management & Workflow Actions */}
            <div style={{ borderLeft: '1px solid #E2E8F0', paddingLeft: '1.25rem' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#0B132B', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Truck size={18} style={{ color: '#1E60D5' }} /> Fulfillment Workflow
              </h3>

              {updateSuccess && (
                <div style={{ background: '#ECFDF5', color: '#065F46', padding: '0.65rem 0.85rem', borderRadius: '6px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                  <CheckCircle size={15} /> {updateSuccess}
                </div>
              )}

              {/* Status Stepper */}
              <div style={{ marginBottom: '1.25rem' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#334155', marginBottom: '0.35rem' }}>
                  Update Order Stage
                </label>
                <select
                  value={newStatus}
                  onChange={e => setNewStatus(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.55rem',
                    borderRadius: '6px',
                    border: '1px solid #CBD5E1',
                    fontSize: '0.875rem',
                    background: '#FFF'
                  }}
                >
                  <option value="PENDING">PENDING (Awaiting confirmation)</option>
                  <option value="CONFIRMED">CONFIRMED (Payment verified)</option>
                  <option value="DESIGN_REVIEW">DESIGN_REVIEW (Pre-press check)</option>
                  <option value="DESIGN_APPROVED">DESIGN_APPROVED (Ready to print)</option>
                  <option value="PRINTING">PRINTING (On the press)</option>
                  <option value="PACKED">PACKED (In packaging)</option>
                  <option value="SHIPPED">SHIPPED (With courier)</option>
                  <option value="DELIVERED">DELIVERED (Fulfilled)</option>
                  <option value="CANCELLED">CANCELLED</option>
                </select>
              </div>

              {/* Courier Tracking */}
              <div style={{ marginBottom: '1.25rem' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#334155', marginBottom: '0.35rem' }}>
                  Courier AWB / Tracking Number
                </label>
                <input
                  type="text"
                  placeholder="e.g. BD928410294IN (BlueDart / Delhivery)"
                  value={trackingNumber}
                  onChange={e => setTrackingNumber(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.55rem',
                    borderRadius: '6px',
                    border: '1px solid #CBD5E1',
                    fontSize: '0.875rem'
                  }}
                />
              </div>

              {/* Internal Notes */}
              <div style={{ marginBottom: '1.25rem' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#334155', marginBottom: '0.35rem' }}>
                  Internal Pre-Press / Production Notes
                </label>
                <textarea
                  rows={3}
                  placeholder="e.g. Customer approved bleed adjustments. Sent to Heidelberg 4-color offset."
                  value={internalNotes}
                  onChange={e => setInternalNotes(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.55rem',
                    borderRadius: '6px',
                    border: '1px solid #CBD5E1',
                    fontSize: '0.875rem'
                  }}
                />
              </div>

              {/* Quick Summary Box */}
              <div style={{ background: '#F8FAFC', padding: '0.75rem', borderRadius: '8px', border: '1px solid #E2E8F0', fontSize: '0.8rem', marginBottom: '1.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                  <span style={{ color: '#64748B' }}>Subtotal:</span>
                  <span style={{ fontWeight: 600 }}>₹{activeOrder.subtotal.toLocaleString('en-IN')}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                  <span style={{ color: '#64748B' }}>Discount:</span>
                  <span style={{ color: '#E11D48', fontWeight: 600 }}>-₹{activeOrder.discount.toLocaleString('en-IN')}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                  <span style={{ color: '#64748B' }}>GST (18%):</span>
                  <span>₹{activeOrder.tax.toLocaleString('en-IN')}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                  <span style={{ color: '#64748B' }}>Shipping:</span>
                  <span>{activeOrder.shippingFee === 0 ? 'FREE' : `₹${activeOrder.shippingFee}`}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '0.35rem', borderTop: '1px solid #CBD5E1', fontWeight: 700, fontSize: '0.9rem', color: '#0B132B' }}>
                  <span>Total Paid:</span>
                  <span style={{ color: '#1E60D5' }}>₹{activeOrder.totalAmount.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                <Button variant="outline" onClick={() => setActiveOrder(null)}>Close</Button>
                <Button variant="primary" isLoading={updating} onClick={handleUpdateStatus}>
                  Update & Save
                </Button>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default AdminOrders;
