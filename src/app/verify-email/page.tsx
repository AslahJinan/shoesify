"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function VerifyEmailPage() {
  const { user, sendVerificationEmail, reloadUser, logout, loading } = useAuth();
  const router = useRouter();

  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);
  const [cooldown, setCooldown] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Redirect if not logged in
  useEffect(() => {
    if (!loading && !user) {
      router.push("/login?redirect=/verify-email");
    } else if (user && user.emailVerified) {
      router.push("/");
    }
  }, [user, loading, router]);

  // Handle countdown for resending email
  useEffect(() => {
    if (cooldown > 0) {
      const timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [cooldown]);

  const handleResend = async () => {
    if (cooldown > 0) return;

    setMessage(null);
    setIsSubmitting(true);
    try {
      await sendVerificationEmail();
      setMessage({ text: "Verification email resent successfully! Check your inbox.", type: "success" });
      setCooldown(60); // 60 seconds cooldown
    } catch (err: any) {
      console.error(err);
      setMessage({ text: err.message || "Failed to resend verification email. Please try again.", type: "error" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCheckStatus = async () => {
    setMessage(null);
    setIsSubmitting(true);
    try {
      await reloadUser();
      if (user && user.emailVerified) {
        setMessage({ text: "Your email has been verified! Redirecting...", type: "success" });
        setTimeout(() => {
          router.push("/");
        }, 1500);
      } else {
        setMessage({ text: "Email not verified yet. Please check your inbox and click the link.", type: "error" });
      }
    } catch (err: any) {
      console.error(err);
      setMessage({ text: "Failed to check status. Please try again.", type: "error" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      router.push("/login");
    } catch (err) {
      console.error("Failed to log out:", err);
    }
  };

  if (loading || !user) {
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

        <div className="relative z-10 text-center">
          <div className="w-20 h-20 bg-primary/5 rounded-full flex items-center justify-center mx-auto mb-6 border border-primary/10">
            <span className="material-symbols-outlined text-primary animate-bounce" style={{ fontSize: "40px" }}>
              mark_email_unread
            </span>
          </div>

          <h1 className="font-display-lg text-headline-lg text-on-surface mb-3">Verify Your Email</h1>
          <p className="text-secondary font-body-md mb-6 leading-relaxed">
            We've sent a verification link to <br />
            <span className="font-semibold text-on-surface">{user.email}</span>. <br />
            Please open the link in that email to activate your account.
          </p>

          {message && (
            <div
              className={`border px-4 py-3 rounded-lg text-label-lg mb-6 flex items-start gap-2 text-left animate-fadeIn ${
                message.type === "success"
                  ? "bg-green-50/50 border-green-200 text-green-800"
                  : "bg-error-container/20 border-error/20 text-error"
              }`}
            >
              <span className="material-symbols-outlined text-[20px] shrink-0">
                {message.type === "success" ? "check_circle" : "error"}
              </span>
              <span>{message.text}</span>
            </div>
          )}

          <div className="space-y-4">
            <button
              onClick={handleCheckStatus}
              disabled={isSubmitting}
              className="w-full bg-primary text-white py-3.5 rounded-xl font-bold uppercase tracking-wider hover:bg-on-background active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75 disabled:pointer-events-none"
            >
              {isSubmitting ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                "I've Verified My Email"
              )}
            </button>

            <button
              onClick={handleResend}
              disabled={cooldown > 0 || isSubmitting}
              className="w-full border border-surface-container-high hover:border-primary/30 hover:bg-surface py-3.5 rounded-xl text-label-lg font-semibold text-on-surface transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75 disabled:pointer-events-none"
            >
              <span className="material-symbols-outlined" style={{ fontSize: "20px" }}>
                forward_to_inbox
              </span>
              {cooldown > 0 ? `Resend Email (${cooldown}s)` : "Resend Verification Email"}
            </button>
          </div>

          <div className="relative flex py-6 items-center">
            <div className="flex-grow border-t border-surface-container"></div>
            <span className="flex-shrink mx-4 text-secondary text-label-sm font-medium">Or</span>
            <div className="flex-grow border-t border-surface-container"></div>
          </div>

          <div className="flex justify-between items-center px-2">
            <Link href="/" className="text-label-sm text-primary hover:underline font-semibold flex items-center gap-1">
              <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>
                arrow_back
              </span>
              Back to Home
            </Link>

            <button
              onClick={handleLogout}
              className="text-label-sm text-secondary hover:text-error hover:underline font-semibold flex items-center gap-1 cursor-pointer"
            >
              <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>
                logout
              </span>
              Sign Out / Switch Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
