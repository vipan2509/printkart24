import { Response } from 'express';
import { prisma } from '../utils/prisma.js';
import { AuthenticatedRequest } from '../middleware/authMiddleware.js';
import { reviewSchema } from '../validators/schemas.js';

export async function createReview(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Please log in to submit a review' });
      return;
    }

    const validated = reviewSchema.safeParse(req.body);
    if (!validated.success) {
      res.status(400).json({
        success: false,
        message: validated.error.errors[0]?.message || 'Invalid review data',
      });
      return;
    }

    const { productId, rating, title, comment, images } = validated.data;

    // Verify if customer purchased this product
    const purchased = await prisma.orderItem.findFirst({
      where: {
        productId,
        order: { userId: req.user.id },
      },
    });

    const review = await prisma.review.create({
      data: {
        productId,
        userId: req.user.id,
        rating,
        title,
        comment,
        imagesJson: images ? JSON.stringify(images) : null,
        isVerifiedPurchase: !!purchased,
        isApproved: true,
      },
      include: {
        user: { select: { firstName: true, lastName: true } },
      },
    });

    // Recalculate Product average rating
    const aggregate = await prisma.review.aggregate({
      where: { productId, isApproved: true },
      _avg: { rating: true },
      _count: { rating: true },
    });

    await prisma.product.update({
      where: { id: productId },
      data: {
        rating: Math.round((aggregate._avg.rating || 5.0) * 10) / 10,
        reviewCount: aggregate._count.rating || 1,
      },
    });

    res.status(201).json({
      success: true,
      data: review,
      message: 'Review submitted successfully! Thank you for your feedback.',
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Error creating review' });
  }
}
