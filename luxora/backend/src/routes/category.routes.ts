import { Router } from 'express';
import { prisma } from '../config/prisma';

const router = Router();

router.get('/', async (req, res, next) => {
  try {
    const categories = await prisma.category.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' },
      select: {
        id: true, name: true, slug: true, description: true,
        imageUrl: true, sortOrder: true,
        _count: { select: { products: { where: { isActive: true } } } },
      },
    });
    res.json({ success: true, data: categories });
  } catch (err) { next(err); }
});

router.get('/:slug', async (req, res, next) => {
  try {
    const category = await prisma.category.findUnique({
      where: { slug: req.params.slug, isActive: true },
    });
    if (!category) return res.status(404).json({ success: false, message: 'Category not found.' });
    res.json({ success: true, data: category });
  } catch (err) { next(err); }
});

export default router;