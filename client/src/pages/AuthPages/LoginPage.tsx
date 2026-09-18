import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Printer, Lock, Mail, ArrowRight } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { Button } from '../../components/Button/Button';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login, isLoading, error } = useAuthStore();

  const [email, setEmail] = useState('customer@printkart24.com');
  const [password, setPassword] = useState('Customer@123456');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const ok = await login({ email, password });
    if (ok) {
      navigate('/account');
    }
  };

  return (
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '3rem 1rem' }}>
      <div
        style={{
          width: '100%',
          maxWidth: '440px',
          backgroundColor: '#FFFFFF',
          borderRadius: '16px',
          border: '1px solid #E2E8F0',
          boxShadow: '0 10px 25px -5px rgba(0,0,0,0.05)',
          padding: '2.5rem',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #1E60D5 0%, #E11D48 100%)',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1rem auto',
            }}
          >
            <Printer size={26} />
          </div>
          <h2 style={{ fontSize: '1.75rem', color: '#0B132B' }}>Sign In to PRINTKART24</h2>
          <p style={{ color: '#64748B', fontSize: '14px', marginTop: '4px' }}>
            Access saved designs, track printing jobs, and reorder custom prints.
          </p>
        </div>

        {error && (
          <div
            style={{
              padding: '10px 14px',
              backgroundColor: '#FEF2F2',
              color: '#B91C1C',
              borderRadius: '8px',
              fontSize: '13px',
              marginBottom: '1.5rem',
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <label style={{ fontSize: '12px', fontWeight: 700, color: '#0B132B' }}>Email Address</label>
            <div style={{ position: 'relative' }}>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px 10px 38px',
                  borderRadius: '8px',
                  border: '1px solid #CBD5E1',
                  fontSize: '14px',
                  boxSizing: 'border-box',
                }}
              />
              <Mail size={16} color="#94A3B8" style={{ position: 'absolute', left: 12, top: 12 }} />
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label style={{ fontSize: '12px', fontWeight: 700, color: '#0B132B' }}>Password</label>
              <span style={{ fontSize: '12px', color: '#1E60D5', cursor: 'pointer' }}>Forgot Password?</span>
            </div>
            <div style={{ position: 'relative' }}>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px 10px 38px',
                  borderRadius: '8px',
                  border: '1px solid #CBD5E1',
                  fontSize: '14px',
                  boxSizing: 'border-box',
                }}
              />
              <Lock size={16} color="#94A3B8" style={{ position: 'absolute', left: 12, top: 12 }} />
            </div>
          </div>

          <Button type="submit" variant="primary" size="lg" fullWidth isLoading={isLoading} rightIcon={<ArrowRight size={16} />}>
            Sign In
          </Button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.75rem', fontSize: '14px', color: '#64748B' }}>
          Don't have an account?{' '}
          <Link to="/register" style={{ color: '#E11D48', fontWeight: 700 }}>
            Create Account
          </Link>
        </div>

        <div
          style={{
            marginTop: '1.5rem',
            padding: '12px',
            background: '#F8FAFC',
            borderRadius: '8px',
            fontSize: '12px',
            color: '#64748B',
            textAlign: 'center',
          }}
        >
          <strong>Demo Customer:</strong> customer@printkart24.com / Customer@123456
        </div>
      </div>
    </div>
  );
};
