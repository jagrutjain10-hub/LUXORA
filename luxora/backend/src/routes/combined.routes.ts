import { Router } from 'express';
import * as products from '../controllers/product.controller';
import * as orders from '../controllers/order.controller';
import * as admin from '../controllers/admin.controller';
import * as payments from '../controllers/payment.controller';
import { authenticate, requireAdmin } from '../middleware/auth.middleware';

// ─── PRODUCT ROUTES ───────────────────────────────────────────────────────────

export const productRouter = Router();

productRouter.get('/', products.listProducts);
productRouter.get('/:slug', products.getProduct);
productRouter.post('/', authenticate, requireAdmin, products.createProduct);
productRouter.put('/:id', authenticate, requireAdmin, products.updateProduct);
productRouter.delete('/:id', authenticate, requireAdmin, products.deleteProduct);
productRouter.post('/bulk', authenticate, requireAdmin, products.bulkCreateProducts);

// ─── ORDER ROUTES ─────────────────────────────────────────────────────────────

export const orderRouter = Router();

orderRouter.post('/', authenticate, orders.createOrder);
orderRouter.get('/my', authenticate, orders.getUserOrders);
orderRouter.get('/my/:id', authenticate, orders.getOrder);
orderRouter.get('/', authenticate, requireAdmin, orders.adminListOrders);
orderRouter.patch('/:id/status', authenticate, requireAdmin, orders.updateOrderStatus);
orderRouter.get('/export', authenticate, requireAdmin, orders.exportOrders);

// ─── ADMIN ROUTES ─────────────────────────────────────────────────────────────

export const adminRouter = Router();

adminRouter.use(authenticate, requireAdmin);
adminRouter.get('/dashboard', admin.getDashboardStats);
adminRouter.get('/inventory-alerts', admin.getInventoryAlerts);

// ─── PAYMENT ROUTES ───────────────────────────────────────────────────────────

export const paymentRouter = Router();

paymentRouter.post('/razorpay/create', authenticate, payments.createRazorpayOrder);
paymentRouter.post('/razorpay/verify', authenticate, payments.verifyPayment);
paymentRouter.post('/razorpay/webhook', payments.razorpayWebhook);
