"use client";

import React, { createContext, useContext, useState, useEffect, useRef } from "react";
import { User } from "firebase/auth";
import { Product } from "@/data/products";
import { db } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { getCookie, setCookie, deleteCookie } from "@/lib/cookies";

export interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  size: string;
  quantity: number;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: Product, size: string, quantity?: number) => void;
  removeFromCart: (id: string, size: string) => void;
  updateQuantity: (id: string, size: string, quantity: number) => void;
  clearCart: () => void;
  cartCount: number;
  cartSubtotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { user, loading: authLoading } = useAuth();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load initial cart from cookies on mount (runs once on client side to avoid hydration mismatch)
  useEffect(() => {
    try {
      const guestCartStr = getCookie("shoesify_cart");
      if (guestCartStr) {
        setCartItems(JSON.parse(guestCartStr));
      }
    } catch (err) {
      console.error("Error loading cart from cookies on mount:", err);
    }
  }, []);

  // Sync with Firestore if logged in
  useEffect(() => {
    if (authLoading) return;

    const syncWithDb = async () => {
      if (user) {
        try {
          const docRef = doc(db, "carts", user.uid);
          const docSnap = await getDoc(docRef);
          let dbCart: CartItem[] = [];

          if (docSnap.exists()) {
            dbCart = docSnap.data().items || [];
          }

          // Merge Firestore cart with current state cart (loaded from cookies)
          setCartItems((prevItems) => {
            const merged = [...dbCart];
            prevItems.forEach((localItem) => {
              const existingIndex = merged.findIndex(
                (item) => item.id === localItem.id && item.size === localItem.size
              );
              if (existingIndex > -1) {
                // Take the max quantity to avoid duplicating counts
                merged[existingIndex].quantity = Math.max(merged[existingIndex].quantity, localItem.quantity);
              } else {
                merged.push(localItem);
              }
            });

            // Write merged cart back to Firestore and cookies
            setDoc(docRef, { items: merged }, { merge: true });
            setCookie("shoesify_cart", JSON.stringify(merged));
            return merged;
          });
        } catch (err) {
          console.error("Error syncing cart with Firestore:", err);
        } finally {
          setIsLoaded(true);
        }
      } else {
        setIsLoaded(true);
      }
    };

    syncWithDb();
  }, [user, authLoading]);

  // Persist cart updates to cookies (always) and Firestore (if logged in)
  useEffect(() => {
    if (!isLoaded || authLoading) return;

    const syncCart = async () => {
      // Save to cookies
      try {
        setCookie("shoesify_cart", JSON.stringify(cartItems));
      } catch (err) {
        console.error("Error saving cart to cookies:", err);
      }

      // Save to Firestore if logged in
      if (user) {
        try {
          const docRef = doc(db, "carts", user.uid);
          await setDoc(docRef, { items: cartItems }, { merge: true });
        } catch (err) {
          console.error("Error saving cart to Firestore:", err);
        }
      }
    };

    syncCart();
  }, [cartItems, isLoaded, user, authLoading]);

  const addToCart = (product: Product, size: string, quantity = 1) => {
    setCartItems((prevItems) => {
      const existingItemIndex = prevItems.findIndex(
        (item) => item.id === product.id && item.size === size
      );

      if (existingItemIndex > -1) {
        const newItems = [...prevItems];
        newItems[existingItemIndex].quantity += quantity;
        return newItems;
      }

      return [
        ...prevItems,
        {
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
          category: product.category,
          size,
          quantity,
        },
      ];
    });
  };

  const removeFromCart = (id: string, size: string) => {
    setCartItems((prevItems) =>
      prevItems.filter((item) => !(item.id === id && item.size === size))
    );
  };

  const updateQuantity = (id: string, size: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id, size);
      return;
    }
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id && item.size === size ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const cartSubtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartCount,
        cartSubtotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
