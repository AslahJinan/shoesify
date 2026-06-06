"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Product } from "@/data/products";

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
  // Initialize with the mock default items from the cart.html mockup
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      id: "aerostride-pro",
      name: "AeroStride Pro",
      price: 185,
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCWiQk0myFQHTvu3QfEfhcrAmnBL3RWotidSHO-VPyjtmdU4yIZl_NbczouyFyjhGUQHsfp98ot0fpPiQEnn-x_maZHol6tnjs11QulioXErfp1ND5QFmXBuD-3Czfy97LLuXvXSlTq3BfBfDlrKr_uMSsSxLGIpOLZX46YoMrM_jCldKL08nBQSsPoDON2kvp6Db7b5NZxSAathNUqYAT9qC79_z0rC49ItMIa7m041z6ULe0DsFqYbotcz3P8t3DWssz28KLxZUMM",
      category: "Kids",
      size: "US 10.5",
      quantity: 1,
    },
    {
      id: "cloudwalker-elite",
      name: "CloudWalker Elite",
      price: 120,
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBb-IeIcu1mFtN-YamYSnbidDSlS47rLK6ASPABYoZje3OZ4qrswiSw0UOnN-Z6X9VEeIGJyjU_BCY57ft0yvPFk0e6tQTO5RTYt-yIDZH6kmdPsOmTJ8KnWj-6pS8i2TBohZH9Sfw-K5gCSnfVpwfPDWND_DqBep3fuIcgLObT9N4vtPQ7PLRmDzfC1jdgpFlpW8kXRVy5F8qUCE2upY2p-WSCRHgLsQ536NZjD5AP5e5SfAwzkaHF6wOUfmlvS5_AyzenUme3UuX3",
      category: "Kids",
      size: "US 9.0",
      quantity: 1,
    },
  ]);

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
