import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import { prisma } from '../config/prisma';
import { AppError } from '../utils/AppError';

const router = Router();

router.get('/', authenticate, async (req, res, next) => {
  try {
    const items = await prisma.cartItem.findMany({
      where: { userId: req.user!.id },
      include: {
        product: {
          include: { images: { where: { isPrimary: true }, take: 1 } },
        },
      },
      orderBy: { createdAt: 'asc' },
    });
    res.json({ success: true, data: items });
  } catch (err) { next(err); }
});

router.post('/sync', authenticate, async (req, res, next) => {
  try {
    const userId = req.user!.id;
    const { items } = req.body;
    if (!Array.isArray(items)) throw new AppError('Items must be an array.', 400);
    await Promise.all(
      items.map((item: { productId: string; quantity: number }) =>
        prisma.cartItem.upsert({
          where: { userId_productId: { userId, productId: item.productId } } as any,
          create: { userId, productId: item.productId, quantity: item.quantity },
          update: { quantity: item.quantity },
        }).catch(() => null)
      )
    );
    const updated = await prisma.cartItem.findMany({
      where: { userId },
      include: { product: { include: { images: { where: { isPrimary: true }, take: 1 } } } },
    });
    res.json({ success: true, data: updated });
  } catch (err) { next(err); }
});

router.post('/add', authenticate, async (req, res, next) => {
  try {
    const userId = req.user!.id;
    const { productId, quantity = 1 } = req.body;
    const product = await prisma.product.findUnique({ where: { id: productId, isActive: true } });
    if (!product) throw new AppError('Product not found.', 404);
    const existing = await prisma.cartItem.findFirst({ where: { userId, productId } });
    if (existing) {
      await prisma.cartItem.update({
        where: { id: existing.id },
        data: { quantity: existing.quantity + quantity },
      });
    } else {
      await prisma.cartItem.create({ data: { userId, productId, quantity } });
    }
    res.json({ success: true, message: 'Item added to cart.' });
  } catch (err) { next(err); }
});

router.delete('/', authenticate, async (req, res, next) => {
  try {
    await prisma.cartItem.deleteMany({ where: { userId: req.user!.id } });
    res.json({ success: true, message: 'Cart cleared.' });
  } catch (err) { next(err); }
});

router.delete('/:productId', authenticate, async (req, res, next) => {
  try {
    await prisma.cartItem.deleteMany({
      where: { userId: req.user!.id, productId: req.params.productId },
    });
    res.json({ success: true, message: 'Item removed.' });
  } catch (err) { next(err); }
});

export default router;