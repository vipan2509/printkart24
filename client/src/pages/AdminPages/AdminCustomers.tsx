import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Button } from '../../components/Button/Button';
import { Badge } from '../../components/Badge/Badge';
import {
  Users,
  Search,
  Mail,
  Phone,
  Clock,
} from 'lucide-react';

interface CustomerSummary {
  id: string;
  name: string;
  email: string;
  phone: string;
  totalOrders: number;
  totalSpend: number;
  createdAt: string;
  isActive: boolean;
}

export const AdminCustomers: React.FC = () => {
  const [customers, setCustomers] = useState<CustomerSummary[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/customers');
      if (res.data.success) {
        setCustomers(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load customers', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const filteredCustomers = customers.filter(c => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      c.name.toLowerCase().includes(q) ||
      c.email.toLowerCase().includes(q) ||
      c.phone.toLowerCase().includes(q)
    );
  });

  const totalRegistered = customers.length;
  const activeBuyers = customers.filter(c => c.totalOrders > 0).length;
  const totalLifetimeSpend = customers.reduce((sum, c) => sum + c.totalSpend, 0);

  return (
    <div className="admin-customers-page">
      <div className="admin-header-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0B132B' }}>Customer Directory</h1>
          <p style={{ color: '#64748B', fontSize: '0.875rem' }}>View registered client accounts, order frequency, and lifetime printing spend.</p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Button variant="outline" size="sm" onClick={fetchCustomers} leftIcon={<Clock size={15} />}>Refresh</Button>
        </div>
      </div>

      {/* Metrics Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
        <div style={{ background: '#FFF', padding: '1.25rem', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
          <div style={{ color: '#64748B', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', marginBottom: '0.25rem' }}>Total Accounts</div>
          <div style={{ fontSize: '1.75rem', fontWeight: 700, color: '#0B132B' }}>{totalRegistered}</div>
        </div>
        <div style={{ background: '#FFF', padding: '1.25rem', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
          <div style={{ color: '#64748B', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', marginBottom: '0.25rem' }}>Active Ordering Clients</div>
          <div style={{ fontSize: '1.75rem', fontWeight: 700, color: '#1E60D5' }}>{activeBuyers}</div>
        </div>
        <div style={{ background: '#FFF', padding: '1.25rem', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
          <div style={{ color: '#64748B', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', marginBottom: '0.25rem' }}>Total Customer Spend</div>
          <div style={{ fontSize: '1.75rem', fontWeight: 700, color: '#10B981' }}>₹{totalLifetimeSpend.toLocaleString('en-IN')}</div>
        </div>
      </div>

      {/* Search Input */}
      <div style={{ background: '#fff', padding: '1rem 1.25rem', borderRadius: '12px', border: '1px solid #E2E8F0', marginBottom: '1.5rem' }}>
        <div style={{ position: 'relative', maxWidth: '380px' }}>
          <Search size={16} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
          <input
            type="text"
            placeholder="Search by customer name, email, or phone..."
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
      </div>

      {/* Customers Table */}
      <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #E2E8F0', overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: '#64748B' }}>
            Loading customer accounts...
          </div>
        ) : filteredCustomers.length === 0 ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: '#64748B' }}>
            <Users size={40} style={{ color: '#94A3B8', marginBottom: '0.5rem' }} />
            <p>No customers match your search criteria.</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
              <thead>
                <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0', color: '#475569', fontWeight: 600 }}>
                  <th style={{ padding: '0.85rem 1rem' }}>Customer</th>
                  <th style={{ padding: '0.85rem 1rem' }}>Contact</th>
                  <th style={{ padding: '0.85rem 1rem' }}>Joined Date</th>
                  <th style={{ padding: '0.85rem 1rem' }}>Total Orders</th>
                  <th style={{ padding: '0.85rem 1rem' }}>Lifetime Spend</th>
                  <th style={{ padding: '0.85rem 1rem' }}>Account Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredCustomers.map(cust => (
                  <tr key={cust.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                    <td style={{ padding: '0.85rem 1rem' }}>
                      <div style={{ fontWeight: 600, color: '#0B132B' }}>{cust.name}</div>
                      <div style={{ fontSize: '0.75rem', color: '#64748B' }}>ID: {cust.id.substring(0, 8)}...</div>
                    </td>
                    <td style={{ padding: '0.85rem 1rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#334155' }}>
                        <Mail size={13} color="#94A3B8" /> {cust.email}
                      </div>
                      {cust.phone && cust.phone !== 'N/A' && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#64748B', fontSize: '0.75rem', marginTop: '0.2rem' }}>
                          <Phone size={13} color="#94A3B8" /> {cust.phone}
                        </div>
                      )}
                    </td>
                    <td style={{ padding: '0.85rem 1rem', color: '#64748B', fontSize: '0.8rem' }}>
                      {new Date(cust.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </td>
                    <td style={{ padding: '0.85rem 1rem', fontWeight: 600 }}>
                      {cust.totalOrders} {cust.totalOrders === 1 ? 'order' : 'orders'}
                    </td>
                    <td style={{ padding: '0.85rem 1rem', fontWeight: 700, color: '#0B132B' }}>
                      ₹{cust.totalSpend.toLocaleString('en-IN')}
                    </td>
                    <td style={{ padding: '0.85rem 1rem' }}>
                      <Badge variant={cust.isActive ? 'success' : 'outline'}>
                        {cust.isActive ? 'ACTIVE' : 'SUSPENDED'}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminCustomers;
