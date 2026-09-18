import { Router } from 'express';
import { createReview } from '../controllers/reviewController.js';
import { requireAuth } from '../middleware/authMiddleware.js';

const router = Router();

router.post('/', requireAuth, createReview);

export default router;
