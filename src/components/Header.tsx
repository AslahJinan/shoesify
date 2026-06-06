"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useCart } from "@/context/CartContext";

export default function Header() {
  const { cartCount } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const handleNavClick = (gender: string) => {
    setMobileMenuOpen(false);
    if (pathname === "/") {
      // If we are on the homepage, trigger a custom event or scroll
      const element = document.getElementById("collection");
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
      // Dispatch custom event to switch tabs on homepage
      const event = new CustomEvent("switch-gender-tab", { detail: gender });
      window.dispatchEvent(event);
    } else {
      // Navigate to homepage with hash
      router.push(`/#${gender}`);
    }
  };

  return (
    <header className="w-full top-0 sticky z-50 bg-surface shadow-[0px_10px_30px_rgba(0,0,0,0.08)]">
      <nav className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop flex justify-between items-center h-20">
        {/* Brand Logo */}
        <Link 
          href="/" 
          className="font-display-lg text-display-lg-mobile md:text-display-lg font-extrabold text-primary"
        >
          Shoesify
        </Link>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center gap-10">
          <button 
            onClick={() => handleNavClick("mens")}
            className="font-label-lg text-label-lg text-on-surface hover:text-primary transition-colors duration-200 cursor-pointer active:scale-95"
          >
            Mens
          </button>
          <button 
            onClick={() => handleNavClick("womens")}
            className="font-label-lg text-label-lg text-on-surface hover:text-primary transition-colors duration-200 cursor-pointer active:scale-95"
          >
            Womens
          </button>
          <button 
            onClick={() => handleNavClick("kids")}
            className="font-label-lg text-label-lg text-on-surface hover:text-primary transition-colors duration-200 cursor-pointer active:scale-95"
          >
            Kids
          </button>
        </div>

        {/* Trailing Actions */}
        <div className="flex items-center gap-6">
          <div className="hidden md:flex items-center bg-surface-container rounded-full px-4 py-2">
            <span className="material-symbols-outlined text-secondary mr-2" style={{ fontSize: "20px" }}>
              search
            </span>
            <input 
              className="bg-transparent border-none focus:ring-0 text-body-md w-32 lg:w-48 text-on-surface placeholder:text-secondary/60 focus:outline-none" 
              placeholder="Search..." 
              type="text"
            />
          </div>
          <Link 
            href="/cart" 
            className="relative cursor-pointer active:scale-95 transition-transform block"
          >
            <span className="material-symbols-outlined text-on-surface" style={{ fontSize: "28px" }}>
              shopping_cart
            </span>
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-primary text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold animate-pulse">
                {cartCount}
              </span>
            )}
          </Link>
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-on-surface"
          >
            <span className="material-symbols-outlined">
              {mobileMenuOpen ? "close" : "menu"}
            </span>
          </button>
        </div>
      </nav>

      {/* Mobile Navigation Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-surface border-t border-surface-container py-4 px-margin-mobile flex flex-col gap-4 shadow-lg animate-fadeIn">
          <button 
            onClick={() => handleNavClick("mens")}
            className="text-left font-label-lg text-label-lg py-2 text-on-surface hover:text-primary border-b border-surface-container/50"
          >
            Mens
          </button>
          <button 
            onClick={() => handleNavClick("womens")}
            className="text-left font-label-lg text-label-lg py-2 text-on-surface hover:text-primary border-b border-surface-container/50"
          >
            Womens
          </button>
          <button 
            onClick={() => handleNavClick("kids")}
            className="text-left font-label-lg text-label-lg py-2 text-on-surface hover:text-primary"
          >
            Kids
          </button>
          <div className="flex items-center bg-surface-container rounded-full px-4 py-2 mt-2">
            <span className="material-symbols-outlined text-secondary mr-2" style={{ fontSize: "20px" }}>
              search
            </span>
            <input 
              className="bg-transparent border-none focus:ring-0 text-body-md w-full text-on-surface focus:outline-none" 
              placeholder="Search..." 
              type="text"
            />
          </div>
        </div>
      )}
    </header>
  );
}
