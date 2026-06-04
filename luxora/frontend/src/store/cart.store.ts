// ─── cart.store.ts ────────────────────────────────────────────────────────────
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  image?: string;
  slug: string;
  quantity: number;
}

interface CartStore {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  total: () => number;
  subtotal: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item) =>
        set((state) => {
          const existing = state.items.find(i => i.productId === item.productId);
          if (existing) {
            return {
              items: state.items.map(i =>
                i.productId === item.productId
                  ? { ...i, quantity: i.quantity + (item.quantity ?? 1) }
                  : i
              ),
            };
          }
          return { items: [...state.items, { ...item, quantity: item.quantity ?? 1 }] };
        }),

      removeItem: (productId) =>
        set((state) => ({ items: state.items.filter(i => i.productId !== productId) })),

      updateQuantity: (productId, quantity) =>
        set((state) => ({
          items: quantity <= 0
            ? state.items.filter(i => i.productId !== productId)
            : state.items.map(i => i.productId === productId ? { ...i, quantity } : i),
        })),

      clearCart: () => set({ items: [] }),

      subtotal: () => get().items.reduce((s, i) => s + i.price * i.quantity, 0),

      total: () => {
        const subtotal = get().subtotal();
        const shipping = subtotal >= 2999 ? 0 : 199;
        return subtotal + shipping;
      },
    }),
    { name: 'luxora-cart' }
  )
);
