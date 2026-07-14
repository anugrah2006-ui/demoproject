"use client";

import { motion, AnimatePresence } from "motion/react";
import Image from "next/image";

interface AuthLoadingOverlayProps {
  isVisible: boolean;
}

export default function AuthLoadingOverlay({ isVisible }: AuthLoadingOverlayProps) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#FFFDF9] backdrop-blur-md"
        >
          <div className="relative flex flex-col items-center justify-center">
            {/* Soft Champagne Pulse */}
            <motion.div
              className="absolute inset-0 z-0 rounded-full bg-[#E5D5C1] blur-3xl"
              animate={{ opacity: [0.2, 0.4, 0.2], scale: [0.9, 1.1, 0.9] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            />
            
            {/* Floating Orb */}
            <motion.div
              className="relative z-10 w-[140px] h-[140px] md:w-[180px] md:h-[180px]"
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
              <Image
                src="/images/belle-orb.png"
                alt="Belle Orb Loading"
                fill
                priority
                sizes="(max-width: 768px) 140px, 180px"
                className="object-contain drop-shadow-[0_10px_20px_rgba(201,135,102,0.15)]"
              />
            </motion.div>
          </div>

          <motion.p
            className="mt-8 font-heading text-[15px] italic text-[#C98766]/80"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.4 }}
          >
            Checking your session...
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
