import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Lock, Mail, ArrowRight } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { Button } from '../../components/Button/Button';

export const AdminLoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login, isLoading, error } = useAuthStore();

  const [email, setEmail] = useState('admin@printkart24.com');
  const [password, setPassword] = useState('Admin@123456');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const ok = await login({ email, password });
    if (ok) {
      navigate('/admin');
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#0B132B',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem 1rem',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '420px',
          backgroundColor: '#FFFFFF',
          borderRadius: '16px',
          boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)',
          padding: '2.5rem',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div
            style={{
              width: '52px',
              height: '52px',
              borderRadius: '12px',
              background: '#0B132B',
              color: '#E11D48',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1rem auto',
            }}
          >
            <ShieldCheck size={28} />
          </div>
          <h2 style={{ fontSize: '1.6rem', color: '#0B132B', margin: 0 }}>
            PRINTKART24 Admin
          </h2>
          <p style={{ color: '#64748B', fontSize: '13px', marginTop: '4px' }}>
            Authorized Personnel & Press Operators Only
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
            <label style={{ fontSize: '12px', fontWeight: 700, color: '#0B132B' }}>Admin Email</label>
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
            <label style={{ fontSize: '12px', fontWeight: 700, color: '#0B132B' }}>Password</label>
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

          <Button type="submit" variant="secondary" size="lg" fullWidth isLoading={isLoading} rightIcon={<ArrowRight size={16} />}>
            Sign In to Console
          </Button>
        </form>

        <div
          style={{
            marginTop: '2rem',
            padding: '12px',
            background: '#F8FAFC',
            borderRadius: '8px',
            fontSize: '12px',
            color: '#64748B',
            textAlign: 'center',
          }}
        >
          <strong>Default Super Admin:</strong> admin@printkart24.com / Admin@123456
        </div>
      </div>
    </div>
  );
};
