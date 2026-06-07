"use client";

import React, { createContext, useContext, useState, useEffect, useRef } from "react";
import { User } from "firebase/auth";
import { db } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { getCookie, setCookie, deleteCookie } from "@/lib/cookies";

interface WishlistContextType {
  wishlistItems: string[];
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  clearWishlist: () => void;
  wishlistCount: number;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const { user, loading: authLoading } = useAuth();
  const [wishlistItems, setWishlistItems] = useState<string[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load initial wishlist from cookies on mount (runs once on client side to avoid hydration mismatch)
  useEffect(() => {
    try {
      const guestWishlistStr = getCookie("shoesify_wishlist");
      if (guestWishlistStr) {
        setWishlistItems(JSON.parse(guestWishlistStr));
      }
    } catch (err) {
      console.error("Error loading wishlist from cookies on mount:", err);
    }
  }, []);

  // Sync with Firestore if logged in
  useEffect(() => {
    if (authLoading) return;

    const syncWithDb = async () => {
      if (user) {
        try {
          const docRef = doc(db, "wishlists", user.uid);
          const docSnap = await getDoc(docRef);
          let dbWishlist: string[] = [];

          if (docSnap.exists()) {
            dbWishlist = docSnap.data().items || [];
          }

          // Merge Firestore wishlist with current state wishlist (loaded from cookies)
          setWishlistItems((prevItems) => {
            const mergedSet = new Set([...dbWishlist, ...prevItems]);
            const mergedWishlist = Array.from(mergedSet);

            // Write merged wishlist back to Firestore and cookies
            setDoc(docRef, { items: mergedWishlist }, { merge: true });
            setCookie("shoesify_wishlist", JSON.stringify(mergedWishlist));
            return mergedWishlist;
          });
        } catch (err) {
          console.error("Error syncing wishlist with Firestore:", err);
        } finally {
          setIsLoaded(true);
        }
      } else {
        setIsLoaded(true);
      }
    };

    syncWithDb();
  }, [user, authLoading]);

  // Persist wishlist updates to cookies (always) and Firestore (if logged in)
  useEffect(() => {
    if (!isLoaded || authLoading) return;

    const syncWishlist = async () => {
      // Save to cookies
      try {
        setCookie("shoesify_wishlist", JSON.stringify(wishlistItems));
      } catch (err) {
        console.error("Error saving wishlist to cookies:", err);
      }

      // Save to Firestore if logged in
      if (user) {
        try {
          const docRef = doc(db, "wishlists", user.uid);
          await setDoc(docRef, { items: wishlistItems }, { merge: true });
        } catch (err) {
          console.error("Error saving wishlist to Firestore:", err);
        }
      }
    };

    syncWishlist();
  }, [wishlistItems, isLoaded, user, authLoading]);

  const toggleWishlist = (productId: string) => {
    setWishlistItems((prev) => {
      if (prev.includes(productId)) {
        return prev.filter((id) => id !== productId);
      } else {
        return [...prev, productId];
      }
    });
  };

  const isInWishlist = (productId: string) => {
    return wishlistItems.includes(productId);
  };

  const clearWishlist = () => {
    setWishlistItems([]);
  };

  const wishlistCount = wishlistItems.length;

  return (
    <WishlistContext.Provider
      value={{
        wishlistItems,
        toggleWishlist,
        isInWishlist,
        clearWishlist,
        wishlistCount,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
}
