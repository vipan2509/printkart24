import { create } from 'zustand';
import api from '../services/api';

interface WishlistState {
  productIds: string[];
  items: any[];
  isLoading: boolean;
  fetchWishlist: () => Promise<void>;
  toggleWishlist: (productId: string) => Promise<boolean>;
  isInWishlist: (productId: string) => boolean;
}

export const useWishlistStore = create<WishlistState>((set, get) => ({
  productIds: [],
  items: [],
  isLoading: false,

  fetchWishlist: async () => {
    try {
      set({ isLoading: true });
      const res = await api.get('/wishlist');
      if (res.data.success && Array.isArray(res.data.data)) {
        const items = res.data.data;
        const productIds = items.map((it: any) => it.productId);
        set({ items, productIds });
      }
    } catch {
      // Ignored if unauthenticated
    } finally {
      set({ isLoading: false });
    }
  },

  toggleWishlist: async (productId: string) => {
    try {
      const res = await api.post('/wishlist/toggle', { productId });
      if (res.data.success) {
        await get().fetchWishlist();
        return res.data.added;
      }
      return false;
    } catch {
      // Fallback local toggle for guest users
      const { productIds } = get();
      if (productIds.includes(productId)) {
        set({ productIds: productIds.filter((id) => id !== productId) });
        return false;
      } else {
        set({ productIds: [...productIds, productId] });
        return true;
      }
    }
  },

  isInWishlist: (productId: string) => {
    return get().productIds.includes(productId);
  },
}));
