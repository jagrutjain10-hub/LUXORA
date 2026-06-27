import { Request, Response, NextFunction } from 'express';
import { prisma } from '../config/prisma';
import { AppError } from '../utils/AppError';

// ─── VERIFY UPI PAYMENT (Admin) ───────────────────────────────────────────────

export async function verifyUpiPayment(req: Request, res: Response, next: NextFunction) {
  try {
    const { orderId } = req.params;
    const { action } = req.body; // 'VERIFY' | 'REJECT'

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { payment: true },
    });

    if (!order) throw new AppError('Order not found.', 404);

    if (action === 'VERIFY') {
      await prisma.$transaction([
        prisma.payment.update({
          where: { orderId },
          data: { status: 'PAID', paidAt: new Date() },
        }),
        prisma.order.update({
          where: { id: orderId },
          data: { paymentStatus: 'PAID', status: 'CONFIRMED' },
        }),
      ]);
      res.json({ success: true, message: 'Payment verified. Order confirmed.' });
    } else if (action === 'REJECT') {
      await prisma.$transaction([
        prisma.payment.update({
          where: { orderId },
          data: { status: 'FAILED', failureReason: 'Payment rejected by admin' },
        }),
        prisma.order.update({
          where: { id: orderId },
          data: { paymentStatus: 'FAILED', status: 'CANCELLED' },
        }),
      ]);
      res.json({ success: true, message: 'Payment rejected. Order cancelled.' });
    } else {
      throw new AppError('Invalid action. Use VERIFY or REJECT.', 400);
    }
  } catch (err) {
    next(err);
  }
}

// ─── GET PAYMENT SCREENSHOT URL ───────────────────────────────────────────────

export async function getPaymentScreenshot(req: Request, res: Response, next: NextFunction) {
  try {
    const { orderId } = req.params;

    const payment = await prisma.payment.findUnique({
      where: { orderId },
      select: { gatewayPaymentId: true, status: true },
    });

    if (!payment) throw new AppError('Payment not found.', 404);

    res.json({
      success: true,
      data: {
        screenshotUrl: payment.gatewayPaymentId,
        status: payment.status,
      },
    });
  } catch (err) {
    next(err);
  }
}

// Keep these as stubs to avoid breaking imports
export async function createRazorpayOrder(req: Request, res: Response) {
  res.status(410).json({ success: false, message: 'Razorpay removed. Use UPI payment.' });
}
export async function verifyPayment(req: Request, res: Response) {
  res.status(410).json({ success: false, message: 'Razorpay removed. Use UPI payment.' });
}
export async function razorpayWebhook(req: Request, res: Response) {
  res.status(410).json({ success: false, message: 'Razorpay removed.' });
}
