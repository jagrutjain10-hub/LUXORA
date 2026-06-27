import { Router } from 'express';
import * as payments from '../controllers/payment.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.post('/razorpay/create', authenticate, payments.createRazorpayOrder);
router.post('/razorpay/verify', authenticate, payments.verifyPayment);
router.post('/razorpay/webhook', payments.razorpayWebhook);

export default router;
