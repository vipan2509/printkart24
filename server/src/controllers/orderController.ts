import { Response } from 'express';
import { prisma } from '../utils/prisma.js';
import { AuthenticatedRequest } from '../middleware/authMiddleware.js';
import { createOrderSchema } from '../validators/schemas.js';
import { EmailService } from '../services/emailService.js';
import { WhatsAppService } from '../services/whatsappService.js';

export async function createOrder(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const validated = createOrderSchema.safeParse(req.body);
    if (!validated.success) {
      res.status(400).json({
        success: false,
        message: validated.error.errors[0]?.message || 'Invalid order data',
      });
      return;
    }

    const {
      customerName,
      customerEmail,
      customerPhone,
      shippingAddress,
      billingAddress,
      paymentMethod,
      couponCode,
      items,
    } = validated.data;

    // Calculate Subtotal
    let subtotal = 0;
    for (const item of items) {
      subtotal += item.unitPrice * item.quantity;
    }

    // Process Coupon if provided
    let discount = 0;
    let validCoupon: any = null;
    if (couponCode) {
      validCoupon = await prisma.coupon.findUnique({
        where: { code: couponCode.toUpperCase() },
      });

      if (validCoupon && validCoupon.isActive) {
        if (subtotal >= validCoupon.minOrderAmount) {
          if (validCoupon.discountType === 'PERCENTAGE') {
            discount = (subtotal * validCoupon.discountValue) / 100;
            if (validCoupon.maxDiscount && discount > validCoupon.maxDiscount) {
              discount = validCoupon.maxDiscount;
            }
          } else {
            discount = validCoupon.discountValue;
          }
        }
      }
    }

    // Shipping Fee (Free above ₹999, else ₹99)
    const discountedSubtotal = Math.max(0, subtotal - discount);
    const shippingFee = discountedSubtotal >= 999 ? 0 : 99;

    // 18% GST calculation
    const tax = Math.round(discountedSubtotal * 0.18 * 100) / 100;
    const totalAmount = Math.round((discountedSubtotal + shippingFee + tax) * 100) / 100;

    // Generate Unique Order Number: e.g. PK + 5 random digits
    const orderNumber = `PK${Math.floor(10000 + Math.random() * 90000)}`;

    // Has custom designs? If yes, start in DESIGN_REVIEW stage
    const hasCustomDesign = items.some((it) => it.customDesign || it.customDesignPreviewUrl);
    const initialStatus = paymentMethod === 'COD' ? 'CONFIRMED' : 'PENDING';

    const order = await prisma.order.create({
      data: {
        orderNumber,
        userId: req.user?.id || null,
        customerName,
        customerEmail,
        customerPhone,
        shippingAddressJson: JSON.stringify(shippingAddress),
        billingAddressJson: billingAddress ? JSON.stringify(billingAddress) : null,
        subtotal,
        discount,
        tax,
        shippingFee,
        totalAmount,
        paymentMethod,
        paymentStatus: paymentMethod === 'COD' ? 'COMPLETED' : 'PENDING',
        orderStatus: hasCustomDesign && paymentMethod === 'COD' ? 'DESIGN_REVIEW' : initialStatus,
        estimatedDelivery: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
        items: {
          create: items.map((item) => ({
            productId: item.productId,
            variantId: item.variantId || null,
            productName: item.productId, // Will be enriched or displayable
            productSku: `SKU-${item.productId.slice(0, 6)}`,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            totalPrice: item.unitPrice * item.quantity,
            configurationJson: item.configuration ? JSON.stringify(item.configuration) : null,
            customDesignJson: item.customDesign ? JSON.stringify(item.customDesign) : null,
            customDesignPreviewUrl: item.customDesignPreviewUrl || null,
          })),
        },
      },
      include: {
        items: true,
      },
    });

    // Update coupon usage if used
    if (validCoupon) {
      await prisma.coupon.update({
        where: { id: validCoupon.id },
        data: { timesUsed: { increment: 1 } },
      });
      await prisma.couponUsage.create({
        data: {
          couponId: validCoupon.id,
          userId: req.user?.id || null,
          orderId: order.id,
          discountAmount: discount,
        },
      });
    }

    // Trigger Notifications
    EmailService.sendOrderConfirmation(order).catch(console.error);
    WhatsAppService.notifyCustomerOrderConfirmed(order).catch(console.error);
    WhatsAppService.notifyAdminNewOrder(order).catch(console.error);

    res.status(201).json({
      success: true,
      data: order,
      message: 'Order created successfully',
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Error creating order' });
  }
}

export async function getMyOrders(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Authentication required' });
      return;
    }

    const orders = await prisma.order.findMany({
      where: { userId: req.user.id },
      include: {
        items: {
          include: {
            product: {
              include: {
                images: { where: { isPrimary: true }, take: 1 },
              },
            },
          },
        },
        payments: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json({ success: true, data: orders });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Error fetching user orders' });
  }
}

export async function getOrderByNumber(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const orderNumber = req.params.orderNumber as string;

    const order = await prisma.order.findUnique({
      where: { orderNumber },
      include: {
        items: {
          include: {
            product: {
              include: {
                images: { where: { isPrimary: true }, take: 1 },
              },
            },
          },
        },
        payments: true,
      },
    });

    if (!order) {
      res.status(404).json({ success: false, message: 'Order not found' });
      return;
    }

    res.json({ success: true, data: order });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Error fetching order' });
  }
}
