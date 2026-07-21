"use client";

import Image from "next/image";
import { motion } from "motion/react";
import ResetPasswordForm from "@/components/auth/ResetPasswordForm";

export default function ResetPasswordPage() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="flex-grow flex items-center justify-center w-full px-5 py-12 md:px-8 lg:px-12"
    >
      <div className="w-full max-w-[1400px] grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center justify-items-center">
        
        {/* Left Section (Orb) */}
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
        </div>

        {/* Right Section (Reset Password Card) */}
        <div className="w-full flex justify-center lg:justify-start lg:pl-8 xl:pl-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
            className="w-full max-w-[460px] rounded-[32px] bg-white p-10 md:p-12 border border-[#ECE8E2] shadow-[0_8px_32px_rgba(0,0,0,0.04)]"
          >
            <div className="mb-8 text-center">
              <h2 className="font-heading text-3xl font-medium tracking-tight text-[#1D1D1F] mb-3">
                Update Password
              </h2>
              <p className="text-[#6E6E73] text-sm leading-relaxed">
                Enter your new password below.
              </p>
            </div>

            <ResetPasswordForm />
          </motion.div>
        </div>

      </div>
    </motion.div>
  );
}
