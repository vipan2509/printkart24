import { Request, Response } from 'express';
import { prisma } from '../utils/prisma.js';

export async function getProducts(req: Request, res: Response): Promise<void> {
  try {
    const {
      category,
      search,
      minPrice,
      maxPrice,
      isCustomizable,
      isFeatured,
      isBestSeller,
      isNewArrival,
      sortBy = 'featured',
      page = '1',
      limit = '12',
    } = req.query;

    const pageNum = Math.max(1, parseInt(page as string, 10) || 1);
    const take = Math.min(50, Math.max(1, parseInt(limit as string, 10) || 12));
    const skip = (pageNum - 1) * take;

    const where: any = {
      status: 'PUBLISHED',
    };

    if (category) {
      // Allow searching by category slug or parent slug
      where.OR = [
        { category: { slug: category as string } },
        { category: { parent: { slug: category as string } } },
      ];
    }

    if (search) {
      where.AND = [
        {
          OR: [
            { name: { contains: search as string } },
            { description: { contains: search as string } },
            { sku: { contains: search as string } },
          ],
        },
      ];
    }

    if (minPrice || maxPrice) {
      where.basePrice = {};
      if (minPrice) where.basePrice.gte = parseFloat(minPrice as string);
      if (maxPrice) where.basePrice.lte = parseFloat(maxPrice as string);
    }

    if (isCustomizable !== undefined) {
      where.isCustomizable = isCustomizable === 'true';
    }

    if (isFeatured !== undefined) {
      where.isFeatured = isFeatured === 'true';
    }

    if (isBestSeller !== undefined) {
      where.isBestSeller = isBestSeller === 'true';
    }

    if (isNewArrival !== undefined) {
      where.isNewArrival = isNewArrival === 'true';
    }

    // Determine sorting
    let orderBy: any = { isFeatured: 'desc' };
    switch (sortBy) {
      case 'price_low':
      case 'price-asc':
        orderBy = { basePrice: 'asc' };
        break;
      case 'price_high':
      case 'price-desc':
        orderBy = { basePrice: 'desc' };
        break;
      case 'rating':
        orderBy = { rating: 'desc' };
        break;
      case 'newest':
        orderBy = { createdAt: 'desc' };
        break;
      case 'bestseller':
        orderBy = { isBestSeller: 'desc' };
        break;
      case 'featured':
      default:
        orderBy = [{ isFeatured: 'desc' }, { rating: 'desc' }];
        break;
    }

    const [total, products] = await Promise.all([
      prisma.product.count({ where }),
      prisma.product.findMany({
        where,
        include: {
          category: { select: { id: true, name: true, slug: true } },
          images: { orderBy: { sortOrder: 'asc' } },
        },
        orderBy,
        skip,
        take,
      }),
    ]);

    res.json({
      success: true,
      data: {
        products,
        pagination: {
          total,
          page: pageNum,
          limit: take,
          totalPages: Math.ceil(total / take),
        },
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Error fetching products' });
  }
}

export async function getProductBySlug(req: Request, res: Response): Promise<void> {
  try {
    const slug = req.params.slug as string;

    const product = await prisma.product.findUnique({
      where: { slug },
      include: {
        category: {
          include: {
            parent: true,
          },
        },
        images: { orderBy: { sortOrder: 'asc' } },
        options: {
          orderBy: { sortOrder: 'asc' },
          include: {
            values: { orderBy: { sortOrder: 'asc' } },
          },
        },
        customizationTemplate: true,
        reviews: {
          where: { isApproved: true },
          include: {
            user: { select: { firstName: true, lastName: true } },
          },
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
      },
    });

    if (!product) {
      res.status(404).json({ success: false, message: 'Product not found' });
      return;
    }

    // Related products in the same category
    const relatedProducts = await prisma.product.findMany({
      where: {
        categoryId: product.categoryId,
        id: { not: product.id },
        status: 'PUBLISHED',
      },
      include: {
        images: { orderBy: { sortOrder: 'asc' }, take: 2 },
      },
      take: 4,
    });

    res.json({
      success: true,
      data: {
        product,
        relatedProducts,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Error fetching product' });
  }
}

export async function getSearchSuggestions(req: Request, res: Response): Promise<void> {
  try {
    const { q } = req.query;
    if (!q || typeof q !== 'string' || q.trim().length < 2) {
      res.json({ success: true, data: { products: [], categories: [] } });
      return;
    }

    const query = q.trim();

    const [products, categories] = await Promise.all([
      prisma.product.findMany({
        where: {
          status: 'PUBLISHED',
          OR: [
            { name: { contains: query } },
            { description: { contains: query } },
            { sku: { contains: query } },
          ],
        },
        select: {
          id: true,
          name: true,
          slug: true,
          basePrice: true,
          salePrice: true,
          images: { where: { isPrimary: true }, select: { url: true }, take: 1 },
          category: { select: { name: true, slug: true } },
        },
        take: 6,
      }),
      prisma.category.findMany({
        where: {
          name: { contains: query },
        },
        select: { id: true, name: true, slug: true, image: true },
        take: 4,
      }),
    ]);

    res.json({
      success: true,
      data: { products, categories },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Error searching suggestions' });
  }
}
