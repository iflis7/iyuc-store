import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import {
  createCart,
  getCart,
  addToCart as apiAddToCart,
  updateCartItem as apiUpdateCartItem,
  removeCartItem as apiRemoveCartItem,
  getRegionByCountry,
  type Cart,
  type Region,
} from "@/lib/medusa";

type CartContextType = {
  cart: Cart | null;
  region: Region | null;
  isLoading: boolean;
  isCartOpen: boolean;
  itemCount: number;
  openCart: () => void;
  closeCart: () => void;
  addItem: (variantId: string, quantity?: number) => Promise<void>;
  updateItem: (lineItemId: string, quantity: number) => Promise<void>;
  removeItem: (lineItemId: string) => Promise<void>;
  /** Refresh cart from API (e.g. after adding shipping method) */
  refreshCart: () => Promise<void>;
  /** Clear cart (e.g. after order placed) and create a new one */
  clearAndReinitCart: () => Promise<void>;
};

const CartContext = createContext<CartContextType | null>(null);

const CART_ID_KEY = "medusa_cart_id";
const DEFAULT_COUNTRY = "ca";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<Cart | null>(null);
  const [region, setRegion] = useState<Region | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const initCart = useCallback(async () => {
    try {
      const reg = await getRegionByCountry(DEFAULT_COUNTRY);
      setRegion(reg);

      const existingId = localStorage.getItem(CART_ID_KEY);
      if (existingId) {
        try {
          const existingCart = await getCart(existingId);
          setCart(existingCart);
          return;
        } catch {
          localStorage.removeItem(CART_ID_KEY);
        }
      }

      if (reg) {
        const newCart = await createCart(reg.id);
        localStorage.setItem(CART_ID_KEY, newCart.id);
        setCart(newCart);
      }
    } catch (err) {
      console.error("Failed to initialize cart:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    initCart();
  }, [initCart]);

  const addItem = useCallback(
    async (variantId: string, quantity = 1) => {
      if (!cart) return;
      setIsLoading(true);
      try {
        const updated = await apiAddToCart(cart.id, variantId, quantity);
        setCart(updated);
        setIsCartOpen(true);
      } catch (err) {
        console.error("Failed to add item:", err);
      } finally {
        setIsLoading(false);
      }
    },
    [cart]
  );

  const updateItem = useCallback(
    async (lineItemId: string, quantity: number) => {
      if (!cart) return;
      setIsLoading(true);
      try {
        const updated = await apiUpdateCartItem(cart.id, lineItemId, quantity);
        setCart(updated);
      } catch (err) {
        console.error("Failed to update item:", err);
      } finally {
        setIsLoading(false);
      }
    },
    [cart]
  );

  const removeItem = useCallback(
    async (lineItemId: string) => {
      if (!cart) return;
      setIsLoading(true);
      try {
        const updated = await apiRemoveCartItem(cart.id, lineItemId);
        setCart(updated);
      } catch (err) {
        console.error("Failed to remove item:", err);
      } finally {
        setIsLoading(false);
      }
    },
    [cart]
  );

  const refreshCart = useCallback(async () => {
    const id = localStorage.getItem(CART_ID_KEY);
    if (!id) return;
    try {
      const updated = await getCart(id);
      setCart(updated);
    } catch (err) {
      console.error("Failed to refresh cart:", err);
    }
  }, []);

  const clearAndReinitCart = useCallback(async () => {
    localStorage.removeItem(CART_ID_KEY);
    setCart(null);
    setIsLoading(true);
    await initCart();
  }, [initCart]);

  const itemCount = cart?.items?.reduce((acc, item) => acc + item.quantity, 0) || 0;

  return (
    <CartContext.Provider
      value={{
        cart,
        region,
        isLoading,
        isCartOpen,
        itemCount,
        openCart: () => setIsCartOpen(true),
        closeCart: () => setIsCartOpen(false),
        addItem,
        updateItem,
        removeItem,
        refreshCart,
        clearAndReinitCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
