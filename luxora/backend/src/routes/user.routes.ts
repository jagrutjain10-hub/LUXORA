import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import { prisma } from '../config/prisma';
import { AppError } from '../utils/AppError';
import bcrypt from 'bcryptjs';

const router = Router();

router.get('/me', authenticate, async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.id },
      select: {
        id: true, email: true, firstName: true, lastName: true,
        phone: true, role: true, avatarUrl: true, isEmailVerified: true,
        createdAt: true, lastLoginAt: true,
        _count: { select: { orders: true, wishlist: true } },
      },
    });
    if (!user) throw new AppError('User not found.', 404);
    res.json({ success: true, data: user });
  } catch (err) { next(err); }
});

router.patch('/me', authenticate, async (req, res, next) => {
  try {
    const { firstName, lastName, phone, avatarUrl } = req.body;
    const user = await prisma.user.update({
      where: { id: req.user!.id },
      data: { firstName, lastName, phone, avatarUrl },
      select: { id: true, email: true, firstName: true, lastName: true, phone: true, avatarUrl: true },
    });
    res.json({ success: true, data: user });
  } catch (err) { next(err); }
});

router.patch('/me/password', authenticate, async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) throw new AppError('Both passwords are required.', 400);
    if (newPassword.length < 8) throw new AppError('New password must be at least 8 characters.', 400);
    const user = await prisma.user.findUnique({ where: { id: req.user!.id } });
    if (!user) throw new AppError('User not found.', 404);
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) throw new AppError('Current password is incorrect.', 400);
    const hashed = await bcrypt.hash(newPassword, 12);
    await prisma.user.update({ where: { id: req.user!.id }, data: { password: hashed } });
    res.json({ success: true, message: 'Password updated successfully.' });
  } catch (err) { next(err); }
});

router.get('/me/addresses', authenticate, async (req, res, next) => {
  try {
    const addresses = await prisma.address.findMany({
      where: { userId: req.user!.id },
      orderBy: { isDefault: 'desc' },
    });
    res.json({ success: true, data: addresses });
  } catch (err) { next(err); }
});

router.post('/me/addresses', authenticate, async (req, res, next) => {
  try {
    const { label, fullName, phone, line1, line2, city, state, pincode, isDefault } = req.body;
    const userId = req.user!.id;
    if (isDefault) {
      await prisma.address.updateMany({ where: { userId }, data: { isDefault: false } });
    }
    const address = await prisma.address.create({
      data: { userId, label, fullName, phone, line1, line2, city, state, pincode, isDefault: isDefault ?? false },
    });
    res.status(201).json({ success: true, data: address });
  } catch (err) { next(err); }
});

router.put('/me/addresses/:id', authenticate, async (req, res, next) => {
  try {
    const { label, fullName, phone, line1, line2, city, state, pincode, isDefault } = req.body;
    const userId = req.user!.id;
    const existing = await prisma.address.findFirst({ where: { id: req.params.id, userId } });
    if (!existing) throw new AppError('Address not found.', 404);
    if (isDefault) {
      await prisma.address.updateMany({ where: { userId }, data: { isDefault: false } });
    }
    const address = await prisma.address.update({
      where: { id: req.params.id },
      data: { label, fullName, phone, line1, line2, city, state, pincode, isDefault: isDefault ?? false },
    });
    res.json({ success: true, data: address });
  } catch (err) { next(err); }
});

router.delete('/me/addresses/:id', authenticate, async (req, res, next) => {
  try {
    const existing = await prisma.address.findFirst({
      where: { id: req.params.id, userId: req.user!.id },
    });
    if (!existing) throw new AppError('Address not found.', 404);
    await prisma.address.delete({ where: { id: req.params.id } });
    res.json({ success: true, message: 'Address deleted.' });
  } catch (err) { next(err); }
});

export default router;