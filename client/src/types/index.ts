export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: 'CUSTOMER' | 'ADMIN' | 'SUPER_ADMIN';
  createdAt?: string;
}

export interface Address {
  id?: string;
  fullName: string;
  phone: string;
  email?: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault?: boolean;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  bannerImage?: string;
  parentId?: string | null;
  children?: Category[];
}

export interface ProductOptionValue {
  id: string;
  label: string;
  value: string;
  priceModifier: number;
  isDefault?: boolean;
}

export interface ProductOption {
  id: string;
  name: string;
  type: string;
  isRequired: boolean;
  values: ProductOptionValue[];
}

export interface ProductImage {
  id: string;
  url: string;
  altText?: string;
  isPrimary: boolean;
}

export interface CustomizationTemplate {
  id: string;
  canvasWidth: number;
  canvasHeight: number;
  printableAreaJson: string;
  sidesConfigJson: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  sku: string;
  description: string;
  shortDescription?: string;
  basePrice: number;
  salePrice?: number | null;
  stock: number;
  isCustomizable: boolean;
  isFeatured: boolean;
  isBestSeller: boolean;
  isNewArrival: boolean;
  rating: number;
  reviewCount: number;
  minQuantity: number;
  categoryId: string;
  category?: Category;
  images: ProductImage[];
  options?: ProductOption[];
  customizationTemplate?: CustomizationTemplate;
  reviews?: Review[];
}

export interface Review {
  id: string;
  rating: number;
  title: string;
  comment: string;
  isVerifiedPurchase: boolean;
  createdAt: string;
  user?: {
    firstName: string;
    lastName: string;
  };
}

export interface CanvasLayer {
  id: string;
  type: 'text' | 'image' | 'shape';
  text?: string;
  fontFamily?: string;
  fontSize?: number;
  color?: string;
  fill?: string;
  textAlign?: 'left' | 'center' | 'right';
  isBold?: boolean;
  isItalic?: boolean;
  url?: string;
  x: number;
  y: number;
  width?: number;
  height?: number;
  rotation?: number;
  opacity?: number;
}

export interface CartItem {
  id: string;
  productId: string;
  product: Product;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  configuration?: Record<string, string>;
  customDesign?: {
    side: string;
    layers: CanvasLayer[];
  };
  customDesignPreviewUrl?: string;
}

export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  productSku: string;
  productImage?: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  configurationJson?: string;
  customDesignJson?: string;
  customDesignPreviewUrl?: string;
  product?: Product;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddressJson: string;
  billingAddressJson?: string;
  subtotal: number;
  discount: number;
  tax: number;
  shippingFee: number;
  totalAmount: number;
  paymentStatus: string;
  paymentMethod: string;
  orderStatus: string;
  trackingNumber?: string;
  trackingCarrier?: string;
  estimatedDelivery?: string;
  createdAt: string;
  items: OrderItem[];
}

export interface BulkQuote {
  id: string;
  quoteNumber: string;
  name: string;
  companyName: string;
  email: string;
  phone: string;
  productCategory: string;
  quantity: number;
  requiredDate?: string;
  message: string;
  status: string;
  adminNotes?: string;
  estimatedAmount?: number;
  createdAt: string;
}

export interface Coupon {
  id: string;
  code: string;
  description?: string;
  discountType: 'PERCENTAGE' | 'FIXED';
  discountValue: number;
  minOrderAmount: number;
  maxDiscount?: number;
  isActive: boolean;
}
