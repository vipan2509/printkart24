import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.scss';

export const Footer: React.FC = () => {
  return (
    <footer className="zazzle-footer">
      <div className="container">
        {/* Centered Brand Script Logo */}
        <div className="zazzle-footer__top">
          <div className="footer-line" />
          <Link to="/" className="footer-logo">
            <span className="brand-script">Printkart<span className="brand-suffix">24</span></span>
          </Link>
          <div className="footer-line" />
        </div>

        {/* 4 Clean Columns of Links */}
        <div className="zazzle-footer__links">
          <div className="links-col">
            <h4>About</h4>
            <ul>
              <li><Link to="/products">About PRINTKART24</Link></li>
              <li><Link to="/products">Press &amp; Media</Link></li>
              <li><Link to="/products">Careers</Link></li>
              <li><Link to="/products">Sustainability</Link></li>
            </ul>
          </div>

          <div className="links-col">
            <h4>Account</h4>
            <ul>
              <li><Link to="/login">Sign In / Register</Link></li>
              <li><Link to="/account">My Account</Link></li>
              <li><Link to="/track-order">Track My Order</Link></li>
              <li><Link to="/products">Return &amp; Reprint Policy</Link></li>
            </ul>
          </div>

          <div className="links-col">
            <h4>Business &amp; Bulk</h4>
            <ul>
              <li><Link to="/bulk-orders">Corporate Bulk Printing</Link></li>
              <li><Link to="/corporate-gifting">Corporate Gift Kits</Link></li>
              <li><Link to="/products?isCustomizable=true">2D Design Studio</Link></li>
              <li><Link to="/bulk-orders">Volume Price Matrix</Link></li>
            </ul>
          </div>

          <div className="links-col">
            <h4>Support &amp; Legal</h4>
            <ul>
              <li><Link to="/products">Sitemap</Link></li>
              <li><a href="mailto:support@printkart24.com">Help &amp; Support</a></li>
              <li><Link to="/products">Privacy Policy</Link></li>
              <li><Link to="/products">Terms of Service</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Disclaimer & Copyright */}
        <div className="zazzle-footer__bottom">
          <div className="copyright">
            © {new Date().getFullYear()} PRINTKART24 Technologies Pvt. Ltd. All rights reserved.
          </div>
          <div className="payments">
            <span>Accepted Payments: UPI • Razorpay • Visa • Mastercard • RuPay • NetBanking</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
