"use client";

import Image from "next/image";
import { motion } from "motion/react";
import AuthCard from "@/components/auth/AuthCard";

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
            Your AI-powered grooming companion for skincare, fashion, hair, and confidence.
          </p>

        </div>

        {/* Right Section (Auth Card) */}
        <div className="w-full flex justify-center lg:justify-end lg:pr-8 xl:pr-16">
          <AuthCard />
        </div>

      </div>
    </motion.div>
  );
}
