import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import {
  DELIVERY,
  FREE_SHIPPING_AT,
  PROMO_CODES,
  firstImage,
  getProduct,
} from "./data";

export interface User {
  name: string;
  email: string;
  since: number;
}
export interface Prefs {
  shopFor: "men" | "women" | "both" | null;
  topSize: string | null;
  slideSize: string | null;
}
export interface CartItem {
  key: string;
  productId: string;
  color: string;
  size: string;
  qty: number;
}
export interface Address {
  id: string;
  label: string;
  fullName: string;
  phone: string;
  street: string;
  city: string;
  state: string;
}
export interface OrderLine {
  productId: string;
  name: string;
  image?: string;
  color: string;
  size: string;
  qty: number;
  price: number;
}
export interface Order {
  id: string;
  createdAt: string;
  lines: OrderLine[];
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
  address: Address;
  delivery: string;
  payment: string;
  fixedStage?: number; // seeded orders keep a fixed stage, new ones advance with time
}

const lineKey = (productId: string, color: string, size: string) =>
  `${productId}|${color}|${size}`;

interface State {
  user: User | null;
  prefs: Prefs;
  onboarded: boolean;
  cart: CartItem[];
  wishlist: string[];
  orders: Order[];
  addresses: Address[];
  recent: string[];
  promo: string | null;
  notifications: boolean;
  hydrated: boolean;

  signIn: (name: string, email: string) => void;
  signOut: () => void;
  setPrefs: (p: Partial<Prefs>) => void;
  setOnboarded: (v: boolean) => void;
  addToCart: (
    productId: string,
    color: string,
    size: string,
    qty: number,
  ) => void;
  setQty: (key: string, qty: number) => void;
  removeItem: (key: string) => void;
  toggleWish: (id: string) => void;
  applyPromo: (code: string) => boolean;
  clearPromo: () => void;
  addAddress: (a: Omit<Address, "id">) => Address;
  removeAddress: (id: string) => void;
  placeOrder: (args: {
    address: Address;
    delivery: string;
    payment: string;
  }) => Order | null;
  addRecent: (q: string) => void;
  clearRecent: () => void;
  setNotifications: (v: boolean) => void;
}

const seedAddress: Address = {
  id: "addr-seed",
  label: "Home",
  fullName: "Oladimeji Abdulrazaq",
  phone: "08012345678",
  street: "Gwarimpa Estate, 1st Avenue",
  city: "Abuja",
  state: "FCT",
};

const seedOrder: Order = {
  id: "ZR-48213",
  createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 21).toISOString(),
  lines: [
    {
      productId: "zipp-mens-classic-slides",
      name: "Zipp ZR Men's Classic Slides",
      image: firstImage(getProduct("zipp-mens-classic-slides")!),
      color: "Black",
      size: "43",
      qty: 1,
      price: 23750,
    },
  ],
  subtotal: 23750,
  shipping: 3500,
  discount: 0,
  total: 27250,
  address: seedAddress,
  delivery: "Standard delivery",
  payment: "Card",
  fixedStage: 3,
};

export const useStore = create<State>()(
  persist(
    (set, get) => ({
      user: null,
      prefs: { shopFor: null, topSize: null, slideSize: null },
      onboarded: false,
      cart: [],
      wishlist: [],
      orders: [seedOrder],
      addresses: [seedAddress],
      recent: [],
      promo: null,
      notifications: true,
      hydrated: false,

      signIn: (name, email) =>
        set((s) => ({
          user: {
            name,
            email,
            since: s.user?.since ?? new Date().getFullYear(),
          },
          addresses: s.addresses.map((a) =>
            a.id === "addr-seed" ? { ...a, fullName: name } : a,
          ),
        })),
      signOut: () =>
        set({ user: null, onboarded: false, cart: [], promo: null }),
      setPrefs: (p) => set((s) => ({ prefs: { ...s.prefs, ...p } })),
      setOnboarded: (v) => set({ onboarded: v }),

      addToCart: (productId, color, size, qty) =>
        set((s) => {
          const key = lineKey(productId, color, size);
          const existing = s.cart.find((c) => c.key === key);
          if (existing) {
            return {
              cart: s.cart.map((c) =>
                c.key === key ? { ...c, qty: Math.min(10, c.qty + qty) } : c,
              ),
            };
          }
          return { cart: [...s.cart, { key, productId, color, size, qty }] };
        }),
      setQty: (key, qty) =>
        set((s) => ({
          cart:
            qty <= 0
              ? s.cart.filter((c) => c.key !== key)
              : s.cart.map((c) =>
                  c.key === key ? { ...c, qty: Math.min(10, qty) } : c,
                ),
        })),
      removeItem: (key) =>
        set((s) => ({ cart: s.cart.filter((c) => c.key !== key) })),
      toggleWish: (id) =>
        set((s) => ({
          wishlist: s.wishlist.includes(id)
            ? s.wishlist.filter((w) => w !== id)
            : [id, ...s.wishlist],
        })),

      applyPromo: (code) => {
        const c = code.trim().toUpperCase();
        if (PROMO_CODES[c]) {
          set({ promo: c });
          return true;
        }
        return false;
      },
      clearPromo: () => set({ promo: null }),

      addAddress: (a) => {
        const created = { ...a, id: `addr-${Date.now()}` };
        set((s) => ({ addresses: [created, ...s.addresses] }));
        return created;
      },
      removeAddress: (id) =>
        set((s) => ({ addresses: s.addresses.filter((a) => a.id !== id) })),

      placeOrder: ({ address, delivery, payment }) => {
        const s = get();
        if (!s.cart.length) return null;
        const lines: OrderLine[] = s.cart.map((c) => {
          const p = getProduct(c.productId)!;
          const v =
            p.variants.find((x) => x.color === c.color) ?? p.variants[0];
          return {
            productId: p.id,
            name: p.name,
            image: v.image ?? firstImage(p),
            color: c.color,
            size: c.size,
            qty: c.qty,
            price: p.price,
          };
        });
        const t = computeTotals(s.cart, s.promo, delivery);
        const order: Order = {
          id: `ZR-${Math.floor(10000 + Math.random() * 89999)}`,
          createdAt: new Date().toISOString(),
          lines,
          subtotal: t.subtotal,
          shipping: t.shipping,
          discount: t.discount,
          total: t.total,
          address,
          delivery:
            DELIVERY.find((d) => d.id === delivery)?.label ??
            "Standard delivery",
          payment,
        };
        set({ orders: [order, ...s.orders], cart: [], promo: null });
        return order;
      },

      addRecent: (q) =>
        set((s) => {
          const t = q.trim();
          if (!t) return {};
          return {
            recent: [
              t,
              ...s.recent.filter((r) => r.toLowerCase() !== t.toLowerCase()),
            ].slice(0, 8),
          };
        }),
      clearRecent: () => set({ recent: [] }),
      setNotifications: (v) => set({ notifications: v }),
    }),
    {
      name: "zipp-republic-store-v1",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (s) => ({
        user: s.user,
        prefs: s.prefs,
        onboarded: s.onboarded,
        cart: s.cart,
        wishlist: s.wishlist,
        orders: s.orders,
        addresses: s.addresses,
        recent: s.recent,
        promo: s.promo,
        notifications: s.notifications,
      }),
      onRehydrateStorage: () => () => {
        useStore.setState({ hydrated: true });
      },
    },
  ),
);

export function computeTotals(
  cart: CartItem[],
  promo: string | null,
  deliveryId = "standard",
) {
  const subtotal = cart.reduce(
    (sum, c) => sum + (getProduct(c.productId)?.price ?? 0) * c.qty,
    0,
  );
  const discount = promo ? Math.round(subtotal * (PROMO_CODES[promo] ?? 0)) : 0;
  const base = DELIVERY.find((d) => d.id === deliveryId)?.price ?? 0;
  const freeShip =
    deliveryId === "standard" && subtotal - discount >= FREE_SHIPPING_AT;
  const shipping = subtotal === 0 ? 0 : freeShip ? 0 : base;
  return {
    subtotal,
    discount,
    shipping,
    total: subtotal - discount + shipping,
    freeShip,
  };
}

export const useCartCount = () =>
  useStore((s) => s.cart.reduce((n, c) => n + c.qty, 0));

export const ORDER_STAGES = ["Confirmed", "Packed", "Shipped", "Delivered"];
export const orderStage = (o: Order, now = Date.now()) => {
  if (o.fixedStage !== undefined) return o.fixedStage;
  const secs = (now - new Date(o.createdAt).getTime()) / 1000;
  return secs < 20 ? 0 : secs < 50 ? 1 : secs < 90 ? 2 : 3;
};
