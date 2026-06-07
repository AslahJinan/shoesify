"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";
import { doc, getDoc, setDoc } from "firebase/firestore";

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

  // Load wishlist on auth state changes
  useEffect(() => {
    if (authLoading) return;

    setIsLoaded(false); // Disable saving while loading the new user's wishlist

    const loadWishlist = async () => {
      if (user) {
        try {
          const docRef = doc(db, "wishlists", user.uid);
          const docSnap = await getDoc(docRef);
          let dbWishlist: string[] = [];

          if (docSnap.exists()) {
            dbWishlist = docSnap.data().items || [];
          }

          // Check if there's a guest wishlist in localStorage to merge
          const guestWishlistStr = localStorage.getItem("shoesify_wishlist");
          if (guestWishlistStr) {
            const guestWishlist: string[] = JSON.parse(guestWishlistStr);
            if (guestWishlist.length > 0) {
              // Merge guestWishlist and dbWishlist (unique elements)
              const mergedSet = new Set([...dbWishlist, ...guestWishlist]);
              const mergedWishlist = Array.from(mergedSet);

              // Save merged wishlist back to Firestore
              await setDoc(docRef, { items: mergedWishlist }, { merge: true });
              setWishlistItems(mergedWishlist);
            } else {
              setWishlistItems(dbWishlist);
            }
            // Clear guest wishlist from localStorage
            localStorage.removeItem("shoesify_wishlist");
          } else {
            setWishlistItems(dbWishlist);
          }
        } catch (err) {
          console.error("Error loading wishlist from Firestore:", err);
        } finally {
          setIsLoaded(true);
        }
      } else {
        // Guest user - load from localStorage
        try {
          const guestWishlistStr = localStorage.getItem("shoesify_wishlist");
          if (guestWishlistStr) {
            setWishlistItems(JSON.parse(guestWishlistStr));
          } else {
            setWishlistItems([]);
          }
        } catch (err) {
          console.error("Error loading wishlist from localStorage:", err);
        } finally {
          setIsLoaded(true);
        }
      }
    };

    loadWishlist();
  }, [user, authLoading]);

  // Persist wishlist updates to Firestore (if logged in) or localStorage (if guest)
  useEffect(() => {
    if (!isLoaded || authLoading) return;

    const syncWishlist = async () => {
      if (user) {
        try {
          const docRef = doc(db, "wishlists", user.uid);
          await setDoc(docRef, { items: wishlistItems }, { merge: true });
        } catch (err) {
          console.error("Error saving wishlist to Firestore:", err);
        }
      } else {
        try {
          localStorage.setItem("shoesify_wishlist", JSON.stringify(wishlistItems));
        } catch (err) {
          console.error("Error saving wishlist to localStorage:", err);
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
