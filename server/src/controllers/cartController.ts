import { Response } from 'express';
import { prisma } from '../utils/prisma.js';
import { AuthenticatedRequest } from '../middleware/authMiddleware.js';

export async function getCart(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const userId = req.user?.id;
    const sessionId = (req.headers['x-session-id'] as string) || req.cookies?.sessionId;

    if (!userId && !sessionId) {
      res.json({ success: true, data: { items: [], subtotal: 0, totalCount: 0 } });
      return;
    }

    const cart = await prisma.cart.findFirst({
      where: userId ? { userId } : { sessionId },
      include: {
        items: {
          include: {
            product: {
              include: {
                images: { where: { isPrimary: true }, take: 1 },
              },
            },
            variant: true,
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!cart) {
      res.json({ success: true, data: { items: [], subtotal: 0, totalCount: 0 } });
      return;
    }

    const subtotal = cart.items.reduce((sum, item) => sum + item.totalPrice, 0);
    const totalCount = cart.items.reduce((sum, item) => sum + item.quantity, 0);

    res.json({
      success: true,
      data: {
        id: cart.id,
        items: cart.items,
        subtotal,
        totalCount,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Error fetching cart' });
  }
}

export async function addToCart(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const userId = req.user?.id;
    const sessionId = (req.headers['x-session-id'] as string) || req.cookies?.sessionId || `sess_${Date.now()}`;

    const {
      productId,
      variantId,
      quantity = 1,
      unitPrice,
      totalPrice,
      configuration,
      customDesign,
      customDesignPreviewUrl,
    } = req.body;

    if (!productId || !unitPrice) {
      res.status(400).json({ success: false, message: 'Product ID and price are required' });
      return;
    }

    // Find or create cart
    let cart = await prisma.cart.findFirst({
      where: userId ? { userId } : { sessionId },
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: {
          userId: userId || null,
          sessionId: userId ? null : sessionId,
        },
      });
    }

    const calculatedTotal = totalPrice || unitPrice * quantity;

    // Create cart item
    const item = await prisma.cartItem.create({
      data: {
        cartId: cart.id,
        productId,
        variantId: variantId || null,
        quantity: Math.max(1, parseInt(quantity, 10)),
        unitPrice: parseFloat(unitPrice),
        totalPrice: parseFloat(calculatedTotal),
        configurationJson: configuration ? JSON.stringify(configuration) : null,
        customDesignJson: customDesign ? JSON.stringify(customDesign) : null,
        customDesignPreviewUrl: customDesignPreviewUrl || null,
      },
      include: {
        product: {
          include: {
            images: { where: { isPrimary: true }, take: 1 },
          },
        },
      },
    });

    res.status(201).json({
      success: true,
      data: item,
      sessionId,
      message: 'Item added to cart successfully',
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Error adding to cart' });
  }
}

export async function updateCartItem(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const id = req.params.id as string;
    const { quantity } = req.body;

    if (!quantity || quantity < 1) {
      res.status(400).json({ success: false, message: 'Invalid quantity' });
      return;
    }

    const existing = await prisma.cartItem.findUnique({ where: { id } });
    if (!existing) {
      res.status(404).json({ success: false, message: 'Cart item not found' });
      return;
    }

    const updated = await prisma.cartItem.update({
      where: { id },
      data: {
        quantity,
        totalPrice: existing.unitPrice * quantity,
      },
      include: {
        product: true,
      },
    });

    res.json({ success: true, data: updated, message: 'Cart updated' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Error updating cart item' });
  }
}

export async function removeCartItem(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const id = req.params.id as string;
    await prisma.cartItem.delete({ where: { id } });
    res.json({ success: true, message: 'Item removed from cart' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Error removing cart item' });
  }
}

export async function clearCart(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const userId = req.user?.id;
    const sessionId = (req.headers['x-session-id'] as string) || req.cookies?.sessionId;

    const cart = await prisma.cart.findFirst({
      where: userId ? { userId } : { sessionId },
    });

    if (cart) {
      await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
    }

    res.json({ success: true, message: 'Cart cleared successfully' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Error clearing cart' });
  }
}
