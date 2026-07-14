"use client";

import Image from "next/image";
import { motion } from "motion/react";

export default function BelleOrb() {
  return (
    <div className="relative flex justify-center items-center mx-auto w-full max-w-[400px] h-[220px]">
      
      {/* Concentric rings background */}
      <div className="absolute inset-0 flex justify-center items-center pointer-events-none overflow-hidden">
        <svg 
          viewBox="0 0 440 440" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          className="w-[115%] h-[115%] max-w-none opacity-50 -translate-y-4"
          style={{
            maskImage: "linear-gradient(to bottom, black 35%, transparent 60%)",
            WebkitMaskImage: "linear-gradient(to bottom, black 35%, transparent 60%)",
          }}
        >
          <circle cx="220" cy="220" r="105" stroke="#D4B59E" strokeWidth="0.5" strokeDasharray="3 4" />
          <circle cx="220" cy="220" r="150" stroke="#D4B59E" strokeWidth="0.5" />
          <circle cx="220" cy="220" r="195" stroke="#D4B59E" strokeWidth="0.5" opacity="0.6" />
          
          {/* Subtle marking crosses */}
          <path d="M70 220 h-10 m5 -5 v10" stroke="#D4B59E" strokeWidth="0.5" />
          <path d="M370 220 h-10 m5 -5 v10" stroke="#D4B59E" strokeWidth="0.5" />
          <path d="M220 70 v-10 m-5 5 h10" stroke="#D4B59E" strokeWidth="0.5" />
        </svg>
      </div>

      {/* Floating Orb */}
      <motion.div
        animate={{ y: [0, -4, 0] }}
        transition={{
          duration: 8,
          ease: "easeInOut",
          repeat: Infinity,
          repeatType: "loop",
        }}
        className="relative z-10 flex justify-center items-center mt-2"
      >
        <div 
          style={{
            WebkitMaskImage: "radial-gradient(circle at center, black 40%, transparent 68%)",
            maskImage: "radial-gradient(circle at center, black 40%, transparent 68%)",
          }}
          className="relative flex justify-center items-center"
        >
          <Image
            src="/images/belle-orb.png"
            alt="Belle AI"
            width={200}
            height={200}
            className="w-[150px] md:w-[170px] lg:w-[190px] h-auto opacity-[0.9] mix-blend-multiply"
            priority
          />
        </div>
      </motion.div>

      {/* Base floor shadow */}
      <motion.div
        animate={{ scale: [1, 0.9, 1], opacity: [0.7, 0.4, 0.7] }}
        transition={{
          duration: 8,
          ease: "easeInOut",
          repeat: Infinity,
          repeatType: "loop",
        }}
        className="absolute bottom-6 md:bottom-4 w-[150px] md:w-[170px] h-[8px] bg-[#E1C6B4] rounded-[100%] blur-[6px] z-0"
      />
    </div>
  );
}
