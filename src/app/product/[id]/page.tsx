"use client";

import React, { useState, use } from "react";
import { products } from "@/data/products";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

const AVAILABLE_SIZES = ["US 8.0", "US 8.5", "US 9.0", "US 9.5", "US 10.0", "US 10.5", "US 11.0"];

export default function ProductDetailPage({ params }: ProductPageProps) {
  const resolvedParams = use(params);
  const product = products.find((p) => p.id === resolvedParams.id);

  if (!product) {
    notFound();
  }

  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const [selectedSize, setSelectedSize] = useState("US 10.0");
  const [added, setAdded] = useState(false);

  const handleAddToCart = () => {
    addToCart(product, selectedSize, 1);
    setAdded(true);
    setTimeout(() => {
      setAdded(false);
    }, 2000);
  };

  // Calculate average rating
  const averageRating = product.reviews.length > 0
    ? (product.reviews.reduce((sum, r) => sum + r.rating, 0) / product.reviews.length).toFixed(1)
    : "5.0";

  return (
    <main className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-12 md:py-24">
      {/* Breadcrumb Back Button */}
      <div className="mb-8">
        <Link href="/" className="inline-flex items-center gap-2 text-on-surface hover:text-primary transition-colors font-label-lg">
          <span className="material-symbols-outlined text-sm">arrow_back</span>
          Back to collection
        </Link>
      </div>

      {/* Main Product Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
        {/* Product Image */}
        <div className="bg-surface-container-low rounded-xl p-base md:p-gutter luxury-shadow overflow-hidden group flex justify-center items-center relative aspect-[4/3] md:aspect-auto">
          <Image
            src={product.image}
            alt={product.name}
            width={600}
            height={500}
            className="w-full h-auto object-contain transform transition-transform duration-700 group-hover:scale-105 mix-blend-multiply"
            priority
          />
        </div>

        {/* Product Info */}
        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-2">
            {product.badge && (
              <span className="bg-primary text-on-primary font-label-sm text-label-sm px-3 py-1 rounded-full w-fit uppercase font-bold tracking-wider">
                {product.badge}
              </span>
            )}
            <h1 className="font-display-lg text-display-lg-mobile md:font-headline-lg md:text-headline-lg text-on-background">
              {product.name}
            </h1>
            <p className="font-headline-md text-headline-md text-primary">${product.price.toFixed(2)}</p>
          </div>

          <div className="flex flex-col gap-4 border-b border-surface-variant pb-8">
            <p className="font-body-lg text-body-lg text-on-surface opacity-80 leading-relaxed">
              {product.description}
            </p>

            {/* Quick Specs Chips */}
            <div className="flex flex-wrap gap-3 mt-2">
              <div className="flex items-center gap-2 bg-secondary-container px-4 py-2 rounded-lg text-on-secondary-container">
                <span className="material-symbols-outlined text-sm">line_weight</span>
                <span className="font-label-sm text-label-sm">{product.specs.Weight || "Lightweight"}</span>
              </div>
              <div className="flex items-center gap-2 bg-secondary-container px-4 py-2 rounded-lg text-on-secondary-container">
                <span className="material-symbols-outlined text-sm">bolt</span>
                <span className="font-label-sm text-label-sm">Energy Return</span>
              </div>
            </div>
          </div>

          {/* Size Selection */}
          <div className="flex flex-col gap-3">
            <span className="font-label-lg text-secondary uppercase tracking-widest">Select Size</span>
            <div className="flex flex-wrap gap-2">
              {AVAILABLE_SIZES.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`px-4 py-2 text-label-sm border transition-all ${
                    selectedSize === size
                      ? "border-primary bg-primary text-white"
                      : "border-outline-variant hover:border-on-background text-on-surface"
                  }`}
                >
                  {size.replace("US ", "")}
                </button>
              ))}
            </div>
          </div>

          {/* CTA Actions */}
          <div className="flex flex-col sm:flex-row gap-4 mt-2">
            <button
              onClick={handleAddToCart}
              className={`flex-grow sm:flex-1 font-label-lg text-label-lg py-5 px-8 rounded-lg transition-all duration-300 active:scale-95 flex items-center justify-center gap-2 uppercase tracking-widest shadow-lg cursor-pointer ${
                added
                  ? "bg-green-600 text-white shadow-green-600/20"
                  : "bg-primary-container hover:bg-primary text-on-primary-container shadow-primary-container/20"
              }`}
            >
              <span className="material-symbols-outlined">
                {added ? "check_circle" : "shopping_bag"}
              </span>
              {added ? "Added" : "Add to Cart"}
            </button>
            <Link
              href="/cart"
              onClick={() => {
                if (!added) {
                  addToCart(product, selectedSize, 1);
                }
              }}
              className="flex-grow sm:flex-1 bg-on-background hover:bg-on-background/90 text-on-primary font-label-lg text-label-lg py-5 px-8 rounded-lg transition-all duration-300 active:scale-95 flex items-center justify-center gap-2 uppercase tracking-widest text-center"
            >
              Buy Now
            </Link>
            
            {/* Wishlist Toggle */}
            <button
              onClick={() => toggleWishlist(product.id)}
              className={`p-5 rounded-lg border transition-all duration-300 active:scale-90 flex items-center justify-center cursor-pointer group ${
                isInWishlist(product.id)
                  ? "border-primary text-primary bg-primary/5 shadow-md shadow-primary/5"
                  : "border-outline-variant hover:border-primary text-secondary hover:text-primary"
              }`}
              aria-label={isInWishlist(product.id) ? "Remove from wishlist" : "Add to wishlist"}
            >
              <span 
                className="material-symbols-outlined transition-transform duration-300 group-hover:scale-110"
                style={{ fontVariationSettings: `'FILL' ${isInWishlist(product.id) ? 1 : 0}` }}
              >
                favorite
              </span>
            </button>
          </div>

          {/* Subtle Trust Signals */}
          <div className="grid grid-cols-2 gap-4 mt-2 border-t border-surface-variant/30 pt-6">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-xl">verified</span>
              <span className="text-label-sm opacity-70">Authentic Guarantee</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-xl">local_shipping</span>
              <span className="text-label-sm opacity-70">Express Shipping</span>
            </div>
          </div>
        </div>
      </div>

      {/* Details & Reviews Sections */}
      <div className="mt-24 grid grid-cols-1 md:grid-cols-12 gap-16">
        {/* Specifications */}
        <section className="md:col-span-5 flex flex-col gap-8">
          <h4 className="font-headline-md text-headline-md border-l-4 border-primary pl-4">
            Specifications
          </h4>
          <div className="flex flex-col divide-y divide-surface-variant">
            {Object.entries(product.specs).map(([key, val]) => (
              <div key={key} className="py-4 flex justify-between items-center">
                <span className="font-label-lg text-on-secondary-fixed-variant">{key}</span>
                <span className="font-body-md text-on-background font-semibold">{val}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Reviews */}
        <section className="md:col-span-7 flex flex-col gap-8">
          <div className="flex justify-between items-end">
            <h4 className="font-headline-md text-headline-md border-l-4 border-primary pl-4">
              User Reviews
            </h4>
            <div className="flex items-center gap-1 text-primary">
              {Array.from({ length: 5 }).map((_, index) => {
                const isFull = index < Math.floor(parseFloat(averageRating));
                const isHalf = !isFull && index < Math.ceil(parseFloat(averageRating));
                return (
                  <span
                    key={index}
                    className="material-symbols-outlined"
                    style={{ fontVariationSettings: `'FILL' ${isFull ? 1 : 0}` }}
                  >
                    {isFull ? "star" : isHalf ? "star_half" : "star"}
                  </span>
                );
              })}
              <span className="font-label-lg ml-2 text-on-background">
                {averageRating} ({product.reviews.length})
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-6">
            {product.reviews.length > 0 ? (
              product.reviews.map((review, i) => (
                <div
                  key={i}
                  className="bg-surface-container-lowest luxury-shadow p-6 rounded-xl border border-surface-variant/30"
                >
                  <div className="flex justify-between mb-3">
                    <span className="font-label-lg text-on-background">{review.author}</span>
                    <span className="text-label-sm text-on-secondary-fixed-variant">
                      {review.time}
                    </span>
                  </div>
                  <div className="flex text-primary mb-3">
                    {Array.from({ length: 5 }).map((_, starIndex) => (
                      <span
                        key={starIndex}
                        className="material-symbols-outlined text-sm"
                        style={{
                          fontVariationSettings: `'FILL' ${
                            starIndex < review.rating ? 1 : 0
                          }`,
                        }}
                      >
                        star
                      </span>
                    ))}
                  </div>
                  <p className="font-body-md text-on-surface opacity-80 italic">
                    &quot;{review.text}&quot;
                  </p>
                </div>
              ))
            ) : (
              <p className="text-secondary italic font-body-md">No reviews yet for this product.</p>
            )}
          </div>
          {product.reviews.length > 0 && (
            <button className="w-full py-4 border border-outline hover:bg-surface-variant transition-colors rounded-lg font-label-lg text-on-surface cursor-pointer">
              View All {product.reviews.length} Reviews
            </button>
          )}
        </section>
      </div>
    </main>
  );
}
