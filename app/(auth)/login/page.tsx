"use client";

import Image from "next/image";
import { useEffect, useMemo, useSyncExternalStore } from "react";
import { motion } from "motion/react";
import AuthCard from "@/components/auth/AuthCard";
import { logAuthWarn } from "@/lib/auth/debug";

type OAuthErrorDetails = {
  error: string | null;
  errorCode: string | null;
  errorDescription: string | null;
  query: string;
  hash: string;
};

function readOAuthErrorFromLocation(): OAuthErrorDetails | null {
  if (typeof window === "undefined") return null;

  const params = new URLSearchParams(window.location.search);
  const hashParams = new URLSearchParams(window.location.hash.replace(/^#/, ""));

  const error = params.get("error") ?? hashParams.get("error");
  const errorCode = params.get("error_code") ?? hashParams.get("error_code");
  const errorDescription =
    params.get("error_description") ?? hashParams.get("error_description");

  if (!error && !errorCode && !errorDescription) return null;

  return {
    error,
    errorCode,
    errorDescription,
    query: window.location.search,
    hash: window.location.hash,
  };
}

function getOAuthErrorSnapshot() {
  const oauthError = readOAuthErrorFromLocation();
  return oauthError ? JSON.stringify(oauthError) : "";
}

function subscribeToLocation() {
  return () => {};
}

export default function LoginPage() {
  const oauthErrorSnapshot = useSyncExternalStore(
    subscribeToLocation,
    getOAuthErrorSnapshot,
    () => ""
  );
  const oauthError = useMemo<OAuthErrorDetails | null>(() => {
    if (!oauthErrorSnapshot) return null;

    try {
      return JSON.parse(oauthErrorSnapshot) as OAuthErrorDetails;
    } catch {
      return null;
    }
  }, [oauthErrorSnapshot]);

  useEffect(() => {
    if (oauthError) {
      logAuthWarn("login-page", "Login page loaded with OAuth error", oauthError);
    }
  }, [oauthError]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="flex-grow flex items-center justify-center w-full px-5 py-12 md:px-8 lg:px-12"
    >
      <div className="w-full max-w-[1400px] grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center justify-items-center">
        
        {/* Left Section (Orb + Text) */}
        <div className="flex flex-col items-center text-center w-full max-w-[520px]">
          
          <motion.div
            animate={{ y: [0, -12, 0] }}
            transition={{
              duration: 8,
              ease: "easeInOut",
              repeat: Infinity,
              repeatType: "loop",
            }}
            className="mb-8 md:mb-12 relative flex justify-center items-center"
            style={{
              WebkitMaskImage: "radial-gradient(ellipse 70% 70% at center, black 40%, transparent 72%)",
              maskImage: "radial-gradient(ellipse 70% 70% at center, black 40%, transparent 72%)",
            }}
          >
            <Image
              src="/images/belle-orb.png"
              alt="Belle AI — glowing orb"
              width={560}
              height={560}
              className="h-auto w-[340px] md:w-[480px] lg:w-[560px]"
              priority
            />
          </motion.div>

          <h1 className="font-heading text-4xl md:text-5xl font-light tracking-tight text-[#1D1D1F] mb-4">
            Welcome back to Belle
          </h1>
          
          <p className="text-[#6E6E73] text-lg leading-relaxed max-w-[420px]">
            Your AI-powered grooming companion for skincare, fashion, hair, and confidence.
          </p>

        </div>

        {/* Right Section (Auth Card) */}
        <div className="w-full flex justify-center lg:justify-end lg:pr-8 xl:pr-16">
          <div className="w-full max-w-[460px]">
            {oauthError && (
              <div className="mb-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                <p className="font-medium">Google sign-in failed.</p>
                <p className="mt-1">
                  {oauthError.errorDescription ??
                    oauthError.errorCode ??
                    oauthError.error ??
                    "Supabase returned an OAuth error."}
                </p>
              </div>
            )}
            <AuthCard />
          </div>
        </div>

      </div>
    </motion.div>
  );
}
