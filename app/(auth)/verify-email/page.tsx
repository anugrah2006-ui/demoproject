"use client";

import { motion } from "motion/react";
import { MailCheck } from "lucide-react";

export default function VerifyEmailPage() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="flex-grow flex items-center justify-center w-full px-5 py-12 md:px-8 lg:px-12 bg-[#FFFDF9]"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-[460px] rounded-[32px] bg-white p-10 md:p-12 border border-[#ECE8E2] shadow-[0_8px_32px_rgba(0,0,0,0.04)] text-center"
      >
        <div className="mx-auto w-16 h-16 bg-[#FAF5F0] rounded-full flex items-center justify-center text-[#C98766] mb-6">
          <MailCheck className="w-8 h-8" />
        </div>
        
        <h2 className="font-heading text-3xl font-medium tracking-tight text-[#1D1D1F] mb-4">
          Verify your email
        </h2>
        
        <p className="text-[#6E6E73] text-[15px] leading-relaxed mb-8">
          Check your inbox. We&apos;ve sent a verification link to your email address. Please click the link to verify your account and continue.
        </p>

        <a
          href="/login"
          className="flex h-12 w-full items-center justify-center rounded-full border border-[#ECE8E2] bg-white text-base font-medium text-[#1D1D1F] shadow-sm transition-all duration-200 hover:bg-[#FAF8F5] active:scale-[0.98]"
        >
          Back to Login
        </a>
      </motion.div>
    </motion.div>
  );
}
