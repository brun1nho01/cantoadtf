import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { MeshMaterial, CollarType, ArtworkSize } from './useSimulatorStore';

export interface CartItem {
  id: string; // Unique ID per cart entry
  shirtColor: string;
  material: MeshMaterial;
  collar: CollarType;
  frontArtworkId: string | null;
  backArtworkId: string | null;
  artworkSize: ArtworkSize;
  quantity: number;
  price: number;
}

interface CartState {
  items: CartItem[];
  isOpen: boolean; // Controls the Drawer visibility
  addItem: (item: Omit<CartItem, 'id'>) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  toggleDrawer: (open?: boolean) => void;
  getTotalPrice: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      addItem: (itemData) => set((state) => {
        // Generate a random ID for the cart item
        const id = Math.random().toString(36).substring(2, 9);
        return {
          items: [...state.items, { ...itemData, id }],
          isOpen: true, // Automatically open the drawer when adding an item
        };
      }),

      removeItem: (id) => set((state) => ({
        items: state.items.filter((item) => item.id !== id),
      })),

      updateQuantity: (id, quantity) => set((state) => ({
        items: state.items.map((item) =>
          item.id === id ? { ...item, quantity: Math.max(1, quantity) } : item
        ),
      })),

      clearCart: () => set({ items: [] }),

      toggleDrawer: (open) => set((state) => ({
        isOpen: open !== undefined ? open : !state.isOpen,
      })),

      getTotalPrice: () => {
        return get().items.reduce((total, item) => total + (item.price * item.quantity), 0);
      },
    }),
    {
      name: 'cantoa-cart-storage', // name of the item in the storage (must be unique)
      partialize: (state) => ({ items: state.items }), // Only persist items, not UI state like isOpen
    }
  )
);
