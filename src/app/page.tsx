"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { products } from "@/data/products";

type Category = "Mens" | "Womens" | "Kids";

export default function Home() {
  const [activeTab, setActiveTab] = useState<Category>("Mens");

  useEffect(() => {
    // Listen to tab switch events from Header or Footer
    const handleSwitchTab = (e: Event) => {
      const customEvent = e as CustomEvent<string>;
      const gender = customEvent.detail;
      if (gender === "mens") setActiveTab("Mens");
      else if (gender === "womens") setActiveTab("Womens");
      else if (gender === "kids") setActiveTab("Kids");
    };

    window.addEventListener("switch-gender-tab", handleSwitchTab);

    // Initial check for URL hash
    const handleHashChange = () => {
      const hash = window.location.hash.replace("#", "").toLowerCase();
      if (hash === "mens") setActiveTab("Mens");
      else if (hash === "womens") setActiveTab("Womens");
      else if (hash === "kids") setActiveTab("Kids");
    };

    handleHashChange();
    window.addEventListener("hashchange", handleHashChange);

    return () => {
      window.removeEventListener("switch-gender-tab", handleSwitchTab);
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, []);

  // Filter products by active category
  const filteredProducts = products.filter(
    (product) => product.category === activeTab
  );

  return (
    <div>
      {/* Hero Section: Split Vertical Sliders */}
      <section className="flex flex-col md:flex-row h-screen md:h-[calc(100vh-80px)] overflow-hidden">
        {/* Left: Featured */}
        <div className="relative w-full md:w-1/2 h-1/2 md:h-full bg-white group overflow-hidden border-r border-surface-container">
          <div className="h-full w-full relative">
            <Image
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-700 ease-in-out"
              alt="Elite Velocity X"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBGossOQME9QGUldzPb2YCk90Qi_eo28xeKuHGCmlF1XEcwdEsH5VfgVsXodhdPteVjmZc2G7BnQmiUYs-UjDyLKuETbBsDyPIf9TuEE-qA8_X-1WPzaxbEqkgmLPOcCb7Tri_dOZt02YYBp73Zkiyjr-MRp8R0Hu83jGebwxQtZ8hm6R5jgChVIOJpsh64LuBw54pHjcyx7k7MgnIyEM0BSRV9QsW08Rs_ghLTdhHQkVKN2222NE3WNfPMOmdiiu0_OKV0tys1hKLi"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
            <div className="absolute bottom-12 left-margin-mobile md:left-margin-desktop text-white">
              <span className="bg-primary text-white px-3 py-1 text-label-sm uppercase font-bold tracking-widest rounded-sm mb-4 inline-block">
                Featured
              </span>
              <h2 className="font-display-lg text-display-lg-mobile md:text-display-lg mb-4">
                Elite Velocity X
              </h2>
              <Link
                className="inline-flex items-center gap-3 bg-white text-on-background px-8 py-4 rounded-none font-bold uppercase tracking-widest hover:bg-primary hover:text-white transition-all duration-300"
                href="/product/elite-velocity-x"
              >
                Buy Now
                <span className="material-symbols-outlined">arrow_forward</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Right: Offered (Discounted) */}
        <div className="relative w-full md:w-1/2 h-1/2 md:h-full bg-surface-container group overflow-hidden">
          <div className="h-full w-full relative">
            <Image
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-700 ease-in-out"
              alt="Urban Drift Pro"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBFXmYvlat-4AGJk6SLEZoC6cQWbdWkUwQfYiSjRS0OagwH-VlyI7fh94X7vFqDOeRCcdqcZXXO1mYnJAbozpkBTh1cXk6yrexStC1MVD9PmPuoG9q-C-glHncpyfvP2Zbvg0PIfRG1I9N4WLyI-msKXUWOd0MCQ5vguhYX95tFLHTeJLFJg6jGBqliHawJd6pEFCkVushbMr2JMmr8GnkeHEtz3Px6Df1i_2hrYga0DVJ3fHM-BmAVFv_S3aSbXxjxvP5VGAG-WWZW"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
            <div className="absolute bottom-12 left-margin-mobile md:left-margin-desktop text-white">
              <span className="bg-primary-container text-white px-3 py-1 text-label-sm uppercase font-bold tracking-widest rounded-sm mb-4 inline-block">
                30% Off
              </span>
              <h2 className="font-display-lg text-display-lg-mobile md:text-display-lg mb-4">
                Urban Drift Pro
              </h2>
              <Link
                className="inline-flex items-center gap-3 bg-primary text-white px-8 py-4 rounded-none font-bold uppercase tracking-widest hover:bg-on-background transition-all duration-300"
                href="/product/urban-drift-pro"
              >
                Buy Now
                <span className="material-symbols-outlined">shopping_cart</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Gender Section: Tabbed Grid */}
      <section
        id="collection"
        className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-24 md:py-32 scroll-mt-20"
      >
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
          <div>
            <span className="text-primary font-bold tracking-[0.2em] uppercase text-label-sm mb-2 block">
              The Collection
            </span>
            <h2 className="font-headline-lg text-headline-lg text-on-surface">
              Engineered For Performance
            </h2>
          </div>

          {/* Custom Tabs */}
          <div className="flex bg-surface-container p-1 rounded-xl">
            <button
              onClick={() => setActiveTab("Mens")}
              className={`px-8 py-3 rounded-lg font-label-lg transition-all duration-300 ${
                activeTab === "Mens"
                  ? "bg-white shadow-sm text-primary"
                  : "text-secondary"
              }`}
            >
              Mens
            </button>
            <button
              onClick={() => setActiveTab("Womens")}
              className={`px-8 py-3 rounded-lg font-label-lg transition-all duration-300 ${
                activeTab === "Womens"
                  ? "bg-white shadow-sm text-primary"
                  : "text-secondary"
              }`}
            >
              Womens
            </button>
            <button
              onClick={() => setActiveTab("Kids")}
              className={`px-8 py-3 rounded-lg font-label-lg transition-all duration-300 ${
                activeTab === "Kids"
                  ? "bg-white shadow-sm text-primary"
                  : "text-secondary"
              }`}
            >
              Kids
            </button>
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-gutter">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="group bg-white rounded-xl overflow-hidden shadow-[0px_4px_20px_rgba(0,0,0,0.05)] transition-all duration-500 hover:-translate-y-2 hover:shadow-[0px_20px_40px_rgba(0,0,0,0.1)] flex flex-col justify-between"
            >
              <div className="aspect-[4/5] overflow-hidden bg-surface-container relative p-8 flex items-center justify-center">
                <Image
                  src={product.image}
                  alt={product.name}
                  width={300}
                  height={375}
                  className="w-full h-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-700"
                />
                {product.badge && (
                  <div className="absolute top-4 left-4">
                    <span className="bg-on-background text-white px-2 py-1 text-[10px] font-bold uppercase tracking-widest rounded-sm">
                      {product.badge}
                    </span>
                  </div>
                )}
              </div>
              <div className="p-6 flex-grow flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-headline-md text-headline-md text-on-surface">
                      {product.name}
                    </h3>
                    <span className="font-bold text-primary">${product.price}</span>
                  </div>
                  <p className="text-secondary font-body-md mb-6 line-clamp-2">
                    {product.description}
                  </p>
                </div>
                <Link
                  href={`/product/${product.id}`}
                  className="w-full bg-on-background text-white py-4 font-bold uppercase tracking-widest hover:bg-primary transition-colors flex items-center justify-center gap-2 group/btn"
                >
                  Buy Now
                  <span className="material-symbols-outlined group-hover/btn:translate-x-1 transition-transform">
                    arrow_forward
                  </span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Newsletter / Community Section */}
      <section className="bg-on-background py-32 overflow-hidden relative">
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop flex flex-col items-center text-center relative z-10">
          <h2 className="font-display-lg text-display-lg-mobile md:text-display-lg text-white mb-6">
            Join the Inner Circle
          </h2>
          <p className="text-surface-dim font-body-lg max-w-2xl mb-12">
            Get early access to drops, exclusive discounts, and professional performance tips delivered straight to your inbox.
          </p>
          <form
            onSubmit={(e) => e.preventDefault()}
            className="flex flex-col sm:flex-row w-full max-w-lg gap-4"
          >
            <input
              className="flex-grow bg-white/10 border border-white/20 text-white p-4 font-body-md focus:ring-primary focus:border-primary placeholder:text-white/40 focus:outline-none"
              placeholder="Email Address"
              type="email"
              required
            />
            <button
              type="submit"
              className="bg-primary text-white px-10 py-4 font-bold uppercase tracking-widest hover:bg-primary-container transition-colors active:scale-95 cursor-pointer"
            >
              Subscribe
            </button>
          </form>
        </div>
        {/* Decorative Elements */}
        <div className="absolute -top-24 -left-24 w-64 h-64 bg-primary/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-primary-container/10 rounded-full blur-3xl"></div>
      </section>
    </div>
  );
}
