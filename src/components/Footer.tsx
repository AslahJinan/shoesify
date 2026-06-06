"use client";

import React from "react";
import Link from "next/link";

export default function Footer() {
  const handleNavClick = (gender: string) => {
    if (typeof window !== "undefined") {
      const element = document.getElementById("collection");
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
      const event = new CustomEvent("switch-gender-tab", { detail: gender });
      window.dispatchEvent(event);
    }
  };

  return (
    <footer className="w-full mt-auto bg-secondary-container">
      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-12 flex flex-col md:flex-row justify-between gap-gutter">
        {/* Brand & Contact */}
        <div className="flex flex-col gap-6 md:max-w-xs">
          <Link href="/" className="font-display-lg text-headline-md text-on-surface block w-fit">
            Shoesify
          </Link>
          <p className="text-on-secondary-fixed-variant font-body-md">
            Premium athletic footwear for those who demand excellence in every step. Join the elite.
          </p>
          <div className="flex flex-col gap-2">
            <a 
              className="text-on-secondary-fixed-variant font-body-md hover:text-primary transition-colors duration-200" 
              href="tel:+1234567890"
            >
              Contact: +1 234 567 890
            </a>
            <a 
              className="text-on-secondary-fixed-variant font-body-md hover:text-primary transition-colors duration-200" 
              href="mailto:help@shoesify.com"
            >
              Email: help@shoesify.com
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-2 gap-12">
          <div className="flex flex-col gap-4">
            <h4 className="font-label-lg text-on-surface uppercase tracking-widest">Shop</h4>
            <button 
              onClick={() => handleNavClick("mens")}
              className="text-left text-on-secondary-fixed-variant font-body-md hover:text-primary transition-colors duration-200"
            >
              Mens
            </button>
            <button 
              onClick={() => handleNavClick("womens")}
              className="text-left text-on-secondary-fixed-variant font-body-md hover:text-primary transition-colors duration-200"
            >
              Womens
            </button>
            <button 
              onClick={() => handleNavClick("kids")}
              className="text-left text-on-secondary-fixed-variant font-body-md hover:text-primary transition-colors duration-200"
            >
              Kids
            </button>
            <button 
              onClick={() => handleNavClick("mens")}
              className="text-left text-on-secondary-fixed-variant font-body-md hover:text-primary transition-colors duration-200"
            >
              Sale
            </button>
          </div>
          <div className="flex flex-col gap-4">
            <h4 className="font-label-lg text-on-surface uppercase tracking-widest">Help</h4>
            <a className="text-on-secondary-fixed-variant font-body-md hover:text-primary transition-colors duration-200" href="#">
              Returns
            </a>
            <a className="text-on-secondary-fixed-variant font-body-md hover:text-primary transition-colors duration-200" href="#">
              Shipping
            </a>
            <a className="text-on-secondary-fixed-variant font-body-md hover:text-primary transition-colors duration-200" href="#">
              Size Guide
            </a>
            <a className="text-on-secondary-fixed-variant font-body-md hover:text-primary transition-colors duration-200" href="#">
              Track Order
            </a>
          </div>
        </div>

        {/* Social & Copyright */}
        <div className="flex flex-col gap-8 items-start md:items-end">
          <div className="flex gap-6">
            <a 
              className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-secondary hover:bg-primary hover:text-white transition-all shadow-sm" 
              href="#"
              aria-label="Facebook"
            >
              <span className="material-symbols-outlined text-inherit" style={{ fontSize: "20px" }}>
                face_nod
              </span>
            </a>
            <a 
              className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-secondary hover:bg-primary hover:text-white transition-all shadow-sm" 
              href="#"
              aria-label="Instagram"
            >
              <span className="material-symbols-outlined text-inherit" style={{ fontSize: "20px" }}>
                photo_camera
              </span>
            </a>
            <a 
              className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-secondary hover:bg-primary hover:text-white transition-all shadow-sm" 
              href="#"
              aria-label="YouTube"
            >
              <span className="material-symbols-outlined text-inherit" style={{ fontSize: "20px" }}>
                video_library
              </span>
            </a>
          </div>
          <p className="text-on-secondary-fixed-variant font-body-md text-right">
            © 2024 Shoesify. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
