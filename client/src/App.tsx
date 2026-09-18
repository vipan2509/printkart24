import React, { useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import { useCartStore } from './store/cartStore';

// Layouts
import { MainLayout } from './layouts/MainLayout';
import { AdminLayout } from './layouts/AdminLayout';

// Storefront Pages
import { HomePage } from './pages/HomePage';
import { ProductListingPage } from './pages/ProductListingPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { CustomizerPage } from './pages/CustomizerPage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { OrderConfirmationPage } from './pages/OrderConfirmationPage';
import { OrderTrackingPage } from './pages/OrderTrackingPage';
import { BulkOrdersPage } from './pages/BulkOrdersPage';
import { AccountPage } from './pages/AccountPage';
import { LoginPage } from './pages/AuthPages/LoginPage';
import { RegisterPage } from './pages/AuthPages/RegisterPage';

// Admin Pages
import { AdminLoginPage } from './pages/AdminPages/AdminLoginPage';
import { AdminDashboard } from './pages/AdminPages/AdminDashboard';
import { AdminProducts } from './pages/AdminPages/AdminProducts';
import { AdminOrders } from './pages/AdminPages/AdminOrders';
import { AdminQuotes } from './pages/AdminPages/AdminQuotes';
import { AdminCoupons } from './pages/AdminPages/AdminCoupons';
import { AdminCustomers } from './pages/AdminPages/AdminCustomers';

// Route Guards
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuthStore();
  const location = useLocation();

  if (isLoading) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: '#64748B' }}>Loading your account...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

const AdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isAuthenticated, isLoading } = useAuthStore();

  if (isLoading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0F172A' }}>
        <p style={{ color: '#94A3B8' }}>Verifying admin credentials...</p>
      </div>
    );
  }

  if (!isAuthenticated || !['ADMIN', 'SUPER_ADMIN'].includes(user?.role || '')) {
    return <Navigate to="/admin/login" replace />;
  }

  return <>{children}</>;
};

export const App: React.FC = () => {
  const { checkAuth } = useAuthStore();
  const { fetchCart } = useCartStore();

  useEffect(() => {
    checkAuth();
    fetchCart();
  }, []);

  return (
    <Routes>
      {/* Storefront Routes wrapped in MainLayout */}
      <Route path="/" element={<MainLayout />}>
        <Route index element={<HomePage />} />
        <Route path="products" element={<ProductListingPage />} />
        <Route path="category/:categorySlug" element={<ProductListingPage />} />
        <Route path="products/:slug" element={<ProductDetailPage />} />
        <Route path="product/:slug" element={<ProductDetailPage />} />
        <Route path="cart" element={<CartPage />} />
        <Route
          path="checkout"
          element={
            <ProtectedRoute>
              <CheckoutPage />
            </ProtectedRoute>
          }
        />
        <Route path="order-confirmation/:id" element={<OrderConfirmationPage />} />
        <Route path="track-order" element={<OrderTrackingPage />} />
        <Route path="track-order/:orderNumber" element={<OrderTrackingPage />} />
        <Route path="bulk-orders" element={<BulkOrdersPage />} />
        <Route path="corporate-gifting" element={<BulkOrdersPage />} />
        <Route
          path="account"
          element={
            <ProtectedRoute>
              <AccountPage />
            </ProtectedRoute>
          }
        />
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
      </Route>

      {/* 2D Canvas Customizer / Studio Route (Full-Screen Immersive Canvas) */}
      <Route path="customize/:slug" element={<CustomizerPage />} />
      <Route path="customizer/:slug" element={<CustomizerPage />} />

      {/* Admin Portal Authentication */}
      <Route path="admin/login" element={<AdminLoginPage />} />

      {/* Admin Portal Routes wrapped in AdminLayout and protected */}
      <Route
        path="admin"
        element={
          <AdminRoute>
            <AdminLayout />
          </AdminRoute>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="products" element={<AdminProducts />} />
        <Route path="orders" element={<AdminOrders />} />
        <Route path="quotes" element={<AdminQuotes />} />
        <Route path="coupons" element={<AdminCoupons />} />
        <Route path="customers" element={<AdminCustomers />} />
      </Route>

      {/* 404 Fallback */}
      <Route
        path="*"
        element={
          <div style={{ minHeight: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '2rem' }}>
            <h1 style={{ fontSize: '5rem', color: '#1E60D5', margin: 0, fontWeight: 900 }}>404</h1>
            <h2 style={{ fontSize: '1.75rem', color: '#0B132B', marginBottom: '0.75rem' }}>Page Not Found</h2>
            <p style={{ color: '#64748B', maxWidth: '420px', marginBottom: '1.5rem' }}>
              The page or printing catalog you are looking for may have been moved or does not exist.
            </p>
            <a
              href="/"
              style={{
                background: '#1E60D5',
                color: '#FFF',
                padding: '0.75rem 1.75rem',
                borderRadius: '8px',
                fontWeight: 600,
                textDecoration: 'none'
              }}
            >
              Back to Storefront
            </a>
          </div>
        }
      />
    </Routes>
  );
};

export default App;
