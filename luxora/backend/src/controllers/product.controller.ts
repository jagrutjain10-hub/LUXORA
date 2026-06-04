import { Request, Response, NextFunction } from 'express';
import { prisma } from '../config/prisma';
import { AppError } from '../utils/AppError';
import { generateSlug } from '../utils/helpers';
import { Prisma } from '@prisma/client';

// ─── LIST PRODUCTS (public) ───────────────────────────────────────────────────

export async function listProducts(req: Request, res: Response, next: NextFunction) {
  try {
    const {
      page = 1, limit = 12, category, search, sort = 'createdAt',
      order = 'desc', minPrice, maxPrice, featured, bestSeller, tags,
    } = req.query;

    const skip = (Number(page) - 1) * Number(limit);

    const where: Prisma.ProductWhereInput = {
      isActive: true,
      ...(category && { category: { slug: String(category) } }),
      ...(featured === 'true' && { isFeatured: true }),
      ...(bestSeller === 'true' && { isBestSeller: true }),
      ...(search && {
        OR: [
          { name: { contains: String(search), mode: 'insensitive' } },
          { description: { contains: String(search), mode: 'insensitive' } },
          { tags: { hasSome: [String(search)] } },
        ],
      }),
      ...(minPrice || maxPrice ? {
        price: {
          ...(minPrice && { gte: Number(minPrice) }),
          ...(maxPrice && { lte: Number(maxPrice) }),
        },
      } : {}),
      ...(tags && { tags: { hasSome: String(tags).split(',') } }),
    };

    const validSorts = ['price', 'createdAt', 'name'];
    const sortField = validSorts.includes(String(sort)) ? String(sort) : 'createdAt';

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        skip,
        take: Number(limit),
        orderBy: { [sortField]: order === 'asc' ? 'asc' : 'desc' },
        include: {
          category: { select: { name: true, slug: true } },
          images: { where: { isPrimary: true }, take: 1 },
          reviews: { select: { rating: true }, where: { isApproved: true } },
        },
      }),
      prisma.product.count({ where }),
    ]);

    // Compute avg ratings
    const enriched = products.map(p => ({
      ...p,
      avgRating: p.reviews.length
        ? +(p.reviews.reduce((s, r) => s + r.rating, 0) / p.reviews.length).toFixed(1)
        : null,
      reviewCount: p.reviews.length,
      reviews: undefined,
    }));

    res.json({
      success: true,
      data: {
        products: enriched,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          totalPages: Math.ceil(total / Number(limit)),
        },
      },
    });
  } catch (err) {
    next(err);
  }
}

// ─── GET SINGLE PRODUCT ───────────────────────────────────────────────────────

export async function getProduct(req: Request, res: Response, next: NextFunction) {
  try {
    const { slug } = req.params;

    const product = await prisma.product.findUnique({
      where: { slug, isActive: true },
      include: {
        category: { select: { name: true, slug: true } },
        images: { orderBy: { sortOrder: 'asc' } },
        reviews: {
          where: { isApproved: true },
          include: { user: { select: { firstName: true, lastName: true, avatarUrl: true } } },
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
      },
    });

    if (!product) throw new AppError('Product not found.', 404);

    // Related products
    const related = await prisma.product.findMany({
      where: {
        categoryId: product.categoryId,
        isActive: true,
        id: { not: product.id },
      },
      take: 4,
      include: {
        images: { where: { isPrimary: true }, take: 1 },
        reviews: { select: { rating: true }, where: { isApproved: true } },
      },
    });

    const avgRating = product.reviews.length
      ? +(product.reviews.reduce((s, r) => s + r.rating, 0) / product.reviews.length).toFixed(1)
      : null;

    res.json({
      success: true,
      data: {
        ...product,
        avgRating,
        reviewCount: product.reviews.length,
        related: related.map(p => ({
          ...p,
          avgRating: p.reviews.length
            ? +(p.reviews.reduce((s, r) => s + r.rating, 0) / p.reviews.length).toFixed(1)
            : null,
          reviews: undefined,
        })),
      },
    });
  } catch (err) {
    next(err);
  }
}

// ─── CREATE PRODUCT (admin) ───────────────────────────────────────────────────

export async function createProduct(req: Request, res: Response, next: NextFunction) {
  try {
    const { name, description, shortDesc, sku, price, discountPrice, categoryId,
      stockQty, isFeatured, isBestSeller, tags, material, weight, dimensions,
      careInstructions, metaTitle, metaDescription, images } = req.body;

    const existing = await prisma.product.findUnique({ where: { sku } });
    if (existing) throw new AppError('A product with this SKU already exists.', 409);

    const slug = await generateSlug(name, async (s) => {
      const exists = await prisma.product.findUnique({ where: { slug: s } });
      return !!exists;
    });

    const product = await prisma.product.create({
      data: {
        name, slug, description, shortDesc, sku,
        price, discountPrice, categoryId,
        stockQty: stockQty ?? 0,
        isFeatured: isFeatured ?? false,
        isBestSeller: isBestSeller ?? false,
        tags: tags ?? [],
        material, weight, dimensions, careInstructions,
        metaTitle, metaDescription,
        images: images?.length ? {
          create: images.map((img: { url: string; altText?: string; isPrimary?: boolean }, i: number) => ({
            url: img.url,
            altText: img.altText ?? name,
            sortOrder: i,
            isPrimary: i === 0,
          })),
        } : undefined,
      },
      include: { images: true, category: { select: { name: true, slug: true } } },
    });

    res.status(201).json({ success: true, data: product });
  } catch (err) {
    next(err);
  }
}

// ─── UPDATE PRODUCT (admin) ───────────────────────────────────────────────────

export async function updateProduct(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const updates = req.body;

    const existing = await prisma.product.findUnique({ where: { id } });
    if (!existing) throw new AppError('Product not found.', 404);

    // Handle image updates separately
    const { images, ...productData } = updates;

    const product = await prisma.product.update({
      where: { id },
      data: {
        ...productData,
        ...(images && {
          images: {
            deleteMany: {},
            create: images.map((img: { url: string; altText?: string }, i: number) => ({
              url: img.url,
              altText: img.altText,
              sortOrder: i,
              isPrimary: i === 0,
            })),
          },
        }),
      },
      include: { images: true, category: { select: { name: true, slug: true } } },
    });

    res.json({ success: true, data: product });
  } catch (err) {
    next(err);
  }
}

// ─── DELETE PRODUCT (admin) ───────────────────────────────────────────────────

export async function deleteProduct(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;

    await prisma.product.update({
      where: { id },
      data: { isActive: false },
    });

    res.json({ success: true, message: 'Product deactivated successfully.' });
  } catch (err) {
    next(err);
  }
}

// ─── BULK CREATE (admin) ──────────────────────────────────────────────────────

export async function bulkCreateProducts(req: Request, res: Response, next: NextFunction) {
  try {
    const { products } = req.body;

    if (!Array.isArray(products) || products.length === 0) {
      throw new AppError('No products provided.', 400);
    }

    const results = await Promise.allSettled(
      products.map(async (p) => {
        const slug = await generateSlug(p.name, async (s) => {
          const exists = await prisma.product.findUnique({ where: { slug: s } });
          return !!exists;
        });
        return prisma.product.create({ data: { ...p, slug } });
      })
    );

    const created = results.filter(r => r.status === 'fulfilled').length;
    const failed = results.filter(r => r.status === 'rejected').length;

    res.status(201).json({
      success: true,
      message: `${created} products created, ${failed} failed.`,
      data: { created, failed },
    });
  } catch (err) {
    next(err);
  }
}
