import React from 'react';
import { Outlet, NavLink, Link, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  MessageSquareQuote,
  Ticket,
  Users,
  LogOut,
  ExternalLink,
  Printer,
  Boxes,
} from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import './AdminLayout.scss';

export const AdminLayout: React.FC = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  const navLinks = [
    { to: '/admin', label: 'Dashboard', icon: <LayoutDashboard size={18} />, end: true },
    { to: '/admin/products', label: 'Products', icon: <Package size={18} /> },
    { to: '/admin/orders', label: 'Orders & Printing', icon: <ShoppingCart size={18} /> },
    { to: '/admin/quotes', label: 'Bulk B2B Quotes', icon: <MessageSquareQuote size={18} /> },
    { to: '/admin/coupons', label: 'Coupons & Deals', icon: <Ticket size={18} /> },
    { to: '/admin/customers', label: 'Customers', icon: <Users size={18} /> },
  ];

  return (
    <div className="pk-admin-layout">
      {/* Sidebar */}
      <aside className="pk-admin-layout__sidebar">
        <div className="sidebar-header">
          <Printer size={22} color="#E11D48" />
          <span className="brand-title">
            PRINTKART<span className="highlight">24</span>
          </span>
          <span className="admin-tag">ADMIN</span>
        </div>

        <nav className="sidebar-nav">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            >
              {link.icon}
              <span>{link.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="user-info">
            <div className="name">{user?.firstName} {user?.lastName}</div>
            <div className="role">{user?.role}</div>
          </div>
          <button onClick={handleLogout} title="Sign Out">
            <LogOut size={18} />
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="pk-admin-layout__main">
        <header className="admin-header">
          <h2>PRINTKART24 Operations Portal</h2>
          <div className="header-actions">
            <Link to="/" target="_blank" className="store-link">
              <span>View Storefront</span>
              <ExternalLink size={15} />
            </Link>
          </div>
        </header>

        <main className="admin-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
