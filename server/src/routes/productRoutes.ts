import { Router } from 'express';
import { getProducts, getProductBySlug, getSearchSuggestions } from '../controllers/productController.js';

const router = Router();

router.get('/', getProducts);
router.get('/search/suggestions', getSearchSuggestions);
router.get('/:slug', getProductBySlug);

export default router;
