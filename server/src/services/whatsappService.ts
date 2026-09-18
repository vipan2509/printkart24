// ==========================================
// PRINTKART24 — WHATSAPP NOTIFICATION SERVICE
// ==========================================

export class WhatsAppService {
  /**
   * Send WhatsApp notification to customer
   */
  static async notifyCustomerOrderConfirmed(order: any): Promise<boolean> {
    const text = `🎉 *PRINTKART24 Order Confirmed!*\n\nYour order *#${order.orderNumber}* has been confirmed.\nAmount: ₹${order.totalAmount.toLocaleString('en-IN')}\n\nOur print specialists are reviewing your design artwork. Thank you for shopping with PRINTKART24.`;
    console.log(`📱 [WHATSAPP TO CUSTOMER ${order.customerPhone}]:\n${text}`);
    return true;
  }

  /**
   * Send WhatsApp notification to Admin
   */
  static async notifyAdminNewOrder(order: any): Promise<boolean> {
    const text = `🔔 *New Order Received*\nOrder: *#${order.orderNumber}*\nCustomer: ${order.customerName}\nAmount: ₹${order.totalAmount.toLocaleString('en-IN')}\nItems: ${order.items?.length || 1}`;
    console.log(`📱 [WHATSAPP TO ADMIN]:\n${text}`);
    return true;
  }
}
