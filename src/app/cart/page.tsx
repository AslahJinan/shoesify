"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/CartContext";

export default function CartPage() {
  const { cartItems, removeFromCart, updateQuantity, cartCount, cartSubtotal, clearCart } = useCart();
  const [promoCode, setPromoCode] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [checkoutStatus, setCheckoutStatus] = useState<"idle" | "success">("idle");

  const shipping = cartCount > 0 ? (cartSubtotal > 200 ? 0 : 15) : 0;
  const taxRate = 0.0825; // 8.25% tax
  const tax = parseFloat((cartSubtotal * taxRate).toFixed(2));
  const finalTotal = parseFloat((cartSubtotal - discountAmount + shipping + tax).toFixed(2));

  const handleApplyPromo = () => {
    if (promoCode.trim().toUpperCase() === "SHOESIFY30") {
      setDiscountAmount(parseFloat((cartSubtotal * 0.3).toFixed(2)));
      setPromoApplied(true);
    } else {
      alert("Invalid promo code. Try 'SHOESIFY30' for 30% off!");
    }
  };

  const handleCheckout = () => {
    // Construct the WhatsApp message text
    let message = "Hello, I would like to place an order on Shoesify:\n\n";
    cartItems.forEach((item, index) => {
      message += `${index + 1}. *${item.name}* (${item.category})\n`;
      message += `   Size: ${item.size}\n`;
      message += `   Qty: ${item.quantity}\n`;
      message += `   Price: $${item.price.toFixed(2)} each\n`;
      message += `   Subtotal: $${(item.price * item.quantity).toFixed(2)}\n\n`;
    });

    if (discountAmount > 0) {
      message += `Subtotal: $${cartSubtotal.toFixed(2)}\n`;
      message += `Discount: -$${discountAmount.toFixed(2)}\n`;
    }
    message += `Estimated Shipping: ${shipping === 0 ? "FREE" : `$${shipping.toFixed(2)}`}\n`;
    message += `Tax (8.25%): $${tax.toFixed(2)}\n`;
    message += `*Total Amount*: *$${finalTotal.toFixed(2)}*\n`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/919074746340?text=${encodedMessage}`;

    // Open WhatsApp URL in a new tab
    window.open(whatsappUrl, "_blank");

    // Clear the cart
    clearCart();

    // Show confirmation screen
    setCheckoutStatus("success");
  };

  if (checkoutStatus === "success") {
    return (
      <main className="max-w-3xl mx-auto px-margin-mobile md:px-margin-desktop py-20 text-center flex flex-col items-center justify-center min-h-[50vh]">
        <div className="bg-green-100 text-green-700 p-6 rounded-full mb-6">
          <span className="material-symbols-outlined style={{ fontSize: '48px' }}">check_circle</span>
        </div>
        <h1 className="font-display-lg text-display-lg-mobile md:text-headline-lg text-on-background mb-4">
          Order Confirmed!
        </h1>
        <p className="text-secondary font-body-lg mb-8 max-w-md">
          Thank you for your purchase. We are processing your order and will send you updates via email.
        </p>
        <Link
          href="/"
          className="bg-primary text-white px-10 py-4 font-bold uppercase tracking-widest hover:bg-primary-container transition-colors active:scale-95"
        >
          Continue Shopping
        </Link>
      </main>
    );
  }

  if (cartItems.length === 0) {
    return (
      <main className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-20 text-center flex flex-col items-center justify-center min-h-[50vh]">
        <span className="material-symbols-outlined text-secondary/40 mb-6" style={{ fontSize: "64px" }}>
          shopping_bag
        </span>
        <h1 className="font-headline-lg text-on-background mb-4">Your Shopping Bag is Empty</h1>
        <p className="text-secondary font-body-md mb-8">
          Looks like you haven&apos;t added anything to your cart yet. Let&apos;s find the perfect fit!
        </p>
        <Link
          href="/"
          className="bg-primary text-white px-10 py-4 font-bold uppercase tracking-widest hover:bg-primary-container transition-colors active:scale-95"
        >
          Explore Collection
        </Link>
      </main>
    );
  }

  return (
    <main className="max-w-container-max mx-auto w-full px-margin-mobile md:px-margin-desktop py-12 md:py-20">
      <div className="flex flex-col lg:flex-row gap-12 lg:items-start">
        {/* Cart Items Section */}
        <div className="flex-grow">
          <div className="mb-10">
            <h1 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-background mb-2">
              Shopping Bag
            </h1>
            <p className="text-on-surface-variant font-body-md text-body-md">
              You have {cartCount} {cartCount === 1 ? "item" : "items"} in your cart.
            </p>
          </div>

          <div className="space-y-gutter">
            {cartItems.map((item) => (
              <div
                key={`${item.id}-${item.size}`}
                className="bg-surface-container-lowest rounded-xl p-6 shadow-[0px_4px_20px_rgba(0,0,0,0.05)] flex flex-col sm:flex-row gap-6 relative group transition-all hover:shadow-[0px_8px_30px_rgba(0,0,0,0.08)]"
              >
                <Link
                  href={`/product/${item.id}`}
                  className="w-full sm:w-40 h-40 bg-surface-container rounded-lg overflow-hidden flex-shrink-0 block relative"
                >
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-contain p-4 transition-transform hover:scale-105 duration-300 mix-blend-multiply"
                  />
                </Link>

                <div className="flex-grow flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-headline-md text-headline-md text-on-background hover:text-primary transition-colors">
                        <Link href={`/product/${item.id}`}>{item.name}</Link>
                      </h3>
                      <p className="text-on-surface-variant font-body-md text-body-md mt-1">
                        Performance Luxury • {item.category}
                      </p>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.id, item.size)}
                      className="text-on-surface-variant hover:text-error transition-colors cursor-pointer"
                      aria-label="Remove item"
                    >
                      <span className="material-symbols-outlined">delete</span>
                    </button>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-8 items-center">
                    <div>
                      <span className="text-label-sm font-label-sm text-secondary block mb-1">SIZE</span>
                      <span className="font-label-lg text-label-lg text-on-background">{item.size}</span>
                    </div>
                    <div>
                      <span className="text-label-sm font-label-sm text-secondary block mb-1">QUANTITY</span>
                      <div className="flex items-center gap-3 bg-secondary-container rounded-full px-3 py-1 text-on-secondary-container">
                        <button
                          onClick={() => updateQuantity(item.id, item.size, item.quantity - 1)}
                          className="hover:text-primary transition-colors cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-base">remove</span>
                        </button>
                        <span className="font-label-lg text-label-lg">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.size, item.quantity + 1)}
                          className="hover:text-primary transition-colors cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-base">add</span>
                        </button>
                      </div>
                    </div>
                    <div className="ml-auto text-right">
                      <span className="text-label-sm font-label-sm text-secondary block mb-1">SUBTOTAL</span>
                      <span className="font-headline-md text-headline-md text-primary">
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Shipping Info Teaser */}
          <div className="mt-12 p-6 rounded-xl border border-outline-variant flex items-center gap-6 bg-surface-container-low">
            <div className="bg-primary-container text-on-primary-container p-3 rounded-full">
              <span className="material-symbols-outlined">local_shipping</span>
            </div>
            <div>
              <h4 className="font-label-lg text-label-lg text-on-background">
                {cartSubtotal > 200 ? "You've earned Free Shipping!" : "Free Shipping over $200"}
              </h4>
              <p className="text-on-surface-variant font-body-md text-body-md">
                {cartSubtotal > 200
                  ? "Congratulations! Your order qualifies for free express delivery."
                  : `Add $${(200 - cartSubtotal).toFixed(2)} more to unlock free express shipping.`}
              </p>
            </div>
          </div>
        </div>

        {/* Order Summary Sidebar */}
        <aside className="w-full lg:w-[400px] flex-shrink-0">
          <div className="bg-surface-container-lowest rounded-xl p-8 shadow-[0px_10px_30px_rgba(0,0,0,0.08)] sticky top-32">
            <h2 className="font-headline-md text-headline-md text-on-background mb-8">Summary</h2>
            <div className="space-y-4 mb-8">
              <div className="flex justify-between items-center">
                <span className="text-on-surface-variant font-body-md">Subtotal</span>
                <span className="text-on-background font-label-lg">${cartSubtotal.toFixed(2)}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between items-center text-green-600">
                  <span className="font-body-md">Discount (30% Off)</span>
                  <span className="font-label-lg">-${discountAmount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between items-center">
                <span className="text-on-surface-variant font-body-md">Estimated Shipping</span>
                <span className="text-on-background font-label-lg">
                  {shipping === 0 ? "FREE" : `$${shipping.toFixed(2)}`}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-on-surface-variant font-body-md">Tax (8.25%)</span>
                <span className="text-on-background font-label-lg">${tax.toFixed(2)}</span>
              </div>
              <div className="pt-4 border-t border-outline-variant flex justify-between items-center">
                <span className="font-headline-md text-headline-md text-on-background">Total</span>
                <span className="font-headline-md text-headline-md text-on-background">
                  ${finalTotal.toFixed(2)}
                </span>
              </div>
            </div>

            <div className="space-y-4">
              <button
                onClick={handleCheckout}
                className="w-full py-4 bg-primary-container text-on-primary-container rounded-full font-display-lg text-label-lg hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                Proceed to Checkout
                <span className="material-symbols-outlined">arrow_forward</span>
              </button>
              <div className="pt-6">
                <p className="text-label-sm font-label-sm text-secondary mb-4 text-center">WE ACCEPT</p>
                <div className="flex justify-center gap-4 opacity-60 grayscale hover:grayscale-0 transition-all duration-300">
                  <span className="material-symbols-outlined text-2xl">credit_card</span>
                  <span className="material-symbols-outlined text-2xl">payments</span>
                  <span className="material-symbols-outlined text-2xl">account_balance_wallet</span>
                </div>
              </div>
            </div>

            {/* Promo Code */}
            <div className="mt-10">
              <label className="text-label-sm font-label-sm text-secondary block mb-2">
                DO YOU HAVE A PROMO CODE?
              </label>
              <div className="flex gap-2">
                <input
                  className="flex-grow bg-surface-container border border-surface-variant rounded-lg px-4 font-body-md text-body-md text-on-surface focus:ring-2 focus:ring-primary focus:outline-none"
                  placeholder="Enter code"
                  type="text"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  disabled={promoApplied}
                />
                <button
                  onClick={handleApplyPromo}
                  className="px-6 py-2 border border-on-background text-on-background rounded-lg font-label-lg hover:bg-on-background hover:text-surface transition-colors cursor-pointer"
                  disabled={promoApplied}
                >
                  {promoApplied ? "Applied" : "Apply"}
                </button>
              </div>
              {promoApplied && (
                <p className="text-green-600 text-xs mt-2 font-body-md">
                  Promo code applied: 30% discount!
                </p>
              )}
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}
