import { Request, Response, NextFunction } from 'express';
import { prisma } from '../config/prisma';
import { AppError } from '../utils/AppError';
import * as XLSX from 'xlsx';

function generateOrderNumber(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `LXR-${timestamp}-${random}`;
}

// ─── CREATE ORDER (UPI) ───────────────────────────────────────────────────────

export async function createOrder(req: Request, res: Response, next: NextFunction) {
  try {
    const { items, paymentScreenshotUrl, shippingAddress, notes } = req.body;
    const userId = req.user!.id;

    if (!items?.length) throw new AppError('Order must contain at least one item.', 400);
    if (!shippingAddress) throw new AppError('Shipping address is required.', 400);
    if (!paymentScreenshotUrl) throw new AppError('Payment screenshot is required.', 400);

    const productIds = items.map((i: any) => i.productId);
    const products = await prisma.product.findMany({
      where: { id: { in: productIds }, isActive: true },
      include: { images: { where: { isPrimary: true }, take: 1 } },
    });

    if (products.length !== productIds.length) {
      throw new AppError('One or more products are unavailable.', 400);
    }

    let subtotal = 0;
    const orderItems = items.map((item: any) => {
      const product = products.find((p: any) => p.id === item.productId)!;
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
        imageUrl: product.images[0]?.url ?? null,
        quantity: item.quantity,
        unitPrice,
        totalPrice,
      };
    });

    const shippingCost = subtotal >= 2999 ? 0 : 199;
    const totalAmount = subtotal + shippingCost;
    const orderNumber = generateOrderNumber();

    // Create address
    let addressId: string | undefined;
    try {
      const address = await prisma.address.create({
        data: {
          userId,
          label: 'Shipping',
          fullName: shippingAddress.fullName,
          phone: shippingAddress.phone,
          line1: shippingAddress.line1,
          line2: shippingAddress.line2 || null,
          city: shippingAddress.city,
          state: shippingAddress.state,
          pincode: shippingAddress.pincode,
          isDefault: false,
        },
      });
      addressId = address.id;
    } catch {}

    const order = await prisma.$transaction(async (tx) => {
      // Decrement stock
      await Promise.all(
        items.map((item: any) =>
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
          paymentMethod: 'UPI',
          notes: notes || null,
          items: { create: orderItems },
        },
        include: {
          items: true,
          address: true,
          user: { select: { email: true, firstName: true } },
        },
      });

      // Store screenshot URL in gatewayPaymentId field
      await tx.payment.create({
        data: {
          orderId: created.id,
          amount: totalAmount,
          method: 'UPI',
          status: 'PENDING',
          gatewayPaymentId: paymentScreenshotUrl,
        },
      });

      // Clear cart
      await tx.cartItem.deleteMany({ where: { userId } });

      return created;
    });

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

    const where: any = {
      userId,
      ...(status && { status: String(status) }),
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
          payment: { select: { status: true, method: true, gatewayPaymentId: true } },
        },
      }),
      prisma.order.count({ where }),
    ]);

    res.json({
      success: true,
      data: {
        orders,
        pagination: {
          page: Number(page), limit: Number(limit), total,
          totalPages: Math.ceil(total / Number(limit)),
        },
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
      include: { items: true, address: true, payment: true },
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
    const { page = 1, limit = 20, status, paymentStatus, search } = req.query;

    const where: any = {
      ...(status && { status }),
      ...(paymentStatus && { paymentStatus }),
      ...(search && {
        OR: [
          { orderNumber: { contains: String(search), mode: 'insensitive' } },
          { user: { email: { contains: String(search), mode: 'insensitive' } } },
          { user: { firstName: { contains: String(search), mode: 'insensitive' } } },
          { user: { phone: { contains: String(search), mode: 'insensitive' } } },
        ],
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
          payment: { select: { status: true, method: true, paidAt: true, gatewayPaymentId: true } },
        },
      }),
      prisma.order.count({ where }),
    ]);

    res.json({
      success: true,
      data: {
        orders,
        pagination: {
          page: Number(page), limit: Number(limit), total,
          totalPages: Math.ceil(total / Number(limit)),
        },
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
    if (status === 'SHIPPED') { updates.shippedAt = new Date(); if (trackingNumber) updates.trackingNumber = trackingNumber; }
    if (status === 'DELIVERED') updates.deliveredAt = new Date();
    if (status === 'CANCELLED') updates.cancelledAt = new Date();

    const updated = await prisma.order.update({ where: { id }, data: updates });
    res.json({ success: true, data: updated });
  } catch (err) {
    next(err);
  }
}

// ─── ADMIN: EXPORT ORDERS ─────────────────────────────────────────────────────

export async function exportOrders(req: Request, res: Response, next: NextFunction) {
  try {
    const orders = await prisma.order.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { firstName: true, lastName: true, email: true, phone: true } },
        address: true,
        items: true,
        payment: true,
      },
    });

    const rows = orders.map((o: any) => ({
      'Order Number': o.orderNumber,
      'Customer': `${o.user?.firstName} ${o.user?.lastName}`,
      'Email': o.user?.email,
      'Phone': o.user?.phone,
      'Address': o.address ? `${o.address.line1}, ${o.address.city}, ${o.address.state} - ${o.address.pincode}` : '',
      'Items': o.items.map((i: any) => `${i.productName} x${i.quantity}`).join('; '),
      'Subtotal': Number(o.subtotal),
      'Shipping': Number(o.shippingCost),
      'Total': Number(o.totalAmount),
      'Payment Method': o.paymentMethod,
      'Payment Status': o.paymentStatus,
      'Order Status': o.status,
      'Screenshot URL': o.payment?.gatewayPaymentId ?? '',
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
