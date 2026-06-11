import { Router } from 'express';
import { authenticate, requireAdmin } from '../middleware/auth.middleware';
import { prisma } from '../config/prisma';
import { AppError } from '../utils/AppError';

const router = Router();

router.post('/:productId', authenticate, async (req, res, next) => {
  try {
    const { productId } = req.params;
    const userId = req.user!.id;
    const { rating, title, body } = req.body;
    if (!rating || rating < 1 || rating > 5) throw new AppError('Rating must be between 1 and 5.', 400);
    if (!body?.trim()) throw new AppError('Review body is required.', 400);
    const product = await prisma.product.findUnique({ where: { id: productId, isActive: true } });
    if (!product) throw new AppError('Product not found.', 404);
    const hasPurchased = await prisma.orderItem.findFirst({
      where: { productId, order: { userId, paymentStatus: 'PAID' } },
    });
    const review = await prisma.review.upsert({
      where: { productId_userId: { productId, userId } },
      create: { productId, userId, rating, title, body, isVerified: !!hasPurchased, isApproved: false },
      update: { rating, title, body, isVerified: !!hasPurchased },
    });
    res.status(201).json({ success: true, data: review });
  } catch (err) { next(err); }
});

router.get('/:productId', async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const reviews = await prisma.review.findMany({
      where: { productId: req.params.productId, isApproved: true },
      include: { user: { select: { firstName: true, lastName: true, avatarUrl: true } } },
      orderBy: { createdAt: 'desc' },
      skip: (Number(page) - 1) * Number(limit),
      take: Number(limit),
    });
    res.json({ success: true, data: reviews });
  } catch (err) { next(err); }
});

router.patch('/:id/approve', authenticate, requireAdmin, async (req, res, next) => {
  try {
    const review = await prisma.review.update({
      where: { id: req.params.id },
      data: { isApproved: true },
    });
    res.json({ success: true, data: review });
  } catch (err) { next(err); }
});

router.delete('/:id', authenticate, requireAdmin, async (req, res, next) => {
  try {
    await prisma.review.delete({ where: { id: req.params.id } });
    res.json({ success: true, message: 'Review deleted.' });
  } catch (err) { next(err); }
});

export default router;
