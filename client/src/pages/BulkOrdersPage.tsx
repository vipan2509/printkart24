import React, { useState } from 'react';
import {
  Building2,
  CheckCircle2,
  FileUp,
  ShieldCheck,
  Send,
  Sparkles,
  Phone,
  Mail,
  Clock,
} from 'lucide-react';
import api from '../services/api';
import { Button } from '../components/Button/Button';

export const BulkOrdersPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    companyName: '',
    email: '',
    phone: '',
    productCategory: 'Corporate Gifts',
    quantity: 100,
    requiredDate: '',
    artworkUrl: '',
    message: '',
  });

  const [loading, setLoading] = useState(false);
  const [successQuote, setSuccessQuote] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    try {
      const res = await api.post('/bulk-quotes', {
        ...formData,
        quantity: parseInt(formData.quantity.toString(), 10),
      });

      if (res.data.success) {
        setSuccessQuote(res.data.data.quoteNumber);
      } else {
        setErrorMsg(res.data.message || 'Error submitting quote');
      }
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || 'Failed to submit quote inquiry.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ backgroundColor: '#F8FAFC', padding: '4rem 1rem 6rem 1rem' }}>
      <div className="container" style={{ maxWidth: '1100px' }}>
        {/* Top Banner */}
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <span
            style={{
              fontSize: '12px',
              fontWeight: 700,
              textTransform: 'uppercase',
              color: '#E11D48',
              letterSpacing: '0.1em',
            }}
          >
            B2B Enterprise & Corporate Merchandising
          </span>
          <h1 style={{ fontSize: '2.5rem', color: '#0B132B', margin: '0.5rem 0' }}>
            Request a Bulk Custom Print Quote
          </h1>
          <p style={{ color: '#64748B', fontSize: '1.1rem', maxWidth: '700px', margin: '0 auto' }}>
            Need 50, 100, 500, or 10,000+ units? Get dedicated corporate pricing, free digital proofs, priority press slots, and sample box delivery.
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '2.5rem',
            alignItems: 'start',
          }}
        >
          {/* Left Column: Form */}
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '16px',
              border: '1px solid #E2E8F0',
              padding: '2.5rem',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
            }}
          >
            {successQuote ? (
              <div style={{ textAlign: 'center', padding: '2rem 0' }}>
                <CheckCircle2 size={56} color="#10B981" style={{ margin: '0 auto 1rem auto' }} />
                <h3 style={{ fontSize: '1.5rem', color: '#0B132B', marginBottom: '0.5rem' }}>
                  Quotation Request Received!
                </h3>
                <p style={{ color: '#64748B', marginBottom: '1.5rem' }}>
                  Your inquiry reference ID is <strong>#{successQuote}</strong>. Our enterprise sales manager will contact you with a tiered price proposal within 24 business hours.
                </p>
                <Button variant="primary" onClick={() => setSuccessQuote(null)}>
                  Submit Another Quote
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {errorMsg && (
                  <div
                    style={{
                      padding: '10px 14px',
                      backgroundColor: '#FEF2F2',
                      color: '#B91C1C',
                      borderRadius: '8px',
                      fontSize: '13px',
                    }}
                  >
                    {errorMsg}
                  </div>
                )}

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <label style={{ fontSize: '12px', fontWeight: 700, color: '#0B132B' }}>
                      Contact Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      placeholder="e.g. Vikram Sharma"
                      value={formData.name}
                      onChange={handleChange}
                      style={{ padding: '10px', borderRadius: '8px', border: '1px solid #CBD5E1' }}
                    />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <label style={{ fontSize: '12px', fontWeight: 700, color: '#0B132B' }}>
                      Company Name *
                    </label>
                    <input
                      type="text"
                      name="companyName"
                      required
                      placeholder="e.g. Acme Technologies"
                      value={formData.companyName}
                      onChange={handleChange}
                      style={{ padding: '10px', borderRadius: '8px', border: '1px solid #CBD5E1' }}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <label style={{ fontSize: '12px', fontWeight: 700, color: '#0B132B' }}>
                      Business Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      placeholder="vikram@acme.com"
                      value={formData.email}
                      onChange={handleChange}
                      style={{ padding: '10px', borderRadius: '8px', border: '1px solid #CBD5E1' }}
                    />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <label style={{ fontSize: '12px', fontWeight: 700, color: '#0B132B' }}>
                      Phone / WhatsApp *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      placeholder="+91 98765 43210"
                      value={formData.phone}
                      onChange={handleChange}
                      style={{ padding: '10px', borderRadius: '8px', border: '1px solid #CBD5E1' }}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '1rem' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <label style={{ fontSize: '12px', fontWeight: 700, color: '#0B132B' }}>
                      Product Category *
                    </label>
                    <select
                      name="productCategory"
                      value={formData.productCategory}
                      onChange={handleChange}
                      style={{ padding: '10px', borderRadius: '8px', border: '1px solid #CBD5E1' }}
                    >
                      <option value="Business Printing">Business Printing (Cards, Flyers, Letterheads)</option>
                      <option value="Corporate Gifts">Corporate Gifting (Diaries, Sets, Pens)</option>
                      <option value="Packaging Solutions">Packaging (Boxes, Coffee Cups, Bags)</option>
                      <option value="Promotional Products">Promotional (T-Shirts, Bottles, Mats)</option>
                      <option value="Personalized Products">Personalized Merchandise</option>
                    </select>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <label style={{ fontSize: '12px', fontWeight: 700, color: '#0B132B' }}>
                      Required Quantity *
                    </label>
                    <input
                      type="number"
                      name="quantity"
                      min={10}
                      required
                      value={formData.quantity}
                      onChange={handleChange}
                      style={{ padding: '10px', borderRadius: '8px', border: '1px solid #CBD5E1' }}
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: '#0B132B' }}>
                    Target Delivery Date
                  </label>
                  <input
                    type="date"
                    name="requiredDate"
                    value={formData.requiredDate}
                    onChange={handleChange}
                    style={{ padding: '10px', borderRadius: '8px', border: '1px solid #CBD5E1' }}
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: '#0B132B' }}>
                    Detailed Project Requirements & Specifications *
                  </label>
                  <textarea
                    name="message"
                    rows={4}
                    required
                    placeholder="Mention custom colors, embossing, packaging dimensions, event deadlines, or specific paper stock requirements..."
                    value={formData.message}
                    onChange={handleChange}
                    style={{ padding: '10px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '14px' }}
                  />
                </div>

                <Button variant="accent" size="lg" type="submit" isLoading={loading} rightIcon={<Send size={16} />}>
                  Request a Quote
                </Button>
              </form>
            )}
          </div>

          {/* Right Column: Corporate Benefits & Direct Hotline */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div
              style={{
                backgroundColor: '#0B132B',
                color: '#FFFFFF',
                borderRadius: '16px',
                padding: '2rem',
              }}
            >
              <h3 style={{ fontSize: '1.35rem', color: '#FFFFFF', marginBottom: '1rem' }}>
                Corporate Account Benefits
              </h3>
              <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', fontSize: '14px' }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <CheckCircle2 size={18} color="#E11D48" />
                  <span>Up to 45% discount on volume tiered orders</span>
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <CheckCircle2 size={18} color="#E11D48" />
                  <span>Free pre-production digital vector proofing</span>
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <CheckCircle2 size={18} color="#E11D48" />
                  <span>GST invoice with full input tax credit compliance</span>
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <CheckCircle2 size={18} color="#E11D48" />
                  <span>Pan-India multi-location drop shipping available</span>
                </li>
              </ul>
            </div>

            <div
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '16px',
                border: '1px solid #E2E8F0',
                padding: '1.75rem',
              }}
            >
              <h4 style={{ fontSize: '1.1rem', color: '#0B132B', marginBottom: '0.5rem' }}>
                Direct Corporate Desk
              </h4>
              <p style={{ fontSize: '13px', color: '#64748B', marginBottom: '1rem' }}>
                Need an immediate estimate for an upcoming event or tender?
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#0F172A' }}>
                  <Phone size={16} color="#1E60D5" />
                  <strong>+91 98765 43210</strong>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#0F172A' }}>
                  <Mail size={16} color="#1E60D5" />
                  <span>b2b@printkart24.com</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#64748B', fontSize: '12px' }}>
                  <Clock size={14} />
                  <span>Monday - Saturday, 9:00 AM - 7:00 PM IST</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
