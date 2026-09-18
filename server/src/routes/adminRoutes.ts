import { Router } from 'express';
import {
  getDashboardStats,
  getAdminProducts,
  createAdminProduct,
  updateAdminProduct,
  deleteAdminProduct,
  getAdminOrders,
  updateOrderStatus,
  getAdminQuotes,
  updateQuoteStatus,
  getAdminCoupons,
  createAdminCoupon,
  getAdminCustomers,
} from '../controllers/adminController.js';
import { requireAuth, requireRole } from '../middleware/authMiddleware.js';

const router = Router();

// Protect all admin routes
router.use(requireAuth);
router.use(requireRole('ADMIN', 'SUPER_ADMIN'));

router.get('/stats', getDashboardStats);

// Products
router.get('/products', getAdminProducts);
router.post('/products', createAdminProduct);
router.put('/products/:id', updateAdminProduct);
router.delete('/products/:id', deleteAdminProduct);

// Orders
router.get('/orders', getAdminOrders);
router.put('/orders/:id/status', updateOrderStatus);

// Quotes
router.get('/quotes', getAdminQuotes);
router.put('/quotes/:id', updateQuoteStatus);

// Coupons
router.get('/coupons', getAdminCoupons);
router.post('/coupons', createAdminCoupon);

// Customers
router.get('/customers', getAdminCustomers);

export default router;
