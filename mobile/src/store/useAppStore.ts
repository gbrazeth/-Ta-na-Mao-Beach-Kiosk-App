import { create } from 'zustand';

export interface Order {
    orderId: string;
    items: Record<string, number>;
    total: number;
    timestamp: string;
    status: 'preparing' | 'ready' | 'delivering' | 'completed';
}

interface AppState {
    kioskId: string | null;
    kioskName: string | null;
    tableId: string | null;
    tableNumber: number | null;
    cart: Record<string, number>;
    tabItems: Order[];
    products: any[];
    user: any | null;
    token: string | null;

    // Actions
    setUser: (user: any, token: string) => void;
    logout: () => void;
    setProducts: (products: any[]) => void;
    setKioskAndTable: (kioskId: string, kioskName: string, tableId: string, tableNumber: number) => void;
    updateCartQuantity: (productId: string, quantity: number) => void;
    clearCart: () => void;
    addOrderToTab: (orderId: string, total: number) => void;
    closeTab: () => void;
    updateOrderStatus: (orderId: string, status: Order['status']) => void;
}

export const useAppStore = create<AppState>((set) => ({
    kioskId: null,
    kioskName: null,
    tableId: null,
    tableNumber: null,
    cart: {},
    tabItems: [],
    products: [],
    user: null,
    token: null,

    setUser: (user, token) => set({ user, token }),
    logout: () => set({ user: null, token: null, kioskId: null, kioskName: null, tableId: null, tableNumber: null, cart: {}, tabItems: [] }),
    setProducts: (products) => set({ products }),
    setKioskAndTable: (kioskId, kioskName, tableId, tableNumber) => set({ kioskId, kioskName, tableId, tableNumber }),

    updateCartQuantity: (productId, quantity) => set((state) => {
        const newCart = { ...state.cart };
        if (quantity <= 0) {
            delete newCart[productId];
        } else {
            newCart[productId] = quantity;
        }
        return { cart: newCart };
    }),

    clearCart: () => set({ cart: {} }),

    addOrderToTab: (orderId, total) => set((state) => {
        const newOrder: Order = {
            orderId,
            items: { ...state.cart },
            total,
            timestamp: new Date().toISOString(),
            status: 'preparing'
        };
        return {
            tabItems: [...state.tabItems, newOrder],
            cart: {} // Clear cart after confirming order
        };
    }),

    closeTab: () => set({ tabItems: [], kioskId: null, kioskName: null, tableId: null, tableNumber: null, cart: {} }),

    updateOrderStatus: (orderId, status) => set((state) => ({
        tabItems: state.tabItems.map(order =>
            order.orderId === orderId ? { ...order, status } : order
        )
    }))
}));
