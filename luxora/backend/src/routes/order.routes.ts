import { Router } from 'express';
import * as orders from '../controllers/order.controller';
import { authenticate, requireAdmin } from '../middleware/auth.middleware';

const router = Router();

router.post('/', authenticate, orders.createOrder);
router.get('/my', authenticate, orders.getUserOrders);
router.get('/my/:id', authenticate, orders.getOrder);

router.get('/export', authenticate, requireAdmin, orders.exportOrders);
router.get('/', authenticate, requireAdmin, orders.adminListOrders);
router.patch('/:id/status', authenticate, requireAdmin, orders.updateOrderStatus);

export default router;