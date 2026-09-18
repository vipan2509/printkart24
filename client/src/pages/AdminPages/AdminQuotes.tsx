import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { BulkQuote } from '../../types';
import { Button } from '../../components/Button/Button';
import { Badge } from '../../components/Badge/Badge';
import { Modal } from '../../components/Modal/Modal';
import {
  Briefcase,
  Mail,
  Phone,
  Clock,
  Search,
  CheckCircle,
  Edit
} from 'lucide-react';

const QUOTE_STATUSES = ['ALL', 'NEW', 'CONTACTED', 'QUOTED', 'CLOSED'];

export const AdminQuotes: React.FC = () => {
  const [quotes, setQuotes] = useState<BulkQuote[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Active Quote Modal
  const [activeQuote, setActiveQuote] = useState<BulkQuote | null>(null);
  const [newStatus, setNewStatus] = useState<string>('NEW');
  const [estimatedAmount, setEstimatedAmount] = useState<string>('');
  const [adminNotes, setAdminNotes] = useState<string>('');
  const [saving, setSaving] = useState<boolean>(false);
  const [saveSuccess, setSaveSuccess] = useState<string>('');

  const fetchQuotes = async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/quotes');
      if (res.data.success) {
        setQuotes(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load bulk quotes', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuotes();
  }, []);

  const handleOpenQuote = (quote: BulkQuote) => {
    setActiveQuote(quote);
    setNewStatus(quote.status);
    setEstimatedAmount(quote.estimatedAmount ? String(quote.estimatedAmount) : '');
    setAdminNotes(quote.adminNotes || '');
    setSaveSuccess('');
  };

  const handleUpdateQuote = async () => {
    if (!activeQuote) return;
    setSaving(true);
    setSaveSuccess('');
    try {
      const res = await api.put(`/admin/quotes/${activeQuote.id}`, {
        status: newStatus,
        adminNotes: adminNotes.trim() || undefined,
        estimatedAmount: estimatedAmount ? parseFloat(estimatedAmount) : undefined
      });

      if (res.data.success) {
        setSaveSuccess('Quote successfully updated');
        setQuotes(prev =>
          prev.map(q =>
            q.id === activeQuote.id
              ? { ...q, status: newStatus, adminNotes, estimatedAmount: estimatedAmount ? parseFloat(estimatedAmount) : undefined }
              : q
          )
        );
        setActiveQuote(prev =>
          prev
            ? { ...prev, status: newStatus, adminNotes, estimatedAmount: estimatedAmount ? parseFloat(estimatedAmount) : undefined }
            : null
        );
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to update quote');
    } finally {
      setSaving(false);
    }
  };

  const filteredQuotes = quotes.filter(q => {
    const matchesStatus = selectedStatus === 'ALL' || q.status === selectedStatus;
    const matchesSearch =
      !searchQuery ||
      q.quoteNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.email.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'NEW':
        return <Badge variant="warning">NEW INQUIRY</Badge>;
      case 'CONTACTED':
        return <Badge variant="accent">CONTACTED</Badge>;
      case 'QUOTED':
        return <Badge variant="primary">QUOTED</Badge>;
      case 'CLOSED':
        return <Badge variant="success">CLOSED / WON</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="admin-quotes-page">
      <div className="admin-header-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0B132B' }}>Bulk & Corporate Quotes</h1>
          <p style={{ color: '#64748B', fontSize: '0.875rem' }}>Track B2B corporate inquiries, provide pricing proposals, and close enterprise orders.</p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Button variant="outline" size="sm" onClick={fetchQuotes} leftIcon={<Clock size={15} />}>Refresh</Button>
        </div>
      </div>

      {/* Filter Tabs & Search */}
      <div style={{ background: '#fff', padding: '1rem 1.25rem', borderRadius: '12px', border: '1px solid #E2E8F0', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {QUOTE_STATUSES.map(st => (
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
                  cursor: 'pointer'
                }}
              >
                {st}
              </button>
            ))}
          </div>

          <div style={{ position: 'relative', width: '280px' }}>
            <Search size={16} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
            <input
              type="text"
              placeholder="Search company, name, quote #..."
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
      </div>

      {/* Quotes Table */}
      <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #E2E8F0', overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: '#64748B' }}>
            Loading corporate quotes...
          </div>
        ) : filteredQuotes.length === 0 ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: '#64748B' }}>
            <Briefcase size={40} style={{ color: '#94A3B8', marginBottom: '0.5rem' }} />
            <p>No bulk quote inquiries found.</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
              <thead>
                <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0', color: '#475569', fontWeight: 600 }}>
                  <th style={{ padding: '0.85rem 1rem' }}>Quote #</th>
                  <th style={{ padding: '0.85rem 1rem' }}>Date</th>
                  <th style={{ padding: '0.85rem 1rem' }}>Company</th>
                  <th style={{ padding: '0.85rem 1rem' }}>Contact</th>
                  <th style={{ padding: '0.85rem 1rem' }}>Category</th>
                  <th style={{ padding: '0.85rem 1rem' }}>Quantity</th>
                  <th style={{ padding: '0.85rem 1rem' }}>Est. Value</th>
                  <th style={{ padding: '0.85rem 1rem' }}>Status</th>
                  <th style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredQuotes.map(quote => (
                  <tr key={quote.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                    <td style={{ padding: '0.85rem 1rem', fontWeight: 600, color: '#1E60D5' }}>
                      #{quote.quoteNumber}
                    </td>
                    <td style={{ padding: '0.85rem 1rem', color: '#64748B', fontSize: '0.8rem' }}>
                      {new Date(quote.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                    </td>
                    <td style={{ padding: '0.85rem 1rem', fontWeight: 600, color: '#0B132B' }}>
                      {quote.companyName}
                    </td>
                    <td style={{ padding: '0.85rem 1rem' }}>
                      <div>{quote.name}</div>
                      <div style={{ fontSize: '0.75rem', color: '#64748B' }}>{quote.phone}</div>
                    </td>
                    <td style={{ padding: '0.85rem 1rem' }}>
                      <span style={{ background: '#F1F5F9', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem' }}>
                        {quote.productCategory}
                      </span>
                    </td>
                    <td style={{ padding: '0.85rem 1rem', fontWeight: 600 }}>
                      {quote.quantity.toLocaleString('en-IN')} pcs
                    </td>
                    <td style={{ padding: '0.85rem 1rem', fontWeight: 600, color: '#0B132B' }}>
                      {quote.estimatedAmount ? `₹${quote.estimatedAmount.toLocaleString('en-IN')}` : '—'}
                    </td>
                    <td style={{ padding: '0.85rem 1rem' }}>
                      {getStatusBadge(quote.status)}
                    </td>
                    <td style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>
                      <Button
                        variant="secondary"
                        size="sm"
                        leftIcon={<Edit size={14} />}
                        onClick={() => handleOpenQuote(quote)}
                      >
                        Respond
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Quote Details & Response Modal */}
      {activeQuote && (
        <Modal
          isOpen={!!activeQuote}
          onClose={() => setActiveQuote(null)}
          title={`Bulk Inquiry #${activeQuote.quoteNumber} - ${activeQuote.companyName}`}
          size="md"
        >
          <div style={{ padding: '0.5rem 0' }}>
            {saveSuccess && (
              <div style={{ background: '#ECFDF5', color: '#065F46', padding: '0.65rem 0.85rem', borderRadius: '6px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                <CheckCircle size={15} /> {saveSuccess}
              </div>
            )}

            {/* Inquiry Details */}
            <div style={{ background: '#F8FAFC', padding: '1rem', borderRadius: '8px', border: '1px solid #E2E8F0', marginBottom: '1.25rem', fontSize: '0.85rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.75rem' }}>
                <div>
                  <span style={{ color: '#64748B', display: 'block', fontSize: '0.75rem' }}>Contact Person</span>
                  <strong>{activeQuote.name}</strong>
                </div>
                <div>
                  <span style={{ color: '#64748B', display: 'block', fontSize: '0.75rem' }}>Company / Organization</span>
                  <strong>{activeQuote.companyName}</strong>
                </div>
                <div>
                  <span style={{ color: '#64748B', display: 'block', fontSize: '0.75rem' }}>Email Address</span>
                  <a href={`mailto:${activeQuote.email}`} style={{ color: '#1E60D5', textDecoration: 'none' }}>{activeQuote.email}</a>
                </div>
                <div>
                  <span style={{ color: '#64748B', display: 'block', fontSize: '0.75rem' }}>Phone / WhatsApp</span>
                  <a href={`tel:${activeQuote.phone}`} style={{ color: '#1E60D5', textDecoration: 'none' }}>{activeQuote.phone}</a>
                </div>
                <div>
                  <span style={{ color: '#64748B', display: 'block', fontSize: '0.75rem' }}>Product & Qty Required</span>
                  <strong>{activeQuote.productCategory} — {activeQuote.quantity.toLocaleString('en-IN')} units</strong>
                </div>
                <div>
                  <span style={{ color: '#64748B', display: 'block', fontSize: '0.75rem' }}>Target Delivery Date</span>
                  <strong>{activeQuote.requiredDate || 'Not specified'}</strong>
                </div>
              </div>

              <div>
                <span style={{ color: '#64748B', display: 'block', fontSize: '0.75rem', marginBottom: '0.2rem' }}>Client Specifications / Message</span>
                <p style={{ margin: 0, padding: '0.5rem', background: '#FFF', borderRadius: '4px', border: '1px solid #CBD5E1', color: '#334155' }}>
                  {activeQuote.message}
                </p>
              </div>
            </div>

            {/* Admin Response & Quote Formulation */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#334155', marginBottom: '0.35rem' }}>
                  Inquiry Status
                </label>
                <select
                  value={newStatus}
                  onChange={e => setNewStatus(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.55rem',
                    borderRadius: '6px',
                    border: '1px solid #CBD5E1',
                    fontSize: '0.875rem'
                  }}
                >
                  <option value="NEW">NEW (Awaiting review)</option>
                  <option value="CONTACTED">CONTACTED (Sales reaching out)</option>
                  <option value="QUOTED">QUOTED (Formal proposal sent)</option>
                  <option value="CLOSED">CLOSED (Deal won / converted)</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#334155', marginBottom: '0.35rem' }}>
                  Estimated Total Quote (₹)
                </label>
                <input
                  type="number"
                  placeholder="e.g. 85000"
                  value={estimatedAmount}
                  onChange={e => setEstimatedAmount(e.target.value)}
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

            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#334155', marginBottom: '0.35rem' }}>
                Internal Production / Pricing Notes
              </label>
              <textarea
                rows={3}
                placeholder="e.g. Offered 15% volume tier discount + free sample prototype dispatch by Friday."
                value={adminNotes}
                onChange={e => setAdminNotes(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.55rem',
                  borderRadius: '6px',
                  border: '1px solid #CBD5E1',
                  fontSize: '0.875rem'
                }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <Button variant="outline" onClick={() => setActiveQuote(null)}>Cancel</Button>
              <Button variant="primary" isLoading={saving} onClick={handleUpdateQuote}>
                Save Quote Changes
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default AdminQuotes;
