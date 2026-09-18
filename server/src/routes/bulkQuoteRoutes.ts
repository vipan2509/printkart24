import { Router } from 'express';
import { submitBulkQuote } from '../controllers/bulkQuoteController.js';

const router = Router();

router.post('/', submitBulkQuote);

export default router;
