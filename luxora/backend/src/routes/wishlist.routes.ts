import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import { prisma } from '../config/prisma';
import { AppError } from '../utils/AppError';

const router = Router();

router.get('/', authenticate, async (req, res, next) => {
  try {
    const items = await prisma.wishlistItem.findMany({
      where: { userId: req.user!.id },
      include: {
        product: {
          include: { images: { where: { isPrimary: true }, take: 1 } },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
    res.json({ success: true, data: items });
  } catch (err) { next(err); }
});

router.post('/:productId', authenticate, async (req, res, next) => {
  try {
    const { productId } = req.params;
    const userId = req.user!.id;
    const existing = await prisma.wishlistItem.findUnique({
      where: { userId_productId: { userId, productId } },
    });
    if (existing) {
      await prisma.wishlistItem.delete({ where: { id: existing.id } });
      res.json({ success: true, data: { wishlisted: false } });
    } else {
      const product = await prisma.product.findUnique({ where: { id: productId, isActive: true } });
      if (!product) throw new AppError('Product not found.', 404);
      await prisma.wishlistItem.create({ data: { userId, productId } });
      res.json({ success: true, data: { wishlisted: true } });
    }
  } catch (err) { next(err); }
});

router.delete('/', authenticate, async (req, res, next) => {
  try {
    await prisma.wishlistItem.deleteMany({ where: { userId: req.user!.id } });
    res.json({ success: true, message: 'Wishlist cleared.' });
  } catch (err) { next(err); }
});

export default router;