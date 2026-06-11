import { Router } from 'express';
import * as admin from '../controllers/admin.controller';
import { authenticate, requireAdmin } from '../middleware/auth.middleware';
import { prisma } from '../config/prisma';

const router = Router();

router.use(authenticate, requireAdmin);

router.get('/dashboard', admin.getDashboardStats);
router.get('/inventory-alerts', admin.getInventoryAlerts);

router.get('/customers', async (req, res, next) => {
  try {
    const { page = 1, limit = 20, search } = req.query;
    const skip = (Number(page) - 1) * Number(limit);
    const where: any = {
      role: 'CUSTOMER',
      ...(search && {
        OR: [
          { email: { contains: String(search), mode: 'insensitive' } },
          { firstName: { contains: String(search), mode: 'insensitive' } },
          { lastName: { contains: String(search), mode: 'insensitive' } },
        ],
      }),
    };
    const [customers, total] = await Promise.all([
      prisma.user.findMany({
        where, skip, take: Number(limit),
        orderBy: { createdAt: 'desc' },
        select: {
          id: true, email: true, firstName: true, lastName: true,
          phone: true, isEmailVerified: true, isActive: true,
          createdAt: true, lastLoginAt: true,
          _count: { select: { orders: true } },
        },
      }),
      prisma.user.count({ where }),
    ]);
    res.json({ success: true, data: { customers, pagination: { page: Number(page), limit: Number(limit), total, totalPages: Math.ceil(total / Number(limit)) } } });
  } catch (err) { next(err); }
});

router.get('/categories', async (req, res, next) => {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { sortOrder: 'asc' },
      include: { _count: { select: { products: true } } },
    });
    res.json({ success: true, data: categories });
  } catch (err) { next(err); }
});

router.post('/categories', async (req, res, next) => {
  try {
    const { name, description, imageUrl, sortOrder } = req.body;
    const slug = name.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').trim();
    const category = await prisma.category.create({
      data: { name, slug, description, imageUrl, sortOrder: sortOrder ?? 0 },
    });
    res.status(201).json({ success: true, data: category });
  } catch (err) { next(err); }
});

router.put('/categories/:id', async (req, res, next) => {
  try {
    const { name, description, imageUrl, sortOrder, isActive } = req.body;
    const category = await prisma.category.update({
      where: { id: req.params.id },
      data: { name, description, imageUrl, sortOrder, isActive },
    });
    res.json({ success: true, data: category });
  } catch (err) { next(err); }
});

router.delete('/categories/:id', async (req, res, next) => {
  try {
    await prisma.category.update({ where: { id: req.params.id }, data: { isActive: false } });
    res.json({ success: true, message: 'Category deactivated.' });
  } catch (err) { next(err); }
});

router.patch('/customers/:id/toggle', async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.params.id } });
    if (!user) return res.status(404).json({ success: false, message: 'User not found.' });
    const updated = await prisma.user.update({
      where: { id: req.params.id },
      data: { isActive: !user.isActive },
      select: { id: true, isActive: true },
    });
    res.json({ success: true, data: updated });
  } catch (err) { next(err); }
});

export default router;