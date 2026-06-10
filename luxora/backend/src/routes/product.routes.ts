import { Router } from 'express';
import * as products from '../controllers/product.controller';
import { authenticate, requireAdmin } from '../middleware/auth.middleware';

const router = Router();

router.get('/', products.listProducts);
router.get('/:slug', products.getProduct);
router.post('/', authenticate, requireAdmin, products.createProduct);
router.put('/:id', authenticate, requireAdmin, products.updateProduct);
router.delete('/:id', authenticate, requireAdmin, products.deleteProduct);
router.post('/bulk', authenticate, requireAdmin, products.bulkCreateProducts);

export default router;