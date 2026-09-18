import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  Heart,
  MapPin,
  User,
  LogOut,
  Truck,
  Eye,
  ExternalLink,
} from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useWishlistStore } from '../store/wishlistStore';
import { useCartStore } from '../store/cartStore';
import api from '../services/api';
import { Order } from '../types';
import { Button } from '../components/Button/Button';
import './AccountPage.scss';

export const AccountPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuthStore();
  const { items: wishlistItems, toggleWishlist, fetchWishlist } = useWishlistStore();
  const { addItem } = useCartStore();

  const tabParam = searchParams.get('tab') || 'dashboard';
  const [activeTab, setActiveTab] = useState(tabParam);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    async function loadOrders() {
      try {
        setLoadingOrders(true);
        const res = await api.get('/orders/my-orders');
        if (res.data.success) {
          setOrders(res.data.data);
        }
      } catch (err) {
        console.error('Error fetching orders:', err);
      } finally {
        setLoadingOrders(false);
      }
    }

    loadOrders();
    fetchWishlist();
  }, [isAuthenticated, navigate, fetchWishlist]);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setSearchParams({ tab });
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const completedOrders = orders.filter((o) => o.paymentStatus === 'COMPLETED');
  const totalSpent = completedOrders.reduce((sum, o) => sum + o.totalAmount, 0);

  return (
    <div className="pk-account">
      <div className="container">
        <div className="pk-account__layout">
          {/* Sidebar */}
          <aside className="pk-account__sidebar">
            <div className="user-card">
              <div className="avatar">
                {user?.firstName?.[0]}
                {user?.lastName?.[0]}
              </div>
              <div>
                <div className="name">{user?.firstName} {user?.lastName}</div>
                <div className="email">{user?.email}</div>
              </div>
            </div>

            <nav className="nav-links">
              <button
                className={`account-nav-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
                onClick={() => handleTabChange('dashboard')}
              >
                <LayoutDashboard size={18} />
                <span>Dashboard</span>
              </button>

              <button
                className={`account-nav-btn ${activeTab === 'orders' ? 'active' : ''}`}
                onClick={() => handleTabChange('orders')}
              >
                <Package size={18} />
                <span>My Orders ({orders.length})</span>
              </button>

              <button
                className={`account-nav-btn ${activeTab === 'wishlist' ? 'active' : ''}`}
                onClick={() => handleTabChange('wishlist')}
              >
                <Heart size={18} />
                <span>Wishlist ({wishlistItems.length})</span>
              </button>

              <button
                className={`account-nav-btn ${activeTab === 'addresses' ? 'active' : ''}`}
                onClick={() => handleTabChange('addresses')}
              >
                <MapPin size={18} />
                <span>Addresses</span>
              </button>

              <button
                className={`account-nav-btn ${activeTab === 'profile' ? 'active' : ''}`}
                onClick={() => handleTabChange('profile')}
              >
                <User size={18} />
                <span>Profile Settings</span>
              </button>

              <button className="account-nav-btn logout" onClick={handleLogout}>
                <LogOut size={18} />
                <span>Sign Out</span>
              </button>
            </nav>
          </aside>

          {/* Main Tab Content */}
          <main className="pk-account__content">
            {/* 1. DASHBOARD OVERVIEW */}
            {activeTab === 'dashboard' && (
              <div>
                <h2>Account Overview</h2>

                <div className="stat-cards-grid">
                  <div className="stat-card">
                    <div className="val">{orders.length}</div>
                    <div className="lbl">Total Orders Placed</div>
                  </div>
                  <div className="stat-card">
                    <div className="val">₹{totalSpent.toLocaleString('en-IN')}</div>
                    <div className="lbl">Lifetime Merchandise Spend</div>
                  </div>
                  <div className="stat-card">
                    <div className="val">{wishlistItems.length}</div>
                    <div className="lbl">Saved Wishlist Items</div>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <h3 style={{ fontSize: '1.15rem', color: '#0B132B' }}>Recent Orders</h3>
                  <Button variant="ghost" size="sm" onClick={() => handleTabChange('orders')}>
                    View All Orders →
                  </Button>
                </div>

                {orders.length === 0 ? (
                  <p style={{ color: '#64748B' }}>No orders placed yet.</p>
                ) : (
                  <table className="orders-table">
                    <thead>
                      <tr>
                        <th>Order #</th>
                        <th>Date</th>
                        <th>Items</th>
                        <th>Total</th>
                        <th>Status</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.slice(0, 4).map((ord) => (
                        <tr key={ord.id}>
                          <td><strong>#{ord.orderNumber}</strong></td>
                          <td>{new Date(ord.createdAt).toLocaleDateString('en-IN')}</td>
                          <td>{ord.items?.length || 1} product(s)</td>
                          <td>₹{ord.totalAmount.toLocaleString('en-IN')}</td>
                          <td>
                            <span
                              style={{
                                padding: '2px 8px',
                                borderRadius: '9999px',
                                fontSize: '12px',
                                fontWeight: 700,
                                background: '#ECFDF5',
                                color: '#10B981',
                              }}
                            >
                              {ord.orderStatus}
                            </span>
                          </td>
                          <td>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => navigate(`/track-order?orderNumber=${ord.orderNumber}`)}
                              leftIcon={<Truck size={14} />}
                            >
                              Track
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            )}

            {/* 2. MY ORDERS */}
            {activeTab === 'orders' && (
              <div>
                <h2>My Orders History</h2>

                {loadingOrders ? (
                  <p style={{ color: '#64748B' }}>Loading your orders...</p>
                ) : orders.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '3rem 0' }}>
                    <p style={{ color: '#64748B', marginBottom: '1rem' }}>You haven't placed any orders yet.</p>
                    <Button variant="primary" onClick={() => navigate('/products')}>
                      Explore Catalog
                    </Button>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    {orders.map((ord) => (
                      <div
                        key={ord.id}
                        style={{
                          border: '1px solid #E2E8F0',
                          borderRadius: '12px',
                          padding: '1.5rem',
                          background: '#F8FAFC',
                        }}
                      >
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            borderBottom: '1px solid #E2E8F0',
                            paddingBottom: '1rem',
                            marginBottom: '1rem',
                            flexWrap: 'wrap',
                            gap: '0.5rem',
                          }}
                        >
                          <div>
                            <span style={{ fontSize: '12px', color: '#64748B' }}>Order Placed:</span>
                            <div style={{ fontWeight: 700, color: '#0B132B' }}>
                              #{ord.orderNumber} • {new Date(ord.createdAt).toLocaleDateString('en-IN')}
                            </div>
                          </div>

                          <div>
                            <span style={{ fontSize: '12px', color: '#64748B' }}>Total:</span>
                            <div style={{ fontWeight: 700, color: '#0B132B' }}>
                              ₹{ord.totalAmount.toLocaleString('en-IN')}
                            </div>
                          </div>

                          <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <Button
                              variant="primary"
                              size="sm"
                              onClick={() => navigate(`/track-order?orderNumber=${ord.orderNumber}`)}
                              leftIcon={<Truck size={14} />}
                            >
                              Track Job
                            </Button>
                          </div>
                        </div>

                        {/* Items list */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                          {ord.items.map((it) => (
                            <div
                              key={it.id}
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '1rem',
                                background: '#FFFFFF',
                                padding: '10px 14px',
                                borderRadius: '8px',
                                border: '1px solid #E2E8F0',
                              }}
                            >
                              {it.customDesignPreviewUrl && (
                                <img
                                  src={it.customDesignPreviewUrl}
                                  alt={it.productName}
                                  style={{ width: 44, height: 44, objectFit: 'cover', borderRadius: '4px' }}
                                />
                              )}
                              <div style={{ flex: 1 }}>
                                <div style={{ fontWeight: 600, fontSize: '14px' }}>{it.productName}</div>
                                <div style={{ fontSize: '12px', color: '#64748B' }}>
                                  Qty: {it.quantity}
                                </div>
                              </div>
                              <div style={{ fontWeight: 700 }}>₹{it.totalPrice.toLocaleString('en-IN')}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* 3. WISHLIST */}
            {activeTab === 'wishlist' && (
              <div>
                <h2>My Saved Wishlist</h2>

                {wishlistItems.length === 0 ? (
                  <p style={{ color: '#64748B' }}>Your wishlist is empty.</p>
                ) : (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1rem' }}>
                    {wishlistItems.map((it: any) => (
                      <div
                        key={it.id}
                        style={{
                          border: '1px solid #E2E8F0',
                          borderRadius: '12px',
                          overflow: 'hidden',
                          background: '#FFFFFF',
                        }}
                      >
                        <img
                          src={it.product?.images?.[0]?.url}
                          alt={it.product?.name}
                          style={{ width: '100%', height: '160px', objectFit: 'cover' }}
                        />
                        <div style={{ padding: '12px' }}>
                          <h4 style={{ fontSize: '14px', margin: '0 0 4px 0' }}>{it.product?.name}</h4>
                          <div style={{ fontWeight: 700, color: '#1E60D5', marginBottom: '8px' }}>
                            ₹{it.product?.basePrice}
                          </div>
                          <div style={{ display: 'flex', gap: '6px' }}>
                            <Button
                              variant="primary"
                              size="sm"
                              fullWidth
                              onClick={() => navigate(`/products/${it.product?.slug}`)}
                            >
                              Configure
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => toggleWishlist(it.productId)}
                            >
                              Remove
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* 4. ADDRESSES */}
            {activeTab === 'addresses' && (
              <div>
                <h2>Saved Delivery Addresses</h2>
                <div
                  style={{
                    border: '1px solid #E2E8F0',
                    borderRadius: '12px',
                    padding: '1.5rem',
                    maxWidth: '450px',
                    background: '#F8FAFC',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <strong style={{ color: '#0B132B' }}>Primary Commercial Office</strong>
                    <span style={{ fontSize: '11px', background: '#ECFDF5', color: '#10B981', padding: '2px 8px', borderRadius: '9999px', fontWeight: 700 }}>
                      DEFAULT
                    </span>
                  </div>
                  <p style={{ fontSize: '14px', color: '#475569', lineHeight: 1.6 }}>
                    {user?.firstName} {user?.lastName}<br />
                    Plot 42, Cyber City, Phase 2, DLF Sector 25<br />
                    Gurugram, Haryana - 122002<br />
                    Phone: {user?.phone || '+91 98111 22334'}
                  </p>
                </div>
              </div>
            )}

            {/* 5. PROFILE */}
            {activeTab === 'profile' && (
              <div>
                <h2>Profile Information</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '400px' }}>
                  <div>
                    <label style={{ fontSize: '12px', color: '#64748B', fontWeight: 700 }}>Name</label>
                    <div style={{ fontSize: '15px', fontWeight: 600 }}>{user?.firstName} {user?.lastName}</div>
                  </div>
                  <div>
                    <label style={{ fontSize: '12px', color: '#64748B', fontWeight: 700 }}>Email Address</label>
                    <div style={{ fontSize: '15px', fontWeight: 600 }}>{user?.email}</div>
                  </div>
                  <div>
                    <label style={{ fontSize: '12px', color: '#64748B', fontWeight: 700 }}>Phone</label>
                    <div style={{ fontSize: '15px', fontWeight: 600 }}>{user?.phone || 'Not provided'}</div>
                  </div>
                  <div>
                    <label style={{ fontSize: '12px', color: '#64748B', fontWeight: 700 }}>Account Role</label>
                    <div style={{ fontSize: '15px', fontWeight: 600, color: '#1E60D5' }}>{user?.role}</div>
                  </div>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};
