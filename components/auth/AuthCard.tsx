"use client";

import { motion } from "motion/react";
import GoogleButton from "./GoogleButton";
import LoginForm from "./LoginForm";
import AuthFooter from "./AuthFooter";

export default function AuthCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
      className="w-full max-w-[460px] rounded-[32px] bg-white p-10 md:p-12 border border-[#ECE8E2] shadow-[0_8px_32px_rgba(0,0,0,0.04)]"
    >
      <div className="mb-8 text-center">
        <h2 className="font-heading text-3xl font-medium tracking-tight text-[#1D1D1F] mb-3">
          Welcome Back
        </h2>
        <p className="text-[#6E6E73] text-sm leading-relaxed">
          Sign in to continue your Belle journey.
        </p>
      </div>

      <GoogleButton />

      <div className="my-8 flex items-center">
        <div className="flex-grow border-t border-[#ECE8E2]"></div>
        <span className="mx-4 text-xs font-medium text-[#6E6E73] uppercase tracking-wider">
          Or
        </span>
        <div className="flex-grow border-t border-[#ECE8E2]"></div>
      </div>

      <LoginForm />
      
      <AuthFooter />
    </motion.div>
  );
}
