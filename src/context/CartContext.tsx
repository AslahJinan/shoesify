"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
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

  // Load cart on auth state changes
  useEffect(() => {
    if (authLoading) return;

    setIsLoaded(false); // Disable saving while loading the new user's cart state

    const loadCart = async () => {
      if (user) {
        try {
          const docRef = doc(db, "carts", user.uid);
          const docSnap = await getDoc(docRef);
          let dbCart: CartItem[] = [];

          if (docSnap.exists()) {
            dbCart = docSnap.data().items || [];
          }

          // Check if there's a guest cart in cookies to merge
          const guestCartStr = getCookie("shoesify_cart");
          if (guestCartStr) {
            const guestCart: CartItem[] = JSON.parse(guestCartStr);
            if (guestCart.length > 0) {
              // Merge guestCart and dbCart
              const mergedCart = [...dbCart];
              guestCart.forEach((guestItem) => {
                const existingIndex = mergedCart.findIndex(
                  (item) => item.id === guestItem.id && item.size === guestItem.size
                );
                if (existingIndex > -1) {
                  mergedCart[existingIndex].quantity += guestItem.quantity;
                } else {
                  mergedCart.push(guestItem);
                }
              });

              // Save merged cart back to Firestore
              await setDoc(docRef, { items: mergedCart }, { merge: true });
              setCartItems(mergedCart);
            } else {
              setCartItems(dbCart);
            }
            // Clear guest cart from cookies
            deleteCookie("shoesify_cart");
          } else {
            setCartItems(dbCart);
          }
        } catch (err) {
          console.error("Error loading cart from Firestore:", err);
        } finally {
          setIsLoaded(true);
        }
      } else {
        // Guest user - load from cookies
        try {
          const guestCartStr = getCookie("shoesify_cart");
          if (guestCartStr) {
            setCartItems(JSON.parse(guestCartStr));
          } else {
            setCartItems([]);
          }
        } catch (err) {
          console.error("Error loading cart from cookies:", err);
        } finally {
          setIsLoaded(true);
        }
      }
    };

    loadCart();
  }, [user, authLoading]);

  // Persist cart updates to Firestore (if logged in) or localStorage (if guest)
  useEffect(() => {
    if (!isLoaded || authLoading) return;

    const syncCart = async () => {
      if (user) {
        try {
          const docRef = doc(db, "carts", user.uid);
          await setDoc(docRef, { items: cartItems }, { merge: true });
        } catch (err) {
          console.error("Error saving cart to Firestore:", err);
        }
      } else {
        try {
          setCookie("shoesify_cart", JSON.stringify(cartItems));
        } catch (err) {
          console.error("Error saving cart to cookies:", err);
        }
      }
    };

    // Debounce/run sync
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
