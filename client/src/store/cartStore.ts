import { create } from 'zustand';
import api from '../services/api';
import { CartItem } from '../types';

interface CartState {
  items: CartItem[];
  subtotal: number;
  totalCount: number;
  isLoading: boolean;
  couponCode: string;
  discount: number;
  tax: number;
  shippingFee: number;
  totalAmount: number;
  fetchCart: () => Promise<void>;
  addItem: (params: {
    productId: string;
    variantId?: string;
    quantity: number;
    unitPrice: number;
    totalPrice?: number;
    configuration?: Record<string, string>;
    customDesign?: any;
    customDesignPreviewUrl?: string;
  }) => Promise<boolean>;
  updateQuantity: (id: string, quantity: number) => Promise<void>;
  removeItem: (id: string) => Promise<void>;
  applyCoupon: (code: string) => boolean;
  removeCoupon: () => void;
  clearCart: () => Promise<void>;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  subtotal: 0,
  totalCount: 0,
  isLoading: false,
  couponCode: '',
  discount: 0,
  tax: 0,
  shippingFee: 0,
  totalAmount: 0,

  fetchCart: async () => {
    try {
      set({ isLoading: true });
      const res = await api.get('/cart');
      if (res.data.success && res.data.data) {
        const items: CartItem[] = res.data.data.items || [];
        const subtotal = items.reduce((sum, it) => sum + (it.totalPrice || it.unitPrice * it.quantity), 0);
        const totalCount = items.reduce((sum, it) => sum + it.quantity, 0);

        // Calculate discount if coupon applied
        let discount = 0;
        const code = get().couponCode;
        if (code === 'WELCOME10') discount = Math.min(500, subtotal * 0.1);
        else if (code === 'PRINTKART20' && subtotal >= 1499) discount = Math.min(1000, subtotal * 0.2);
        else if (code === 'BULK50' && subtotal >= 2999) discount = 500;

        const discountedSubtotal = Math.max(0, subtotal - discount);
        const shippingFee = discountedSubtotal >= 999 || items.length === 0 ? 0 : 99;
        const tax = Math.round(discountedSubtotal * 0.18 * 100) / 100;
        const totalAmount = Math.round((discountedSubtotal + shippingFee + tax) * 100) / 100;

        set({
          items,
          subtotal,
          totalCount,
          discount,
          shippingFee,
          tax,
          totalAmount,
        });
      }
    } catch (err) {
      console.error('Error fetching cart:', err);
    } finally {
      set({ isLoading: false });
    }
  },

  addItem: async (params) => {
    try {
      set({ isLoading: true });
      const res = await api.post('/cart', params);
      if (res.data.success) {
        await get().fetchCart();
        return true;
      }
      return false;
    } catch (err) {
      console.error('Error adding to cart:', err);
      return false;
    } finally {
      set({ isLoading: false });
    }
  },

  updateQuantity: async (id, quantity) => {
    try {
      await api.put(`/cart/${id}`, { quantity });
      await get().fetchCart();
    } catch (err) {
      console.error('Error updating quantity:', err);
    }
  },

  removeItem: async (id) => {
    try {
      await api.delete(`/cart/${id}`);
      await get().fetchCart();
    } catch (err) {
      console.error('Error removing item:', err);
    }
  },

  applyCoupon: (code: string) => {
    const upper = code.trim().toUpperCase();
    const { subtotal } = get();
    let discount = 0;

    if (upper === 'WELCOME10') {
      if (subtotal < 499) return false;
      discount = Math.min(500, Math.round(subtotal * 0.1));
    } else if (upper === 'PRINTKART20') {
      if (subtotal < 1499) return false;
      discount = Math.min(1000, Math.round(subtotal * 0.2));
    } else if (upper === 'BULK50') {
      if (subtotal < 2999) return false;
      discount = 500;
    } else {
      return false;
    }

    const discountedSubtotal = Math.max(0, subtotal - discount);
    const shippingFee = discountedSubtotal >= 999 ? 0 : 99;
    const tax = Math.round(discountedSubtotal * 0.18 * 100) / 100;
    const totalAmount = Math.round((discountedSubtotal + shippingFee + tax) * 100) / 100;

    set({
      couponCode: upper,
      discount,
      shippingFee,
      tax,
      totalAmount,
    });
    return true;
  },

  removeCoupon: () => {
    const { subtotal, items } = get();
    const shippingFee = subtotal >= 999 || items.length === 0 ? 0 : 99;
    const tax = Math.round(subtotal * 0.18 * 100) / 100;
    const totalAmount = Math.round((subtotal + shippingFee + tax) * 100) / 100;

    set({
      couponCode: '',
      discount: 0,
      shippingFee,
      tax,
      totalAmount,
    });
  },

  clearCart: async () => {
    try {
      await api.delete('/cart');
      set({
        items: [],
        subtotal: 0,
        totalCount: 0,
        discount: 0,
        tax: 0,
        shippingFee: 0,
        totalAmount: 0,
        couponCode: '',
      });
    } catch (err) {
      console.error('Error clearing cart:', err);
    }
  },
}));
