"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export default function ForgotPasswordPage() {
  const { resetPassword, loading } = useAuth();
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      setError("Please enter your email address.");
      return;
    }

    setError(null);
    setIsSubmitting(true);

    try {
      await resetPassword(email);
      setSuccess(true);
    } catch (err: any) {
      console.error(err);
      if (err.code === "auth/user-not-found") {
        setError("No account found with this email address.");
      } else if (err.code === "auth/invalid-email") {
        setError("Please enter a valid email address.");
      } else {
        setError(err.message || "Failed to send reset email. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface px-margin-mobile md:px-margin-desktop py-12">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-[0px_8px_30px_rgba(0,0,0,0.06)] border border-surface-container p-8 md:p-10 relative overflow-hidden">
        {/* Glow decorative effect */}
        <div className="absolute -top-12 -right-12 w-24 h-24 bg-primary/10 rounded-full blur-2xl"></div>
        <div className="absolute -bottom-12 -left-12 w-24 h-24 bg-primary-container/10 rounded-full blur-2xl"></div>

        <div className="relative z-10">
          {success ? (
            <div className="text-center py-6 animate-fadeIn">
              <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6 border border-green-200">
                <span className="material-symbols-outlined text-green-600" style={{ fontSize: "36px" }}>
                  mail
                </span>
              </div>
              <h1 className="font-display-lg text-headline-lg text-on-surface mb-4">Check Your Email</h1>
              <p className="text-secondary font-body-md mb-8 leading-relaxed">
                We've sent password reset instructions to <span className="font-semibold text-on-surface">{email}</span>. Please check your inbox and follow the link.
              </p>
              <Link
                href="/login"
                className="inline-flex w-full bg-primary text-white py-3.5 rounded-xl font-bold uppercase tracking-wider hover:bg-on-background active:scale-[0.98] transition-all duration-300 items-center justify-center cursor-pointer"
              >
                Back to Sign In
              </Link>
            </div>
          ) : (
            <>
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-surface-container rounded-full flex items-center justify-center mx-auto mb-4 border border-surface-container-high">
                  <span className="material-symbols-outlined text-primary" style={{ fontSize: "32px" }}>
                    lock_reset
                  </span>
                </div>
                <h1 className="font-display-lg text-headline-lg text-on-surface mb-2">Reset Password</h1>
                <p className="text-secondary font-body-md">
                  Enter your email and we'll send you a link to reset your password.
                </p>
              </div>

              {error && (
                <div className="bg-error-container/20 border border-error/20 text-error px-4 py-3 rounded-lg text-label-lg mb-6 flex items-start gap-2 animate-fadeIn">
                  <span className="material-symbols-outlined text-[20px] shrink-0">error</span>
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="email" className="block text-label-sm font-semibold text-on-surface mb-1.5">
                    Email Address
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-surface-container-low border border-surface-container-high rounded-xl p-3.5 text-body-md text-on-surface placeholder:text-secondary/50 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                    placeholder="name@example.com"
                    disabled={isSubmitting}
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-primary text-white py-3.5 rounded-xl font-bold uppercase tracking-wider hover:bg-on-background active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75 disabled:pointer-events-none"
                >
                  {isSubmitting ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    "Send Reset Link"
                  )}
                </button>
              </form>

              <p className="text-center text-label-sm text-secondary mt-8 font-medium">
                Remember your password?{" "}
                <Link href="/login" className="text-primary hover:underline font-semibold">
                  Sign In
                </Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
