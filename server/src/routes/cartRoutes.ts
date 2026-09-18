import { Router } from 'express';
import { getCart, addToCart, updateCartItem, removeCartItem, clearCart } from '../controllers/cartController.js';
import { optionalAuth } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/', optionalAuth, getCart);
router.post('/', optionalAuth, addToCart);
router.put('/:id', optionalAuth, updateCartItem);
router.delete('/:id', optionalAuth, removeCartItem);
router.delete('/', optionalAuth, clearCart);

export default router;
