import { Request, Response, NextFunction } from 'express';
import { prisma } from '../config/prisma';

export async function getDashboardStats(req: Request, res: Response, next: NextFunction) {
  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

    const [
      totalRevenue, monthRevenue, lastMonthRevenue,
      totalOrders, monthOrders,
      totalCustomers, monthCustomers,
      pendingOrders, lowStockProducts,
      recentOrders, topProducts, revenueByDay,
    ] = await Promise.all([
      // Revenue
      prisma.order.aggregate({ _sum: { totalAmount: true }, where: { paymentStatus: 'PAID' } }),
      prisma.order.aggregate({ _sum: { totalAmount: true }, where: { paymentStatus: 'PAID', createdAt: { gte: startOfMonth } } }),
      prisma.order.aggregate({ _sum: { totalAmount: true }, where: { paymentStatus: 'PAID', createdAt: { gte: startOfLastMonth, lte: endOfLastMonth } } }),

      // Orders
      prisma.order.count(),
      prisma.order.count({ where: { createdAt: { gte: startOfMonth } } }),

      // Customers
      prisma.user.count({ where: { role: 'CUSTOMER' } }),
      prisma.user.count({ where: { role: 'CUSTOMER', createdAt: { gte: startOfMonth } } }),

      // Alerts
      prisma.order.count({ where: { status: 'PENDING' } }),
      prisma.product.count({ where: { stockQty: { lte: 5 }, isActive: true } }),

      // Recent orders
      prisma.order.findMany({
        take: 10,
        orderBy: { createdAt: 'desc' },
        include: {
          user: { select: { firstName: true, lastName: true, email: true } },
          items: { take: 1 },
        },
      }),

      // Top selling products
      prisma.orderItem.groupBy({
        by: ['productId', 'productName'],
        _sum: { quantity: true, totalPrice: true },
        orderBy: { _sum: { totalPrice: 'desc' } },
        take: 5,
      }),

      // Revenue last 30 days by day
      prisma.$queryRaw<{ date: string; revenue: number }[]>`
        SELECT 
          DATE_TRUNC('day', created_at)::DATE::TEXT as date,
          SUM(total_amount)::FLOAT as revenue
        FROM orders
        WHERE payment_status = 'PAID'
          AND created_at >= NOW() - INTERVAL '30 days'
        GROUP BY DATE_TRUNC('day', created_at)
        ORDER BY date ASC
      `,
    ]);

    const monthRevenueVal = Number(monthRevenue._sum.totalAmount ?? 0);
    const lastMonthRevenueVal = Number(lastMonthRevenue._sum.totalAmount ?? 0);
    const revenueGrowth = lastMonthRevenueVal === 0 ? 100
      : +((monthRevenueVal - lastMonthRevenueVal) / lastMonthRevenueVal * 100).toFixed(1);

    res.json({
      success: true,
      data: {
        stats: {
          totalRevenue: Number(totalRevenue._sum.totalAmount ?? 0),
          monthRevenue: monthRevenueVal,
          revenueGrowth,
          totalOrders,
          monthOrders,
          totalCustomers,
          monthCustomers,
          pendingOrders,
          lowStockProducts,
        },
        recentOrders,
        topProducts,
        revenueByDay,
      },
    });
  } catch (err) {
    next(err);
  }
}

export async function getInventoryAlerts(req: Request, res: Response, next: NextFunction) {
  try {
    const lowStock = await prisma.product.findMany({
      where: { stockQty: { lte: 10 }, isActive: true },
      include: { images: { where: { isPrimary: true }, take: 1 }, category: { select: { name: true } } },
      orderBy: { stockQty: 'asc' },
    });

    res.json({ success: true, data: lowStock });
  } catch (err) {
    next(err);
  }
}
