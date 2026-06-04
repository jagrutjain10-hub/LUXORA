import { Request, Response, NextFunction } from 'express';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import { prisma } from '../config/prisma';
import { AppError } from '../utils/AppError';
import { env } from '../config/env';

const razorpay = new Razorpay({
  key_id: env.RAZORPAY_KEY_ID!,
  key_secret: env.RAZORPAY_KEY_SECRET!,
});

// ─── CREATE RAZORPAY ORDER ────────────────────────────────────────────────────

export async function createRazorpayOrder(req: Request, res: Response, next: NextFunction) {
  try {
    const { orderId } = req.body;

    const order = await prisma.order.findUnique({ where: { id: orderId } });
    if (!order) throw new AppError('Order not found.', 404);
    if (order.paymentStatus === 'PAID') throw new AppError('Order already paid.', 400);

    const rzpOrder = await razorpay.orders.create({
      amount: Math.round(Number(order.totalAmount) * 100), // paise
      currency: 'INR',
      receipt: order.orderNumber,
    });

    await prisma.payment.upsert({
      where: { orderId },
      create: {
        orderId,
        amount: order.totalAmount,
        method: order.paymentMethod ?? 'RAZORPAY',
        gatewayOrderId: rzpOrder.id,
      },
      update: { gatewayOrderId: rzpOrder.id },
    });

    res.json({
      success: true,
      data: {
        razorpayOrderId: rzpOrder.id,
        amount: rzpOrder.amount,
        currency: rzpOrder.currency,
        keyId: env.RAZORPAY_KEY_ID,
      },
    });
  } catch (err) {
    next(err);
  }
}

// ─── VERIFY PAYMENT ───────────────────────────────────────────────────────────

export async function verifyPayment(req: Request, res: Response, next: NextFunction) {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } = req.body;

    const expectedSignature = crypto
      .createHmac('sha256', env.RAZORPAY_KEY_SECRET!)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      throw new AppError('Payment verification failed. Invalid signature.', 400);
    }

    await prisma.$transaction([
      prisma.payment.update({
        where: { orderId },
        data: {
          gatewayPaymentId: razorpay_payment_id,
          gatewaySignature: razorpay_signature,
          status: 'PAID',
          paidAt: new Date(),
        },
      }),
      prisma.order.update({
        where: { id: orderId },
        data: { paymentStatus: 'PAID', status: 'CONFIRMED' },
      }),
    ]);

    res.json({ success: true, message: 'Payment verified successfully.' });
  } catch (err) {
    next(err);
  }
}

// ─── RAZORPAY WEBHOOK ─────────────────────────────────────────────────────────

export async function razorpayWebhook(req: Request, res: Response, next: NextFunction) {
  try {
    const signature = req.headers['x-razorpay-signature'] as string;
    const body = JSON.stringify(req.body);

    const expectedSignature = crypto
      .createHmac('sha256', env.RAZORPAY_WEBHOOK_SECRET!)
      .update(body)
      .digest('hex');

    if (signature !== expectedSignature) {
      return res.status(400).json({ success: false, message: 'Invalid webhook signature.' });
    }

    const { event, payload } = req.body;

    if (event === 'payment.failed') {
      const { order_id, id: payment_id, error_description } = payload.payment.entity;
      await prisma.payment.updateMany({
        where: { gatewayOrderId: order_id },
        data: { status: 'FAILED', failureReason: error_description, gatewayPaymentId: payment_id },
      });
    }

    res.json({ success: true });
  } catch (err) {
    next(err);
  }
}
