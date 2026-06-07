"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useWishlist } from "@/context/WishlistContext";
import { useCart } from "@/context/CartContext";
import { products } from "@/data/products";

export default function WishlistPage() {
  const { wishlistItems, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();
  const [addedItems, setAddedItems] = useState<Record<string, boolean>>({});

  const wishlistProducts = products.filter((p) => wishlistItems.includes(p.id));

  const handleAddToCart = (product: typeof products[0]) => {
    // Add to cart with a default size US 10.0
    addToCart(product, "US 10.0", 1);
    
    setAddedItems((prev) => ({ ...prev, [product.id]: true }));
    setTimeout(() => {
      setAddedItems((prev) => ({ ...prev, [product.id]: false }));
    }, 2000);
  };

  if (wishlistProducts.length === 0) {
    return (
      <main className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-20 text-center flex flex-col items-center justify-center min-h-[60vh] animate-fadeIn">
        <span className="material-symbols-outlined text-secondary/30 mb-6 animate-pulse" style={{ fontSize: "72px" }}>
          favorite
        </span>
        <h1 className="font-headline-lg text-on-background mb-4">Your Wishlist is Empty</h1>
        <p className="text-secondary font-body-md mb-8 max-w-md">
          Save your favorite styles here to keep track of them. Find something you love and tap the heart icon!
        </p>
        <Link
          href="/"
          className="bg-primary text-white px-10 py-4 font-bold uppercase tracking-widest hover:bg-primary-container transition-colors active:scale-95 shadow-lg shadow-primary/10"
        >
          Explore Collection
        </Link>
      </main>
    );
  }

  return (
    <main className="max-w-container-max mx-auto w-full px-margin-mobile md:px-margin-desktop py-12 md:py-20 animate-fadeIn">
      <div className="mb-10">
        <h1 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-background mb-2">
          Your Favorites
        </h1>
        <p className="text-on-surface-variant font-body-md text-body-md">
          You have {wishlistProducts.length} {wishlistProducts.length === 1 ? "item" : "items"} saved.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-gutter">
        {wishlistProducts.map((product) => {
          const isAdded = addedItems[product.id];
          return (
            <div
              key={product.id}
              className="group bg-white rounded-xl overflow-hidden shadow-[0px_4px_20px_rgba(0,0,0,0.05)] transition-all duration-500 hover:-translate-y-2 hover:shadow-[0px_20px_40px_rgba(0,0,0,0.1)] flex flex-col justify-between border border-surface-container/30 relative"
            >
              {/* Image Section */}
              <div className="aspect-[4/5] overflow-hidden bg-surface-container relative p-8 flex items-center justify-center">
                <Link href={`/product/${product.id}`} className="w-full h-full flex items-center justify-center">
                  <Image
                    src={product.image}
                    alt={product.name}
                    width={300}
                    height={375}
                    className="w-full h-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-700"
                  />
                </Link>
                {product.badge && (
                  <div className="absolute top-4 left-4">
                    <span className="bg-on-background text-white px-2 py-1 text-[10px] font-bold uppercase tracking-widest rounded-sm">
                      {product.badge}
                    </span>
                  </div>
                )}
                {/* Remove button (heart filled) in top right */}
                <button
                  onClick={() => toggleWishlist(product.id)}
                  className="absolute top-4 right-4 bg-white/80 hover:bg-white text-primary p-2.5 rounded-full shadow-md active:scale-90 transition-all cursor-pointer"
                  aria-label="Remove from Wishlist"
                >
                  <span className="material-symbols-outlined block text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                    favorite
                  </span>
                </button>
              </div>

              {/* Info Section */}
              <div className="p-6 flex-grow flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-headline-md text-headline-md text-on-surface hover:text-primary transition-colors">
                      <Link href={`/product/${product.id}`}>{product.name}</Link>
                    </h3>
                    <span className="font-bold text-primary">${product.price}</span>
                  </div>
                  <p className="text-secondary font-body-md mb-6 line-clamp-2">
                    {product.description}
                  </p>
                </div>

                <div className="flex gap-3 mt-auto">
                  <button
                    onClick={() => handleAddToCart(product)}
                    className={`flex-grow py-3.5 font-bold uppercase tracking-widest text-[12px] rounded-lg transition-all duration-300 active:scale-95 flex items-center justify-center gap-2 cursor-pointer ${
                      isAdded
                        ? "bg-green-600 text-white shadow-green-600/20"
                        : "bg-primary text-white hover:bg-primary-container shadow-primary/20"
                    }`}
                  >
                    <span className="material-symbols-outlined text-base">
                      {isAdded ? "check_circle" : "shopping_cart"}
                    </span>
                    {isAdded ? "Added" : "Add to Cart"}
                  </button>
                  <Link
                    href={`/product/${product.id}`}
                    className="px-4 border border-outline hover:border-on-background rounded-lg flex items-center justify-center text-on-surface hover:text-primary transition-colors duration-200"
                    title="View Product"
                  >
                    <span className="material-symbols-outlined text-base">visibility</span>
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </main>
  );
}
