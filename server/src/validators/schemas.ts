import { z } from 'zod';

export const registerSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const createOrderSchema = z.object({
  customerName: z.string().min(2, 'Full name is required'),
  customerEmail: z.string().email('Valid email is required'),
  customerPhone: z.string().min(10, 'Valid phone number is required'),
  shippingAddress: z.object({
    fullName: z.string(),
    phone: z.string(),
    addressLine1: z.string(),
    addressLine2: z.string().optional(),
    city: z.string(),
    state: z.string(),
    postalCode: z.string(),
    country: z.string().default('India'),
  }),
  billingAddress: z.any().optional(),
  paymentMethod: z.enum(['RAZORPAY', 'COD']),
  couponCode: z.string().optional(),
  items: z.array(
    z.object({
      productId: z.string(),
      variantId: z.string().optional(),
      quantity: z.number().int().positive(),
      unitPrice: z.number().positive(),
      configuration: z.record(z.any()).optional(),
      customDesign: z.any().optional(),
      customDesignPreviewUrl: z.string().optional(),
    })
  ).min(1, 'Order must contain at least one item'),
});

export const bulkQuoteSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  companyName: z.string().min(2, 'Company name is required'),
  email: z.string().email('Valid email is required'),
  phone: z.string().min(10, 'Valid phone number is required'),
  productCategory: z.string().min(1, 'Product category is required'),
  quantity: z.number().int().positive('Quantity must be greater than 0'),
  requiredDate: z.string().optional(),
  artworkUrl: z.string().optional(),
  message: z.string().min(10, 'Please describe your requirements in more detail'),
});

export const reviewSchema = z.object({
  productId: z.string(),
  rating: z.number().int().min(1).max(5),
  title: z.string().min(3, 'Title is required'),
  comment: z.string().min(10, 'Review comment must be at least 10 characters'),
  images: z.array(z.string()).optional(),
});
