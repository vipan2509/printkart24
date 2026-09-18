import { Request, Response } from 'express';
import { prisma } from '../utils/prisma.js';
import { bulkQuoteSchema } from '../validators/schemas.js';
import { EmailService } from '../services/emailService.js';

export async function submitBulkQuote(req: Request, res: Response): Promise<void> {
  try {
    const validated = bulkQuoteSchema.safeParse(req.body);
    if (!validated.success) {
      res.status(400).json({
        success: false,
        message: validated.error.errors[0]?.message || 'Invalid quotation details',
      });
      return;
    }

    const quoteNumber = `BQ-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`;

    const quote = await prisma.bulkQuote.create({
      data: {
        quoteNumber,
        ...validated.data,
      },
    });

    EmailService.sendBulkQuoteNotification(quote).catch(console.error);

    res.status(201).json({
      success: true,
      data: quote,
      message: 'Quotation request submitted! Our corporate sales team will contact you within 24 business hours.',
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Error submitting quote request' });
  }
}
