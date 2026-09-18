import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  TrendingUp,
  ShoppingCart,
  Users,
  Package,
  AlertTriangle,
  MessageSquareQuote,
  Clock,
  ArrowUpRight,
} from 'lucide-react';
import api from '../../services/api';
import { Button } from '../../components/Button/Button';

export const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        setLoading(true);
        const res = await api.get('/admin/stats');
        if (res.data.success) {
          setStats(res.data.data);
        }
      } catch (err) {
        console.error('Error fetching admin stats:', err);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  if (loading) {
    return (
      <div style={{ padding: '4rem 0', textAlign: 'center' }}>
        <span className="spinner" style={{ width: 36, height: 36, color: '#1E60D5' }} />
        <p style={{ marginTop: '1rem', color: '#64748B' }}>Loading analytics metrics...</p>
      </div>
    );
  }

  const kpis = [
    {
      title: 'Total Revenue',
      value: `₹${(stats?.totalRevenue || 0).toLocaleString('en-IN')}`,
      icon: <TrendingUp size={22} color="#10B981" />,
      bg: '#ECFDF5',
    },
    {
      title: "Today's Revenue",
      value: `₹${(stats?.todayRevenue || 0).toLocaleString('en-IN')}`,
      icon: <TrendingUp size={22} color="#1E60D5" />,
      bg: '#EFF6FF',
    },
    {
      title: 'Total Orders',
      value: stats?.totalOrders || 0,
      icon: <ShoppingCart size={22} color="#8B5CF6" />,
      bg: '#F5F3FF',
    },
    {
      title: 'Pending Jobs',
      value: stats?.pendingOrders || 0,
      icon: <Clock size={22} color="#F59E0B" />,
      bg: '#FFFBEB',
    },
    {
      title: 'Total Customers',
      value: stats?.totalCustomers || 0,
      icon: <Users size={22} color="#0284C7" />,
      bg: '#F0F9FF',
    },
    {
      title: 'Active Products',
      value: stats?.totalProducts || 0,
      icon: <Package size={22} color="#10B981" />,
      bg: '#ECFDF5',
    },
    {
      title: 'Pending Quotes',
      value: stats?.pendingQuotes || 0,
      icon: <MessageSquareQuote size={22} color="#E11D48" />,
      bg: '#FFF1F2',
    },
    {
      title: 'Low Stock Alerts',
      value: stats?.lowStockProducts?.length || 0,
      icon: <AlertTriangle size={22} color="#DC2626" />,
      bg: '#FEF2F2',
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', color: '#0B132B', marginBottom: '4px' }}>
          Operations & Executive Dashboard
        </h1>
        <p style={{ color: '#64748B', fontSize: '14px' }}>
          Real-time print order throughput, production status, and sales metrics.
        </p>
      </div>

      {/* KPI Cards Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1.25rem',
          marginBottom: '2.5rem',
        }}
      >
        {kpis.map((kpi, i) => (
          <div
            key={i}
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '12px',
              padding: '1.25rem',
              border: '1px solid #E2E8F0',
              boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <span style={{ fontSize: '12px', color: '#64748B', fontWeight: 600 }}>
                {kpi.title}
              </span>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0B132B', marginTop: 4 }}>
                {kpi.value}
              </div>
            </div>
            <div
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '10px',
                backgroundColor: kpi.bg,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {kpi.icon}
            </div>
          </div>
        ))}
      </div>

      {/* Sales Velocity Chart & Recent Orders Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
          gap: '2rem',
        }}
      >
        {/* Sales Performance Visualization */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            border: '1px solid #E2E8F0',
            padding: '1.75rem',
          }}
        >
          <h3 style={{ fontSize: '1.15rem', color: '#0B132B', marginBottom: '1.25rem' }}>
            Monthly Revenue Trajectory (₹)
          </h3>
          <div style={{ display: 'flex', alignItems: 'flex-end', height: '200px', gap: '1rem', paddingTop: '1rem' }}>
            {stats?.monthlySales?.map((m: any, idx: number) => {
              const maxRev = Math.max(...stats.monthlySales.map((x: any) => x.revenue || 1));
              const heightPercent = Math.max(15, Math.round((m.revenue / maxRev) * 100));

              return (
                <div
                  key={idx}
                  style={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    height: '100%',
                    justifyContent: 'flex-end',
                  }}
                >
                  <div
                    style={{
                      width: '100%',
                      maxWidth: '38px',
                      height: `${heightPercent}%`,
                      backgroundColor: idx === stats.monthlySales.length - 1 ? '#E11D48' : '#1E60D5',
                      borderRadius: '6px 6px 0 0',
                      transition: 'height 0.3s ease',
                    }}
                    title={`₹${m.revenue.toLocaleString('en-IN')}`}
                  />
                  <span style={{ fontSize: '11px', color: '#64748B', marginTop: '6px' }}>{m.month}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Orders Overview */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            border: '1px solid #E2E8F0',
            padding: '1.75rem',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1.15rem', color: '#0B132B', margin: 0 }}>Recent Orders</h3>
            <Button variant="ghost" size="sm" onClick={() => navigate('/admin/orders')}>
              All Orders →
            </Button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {stats?.recentOrders?.map((ord: any) => (
              <div
                key={ord.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '10px 12px',
                  borderRadius: '8px',
                  backgroundColor: '#F8FAFC',
                  border: '1px solid #E2E8F0',
                }}
              >
                <div>
                  <div style={{ fontWeight: 700, fontSize: '14px', color: '#1E60D5' }}>
                    #{ord.orderNumber}
                  </div>
                  <div style={{ fontSize: '12px', color: '#64748B' }}>
                    {ord.customerName} • {new Date(ord.createdAt).toLocaleDateString('en-IN')}
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: 700, fontSize: '14px' }}>
                    ₹{ord.totalAmount.toLocaleString('en-IN')}
                  </div>
                  <span
                    style={{
                      fontSize: '11px',
                      padding: '2px 8px',
                      borderRadius: '9999px',
                      background: '#EFF6FF',
                      color: '#1E60D5',
                      fontWeight: 600,
                    }}
                  >
                    {ord.orderStatus}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
