import { Router } from 'express';
import { createOrder, getMyOrders, getOrderByNumber } from '../controllers/orderController.js';
import { optionalAuth, requireAuth } from '../middleware/authMiddleware.js';

const router = Router();

router.post('/', optionalAuth, createOrder);
router.get('/my-orders', requireAuth, getMyOrders);
router.get('/:orderNumber', optionalAuth, getOrderByNumber);

export default router;
