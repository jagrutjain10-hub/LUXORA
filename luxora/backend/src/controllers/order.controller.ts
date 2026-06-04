import { Request, Response, NextFunction } from 'express';
import { prisma } from '../config/prisma';
import { AppError } from '../utils/AppError';
import { generateOrderNumber } from '../utils/helpers';
import { sendOrderConfirmationEmail } from '../services/email.service';
import * as XLSX from 'xlsx';

// ─── CREATE ORDER ─────────────────────────────────────────────────────────────

export async function createOrder(req: Request, res: Response, next: NextFunction) {
  try {
    const { addressId, items, paymentMethod, couponCode, notes } = req.body;
    const userId = req.user!.id;

    if (!items?.length) throw new AppError('Order must contain at least one item.', 400);

    // Validate stock and get product data
    const productIds = items.map((i: { productId: string }) => i.productId);
    const products = await prisma.product.findMany({
      where: { id: { in: productIds }, isActive: true },
      include: { images: { where: { isPrimary: true }, take: 1 } },
    });

    if (products.length !== productIds.length) {
      throw new AppError('One or more products are unavailable.', 400);
    }

    let subtotal = 0;
    const orderItems = items.map((item: { productId: string; quantity: number }) => {
      const product = products.find(p => p.id === item.productId)!;
      if (product.stockQty < item.quantity) {
        throw new AppError(`Insufficient stock for "${product.name}".`, 400);
      }
      const unitPrice = Number(product.discountPrice ?? product.price);
      const totalPrice = unitPrice * item.quantity;
      subtotal += totalPrice;
      return {
        productId: product.id,
        productName: product.name,
        productSku: product.sku,
        imageUrl: product.images[0]?.url,
        quantity: item.quantity,
        unitPrice,
        totalPrice,
      };
    });

    const shippingCost = subtotal >= 2999 ? 0 : 199;
    const totalAmount = subtotal + shippingCost;
    const orderNumber = generateOrderNumber();

    const order = await prisma.$transaction(async (tx) => {
      // Decrement stock
      await Promise.all(
        items.map((item: { productId: string; quantity: number }) =>
          tx.product.update({
            where: { id: item.productId },
            data: { stockQty: { decrement: item.quantity } },
          })
        )
      );

      const created = await tx.order.create({
        data: {
          orderNumber,
          userId,
          addressId,
          subtotal,
          shippingCost,
          totalAmount,
          paymentMethod,
          couponCode,
          notes,
          items: { create: orderItems },
        },
        include: {
          items: true,
          address: true,
          user: { select: { email: true, firstName: true } },
        },
      });

      // Clear cart
      await tx.cartItem.deleteMany({ where: { userId } });

      return created;
    });

    // Send confirmation email (non-blocking)
    sendOrderConfirmationEmail(order.user!.email, order.user!.firstName, order).catch(console.error);

    res.status(201).json({ success: true, data: order });
  } catch (err) {
    next(err);
  }
}

// ─── GET USER ORDERS ──────────────────────────────────────────────────────────

export async function getUserOrders(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user!.id;
    const { page = 1, limit = 10, status } = req.query;

    const where = {
      userId,
      ...(status && { status: String(status) as any }),
    };

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        skip: (Number(page) - 1) * Number(limit),
        take: Number(limit),
        orderBy: { createdAt: 'desc' },
        include: {
          items: { take: 3 },
          address: { select: { city: true, state: true } },
        },
      }),
      prisma.order.count({ where }),
    ]);

    res.json({
      success: true,
      data: {
        orders,
        pagination: { page: Number(page), limit: Number(limit), total, totalPages: Math.ceil(total / Number(limit)) },
      },
    });
  } catch (err) {
    next(err);
  }
}

// ─── GET SINGLE ORDER ─────────────────────────────────────────────────────────

export async function getOrder(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const userId = req.user!.id;

    const order = await prisma.order.findFirst({
      where: { id, userId },
      include: {
        items: true,
        address: true,
        payment: true,
      },
    });

    if (!order) throw new AppError('Order not found.', 404);

    res.json({ success: true, data: order });
  } catch (err) {
    next(err);
  }
}

// ─── ADMIN: LIST ALL ORDERS ───────────────────────────────────────────────────

export async function adminListOrders(req: Request, res: Response, next: NextFunction) {
  try {
    const { page = 1, limit = 20, status, paymentStatus, search, startDate, endDate } = req.query;

    const where: any = {
      ...(status && { status }),
      ...(paymentStatus && { paymentStatus }),
      ...(search && {
        OR: [
          { orderNumber: { contains: String(search), mode: 'insensitive' } },
          { user: { email: { contains: String(search), mode: 'insensitive' } } },
        ],
      }),
      ...(startDate && endDate && {
        createdAt: { gte: new Date(String(startDate)), lte: new Date(String(endDate)) },
      }),
    };

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        skip: (Number(page) - 1) * Number(limit),
        take: Number(limit),
        orderBy: { createdAt: 'desc' },
        include: {
          user: { select: { firstName: true, lastName: true, email: true, phone: true } },
          address: true,
          items: true,
          payment: { select: { status: true, method: true, paidAt: true } },
        },
      }),
      prisma.order.count({ where }),
    ]);

    res.json({
      success: true,
      data: {
        orders,
        pagination: { page: Number(page), limit: Number(limit), total, totalPages: Math.ceil(total / Number(limit)) },
      },
    });
  } catch (err) {
    next(err);
  }
}

// ─── ADMIN: UPDATE ORDER STATUS ───────────────────────────────────────────────

export async function updateOrderStatus(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const { status, trackingNumber } = req.body;

    const order = await prisma.order.findUnique({ where: { id } });
    if (!order) throw new AppError('Order not found.', 404);

    const updates: any = { status };
    if (status === 'SHIPPED') { updates.shippedAt = new Date(); updates.trackingNumber = trackingNumber; }
    if (status === 'DELIVERED') updates.deliveredAt = new Date();
    if (status === 'CANCELLED') updates.cancelledAt = new Date();

    const updated = await prisma.order.update({ where: { id }, data: updates });

    res.json({ success: true, data: updated });
  } catch (err) {
    next(err);
  }
}

// ─── ADMIN: EXPORT ORDERS TO EXCEL ───────────────────────────────────────────

export async function exportOrders(req: Request, res: Response, next: NextFunction) {
  try {
    const orders = await prisma.order.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { firstName: true, lastName: true, email: true, phone: true } },
        address: true,
        items: true,
      },
    });

    const rows = orders.map(o => ({
      'Order Number': o.orderNumber,
      'Customer Name': `${o.user?.firstName} ${o.user?.lastName}`,
      'Email': o.user?.email,
      'Phone': o.user?.phone ?? o.guestPhone,
      'Address': o.address ? `${o.address.line1}, ${o.address.city}, ${o.address.state} - ${o.address.pincode}` : '',
      'Items': o.items.map(i => `${i.productName} x${i.quantity}`).join('; '),
      'Subtotal': Number(o.subtotal),
      'Shipping': Number(o.shippingCost),
      'Total': Number(o.totalAmount),
      'Payment Method': o.paymentMethod,
      'Payment Status': o.paymentStatus,
      'Order Status': o.status,
      'Date': o.createdAt.toISOString(),
    }));

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(rows);
    XLSX.utils.book_append_sheet(wb, ws, 'Orders');

    const buffer = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="luxora-orders-${Date.now()}.xlsx"`);
    res.send(buffer);
  } catch (err) {
    next(err);
  }
}
