"use client";

import { motion } from "motion/react";
import { useAuthNavigation } from "@/hooks/useAuthNavigation";
import AuthLoadingOverlay from "@/components/auth/AuthLoadingOverlay";

export default function CTAButton() {
  const { navigateWithAuthCheck, isChecking } = useAuthNavigation();

  return (
    <>
    <motion.div
      className="flex justify-center px-6 pt-6 pb-4 md:pb-6"
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <button
        type="button"
        onClick={navigateWithAuthCheck}
        className="cursor-pointer rounded-full bg-gradient-to-r from-copper-light to-copper-dark px-14 py-4 text-base font-semibold text-white shadow-[0_4px_20px_rgba(193,125,78,0.3)] transition-all duration-200 hover:scale-[1.02] hover:shadow-[0_6px_28px_rgba(193,125,78,0.4)] active:scale-[0.98]"
      >
        Ask Belle
      </button>
    </motion.div>
      <AuthLoadingOverlay isVisible={isChecking} />
    </>
  );
}
