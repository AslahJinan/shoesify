"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";

export default function Header() {
  const { cartCount } = useCart();
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
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
          {/* User Profile / Login Button */}
          <div className="hidden md:block">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                  className="flex items-center gap-2 cursor-pointer focus:outline-none"
                >
                  <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-label-lg uppercase border border-primary/20 hover:bg-primary/20 transition-colors">
                    {user.photoURL ? (
                      <Image src={user.photoURL} alt="Avatar" width={40} height={40} className="w-full h-full rounded-full object-cover" />
                    ) : (
                      user.displayName ? user.displayName.substring(0, 2) : user.email?.substring(0, 2) || "U"
                    )}
                  </div>
                </button>

                {profileMenuOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setProfileMenuOpen(false)}
                    ></div>
                    <div className="absolute right-0 mt-3 w-64 bg-white rounded-xl shadow-2xl py-4 border border-surface-container-high z-20 animate-fadeIn">
                      <div className="px-4 pb-3 border-b border-surface-container flex flex-col gap-1">
                        <p className="font-bold text-on-surface text-body-md truncate">
                          {user.displayName || "Shoesify User"}
                        </p>
                        <p className="text-secondary text-label-sm truncate">{user.email}</p>
                        
                        <div className="mt-2">
                          {user.emailVerified ? (
                            <span className="inline-flex items-center gap-1 bg-green-50 text-green-700 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">
                              <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                              Verified
                            </span>
                          ) : (
                            <Link
                              href="/verify-email"
                              onClick={() => setProfileMenuOpen(false)}
                              className="inline-flex items-center gap-1 bg-amber-50 hover:bg-amber-100 text-amber-800 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider transition-colors"
                            >
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                              Verify Email
                            </Link>
                          )}
                        </div>
                      </div>
                      <div className="pt-2 px-2">
                        <button
                          onClick={async () => {
                            setProfileMenuOpen(false);
                            await logout();
                          }}
                          className="w-full flex items-center gap-3 px-3 py-2 text-label-lg text-error hover:bg-error-container/20 rounded-lg transition-colors cursor-pointer text-left font-semibold"
                        >
                          <span className="material-symbols-outlined" style={{ fontSize: "20px" }}>
                            logout
                          </span>
                          Sign Out
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <Link
                href="/login"
                className="inline-flex items-center bg-primary text-white px-5 py-2.5 rounded-lg font-label-lg text-label-lg hover:bg-on-background transition-all duration-300"
              >
                Sign In
              </Link>
            )}
          </div>

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

          {/* Mobile Auth UI */}
          <div className="mt-2 border-t border-surface-container/50 pt-4">
            {user ? (
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-3 px-2">
                  <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold uppercase border border-primary/20">
                    {user.photoURL ? (
                      <Image src={user.photoURL} alt="Avatar" width={40} height={40} className="w-full h-full rounded-full object-cover" />
                    ) : (
                      user.displayName ? user.displayName.substring(0, 2) : user.email?.substring(0, 2) || "U"
                    )}
                  </div>
                  <div>
                    <p className="font-bold text-on-surface text-body-md">
                      {user.displayName || "Shoesify User"}
                    </p>
                    <p className="text-secondary text-label-sm">{user.email}</p>
                  </div>
                </div>
                <div className="px-2 flex items-center justify-between mt-1">
                  {user.emailVerified ? (
                    <span className="inline-flex items-center gap-1 bg-green-50 text-green-700 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">
                      Verified
                    </span>
                  ) : (
                    <Link
                      href="/verify-email"
                      onClick={() => setMobileMenuOpen(false)}
                      className="inline-flex items-center gap-1 bg-amber-50 text-amber-800 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider"
                    >
                      Verify Email
                    </Link>
                  )}
                  <button
                    onClick={async () => {
                      setMobileMenuOpen(false);
                      await logout();
                    }}
                    className="text-error font-label-lg text-label-lg flex items-center gap-1 hover:underline cursor-pointer"
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>
                      logout
                    </span>
                    Sign Out
                  </button>
                </div>
              </div>
            ) : (
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center bg-primary text-white py-3 rounded-lg font-label-lg text-label-lg hover:bg-on-background transition-colors block"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
