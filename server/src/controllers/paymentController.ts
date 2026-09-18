import { Request, Response } from 'express';
import { prisma } from '../utils/prisma.js';
import { PaymentService } from '../services/paymentService.js';

export async function createPaymentOrder(req: Request, res: Response): Promise<void> {
  try {
    const { orderId } = req.body;

    const order = await prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      res.status(404).json({ success: false, message: 'Order not found' });
      return;
    }

    const razorpayOrder = await PaymentService.createOrder({
      amount: order.totalAmount,
      receipt: order.orderNumber,
      notes: {
        orderId: order.id,
        orderNumber: order.orderNumber,
        customerEmail: order.customerEmail,
      },
    });

    res.json({
      success: true,
      data: razorpayOrder,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Error creating payment order' });
  }
}

export async function verifyPayment(req: Request, res: Response): Promise<void> {
  try {
    const { orderId, razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;

    const isValid = PaymentService.verifySignature({
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
    });

    if (!isValid) {
      res.status(400).json({ success: false, message: 'Payment verification failed: invalid signature' });
      return;
    }

    // Update Payment & Order records
    await prisma.$transaction([
      prisma.payment.create({
        data: {
          orderId,
          razorpayOrderId,
          razorpayPaymentId,
          razorpaySignature,
          amount: 0, // Recorded in order
          status: 'COMPLETED',
          method: 'RAZORPAY',
        },
      }),
      prisma.order.update({
        where: { id: orderId },
        data: {
          paymentStatus: 'COMPLETED',
          orderStatus: 'CONFIRMED',
        },
      }),
    ]);

    res.json({
      success: true,
      message: 'Payment verified and order confirmed successfully',
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Error verifying payment' });
  }
}
