"use client";

import Image from "next/image";
import { motion } from "motion/react";
import LoginForm from "@/components/auth/LoginForm";
import GoogleButton from "@/components/auth/GoogleButton";

export default function LoginPage() {
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
            Sign in to continue your personalized grooming, style, and self-care journey.
          </p>
        </div>

        {/* Right Section (Login Card) */}
        <div className="w-full flex justify-center lg:justify-end lg:pr-8 xl:pr-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
            className="w-full max-w-[460px] rounded-[32px] bg-white p-10 md:p-12 border border-[#ECE8E2] shadow-[0_8px_32px_rgba(0,0,0,0.04)]"
          >
            <div className="mb-8 text-center">
              <h2 className="font-heading text-3xl font-medium tracking-tight text-[#1D1D1F] mb-3">
                Sign In
              </h2>
              <p className="text-[#6E6E73] text-sm leading-relaxed">
                Enter your credentials to access your account.
              </p>
            </div>

            <GoogleButton />

            <div className="my-8 flex items-center">
              <div className="flex-grow border-t border-[#ECE8E2]"></div>
              <span className="mx-4 text-xs font-medium text-[#6E6E73] uppercase tracking-wider">Or</span>
              <div className="flex-grow border-t border-[#ECE8E2]"></div>
            </div>

            <LoginForm />

            <div className="mt-8 text-center">
              <span className="text-sm text-[#6E6E73] mr-1">Don&apos;t have an account?</span>
              <a href="/signup" className="text-sm font-medium text-[#C98766] hover:underline decoration-1 underline-offset-4">
                Sign up
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
