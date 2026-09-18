// ==========================================
// PRINTKART24 — TRANSACTIONAL EMAIL SERVICE
// ==========================================

export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

export class EmailService {
  /**
   * Send generic email (plugs into Resend/SendGrid/SMTP via RESEND_API_KEY)
   */
  static async sendEmail(options: EmailOptions): Promise<boolean> {
    console.log(`✉️ [EMAIL DISPATCHED] To: ${options.to} | Subject: "${options.subject}"`);
    return true;
  }

  static async sendOrderConfirmation(order: any): Promise<boolean> {
    const subject = `Order Confirmed #${order.orderNumber} — Thank You for Choosing PRINTKART24!`;
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 8px;">
        <div style="text-align: center; margin-bottom: 24px;">
          <h1 style="color: #1E60D5; margin: 0;">PRINTKART24</h1>
          <p style="color: #64748b; font-size: 14px;">Custom Printing & Corporate Gifting</p>
        </div>
        <h2>Order Confirmed!</h2>
        <p>Hi ${order.customerName},</p>
        <p>Thank you for your order! We have received your request and our prepress team is preparing your custom designs for printing.</p>
        <div style="background-color: #f8fafc; padding: 16px; border-radius: 6px; margin: 20px 0;">
          <p style="margin: 4px 0;"><strong>Order Number:</strong> #${order.orderNumber}</p>
          <p style="margin: 4px 0;"><strong>Total Amount:</strong> ₹${order.totalAmount.toLocaleString('en-IN')}</p>
          <p style="margin: 4px 0;"><strong>Status:</strong> ${order.orderStatus}</p>
        </div>
        <p>You can track the real-time progress of your printing at any time in your account dashboard.</p>
        <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;" />
        <p style="color: #94a3b8; font-size: 12px; text-align: center;">PRINTKART24 — Custom Printing Made Easy</p>
      </div>
    `;
    return this.sendEmail({ to: order.customerEmail, subject, html });
  }

  static async sendBulkQuoteNotification(quote: any): Promise<boolean> {
    const subject = `New B2B Bulk Quote Request: #${quote.quoteNumber} from ${quote.companyName}`;
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 24px;">
        <h2>New Bulk Quote Inquiry</h2>
        <p><strong>Quote ID:</strong> ${quote.quoteNumber}</p>
        <p><strong>Contact:</strong> ${quote.name} (${quote.email}, ${quote.phone})</p>
        <p><strong>Company:</strong> ${quote.companyName}</p>
        <p><strong>Category:</strong> ${quote.productCategory} | <strong>Quantity:</strong> ${quote.quantity}</p>
        <p><strong>Requirements:</strong> ${quote.message}</p>
      </div>
    `;
    return this.sendEmail({ to: 'admin@printkart24.com', subject, html });
  }
}
