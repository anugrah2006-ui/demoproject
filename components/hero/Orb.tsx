"use client";

import Image from "next/image";
import { motion } from "motion/react";

export default function Orb() {
  return (
    <motion.div
      className="flex items-center justify-center px-6 -mt-16 md:-mt-24"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
    >
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{
          duration: 6,
          ease: "easeInOut",
          repeat: Infinity,
          repeatType: "loop",
        }}
        style={{
          WebkitMaskImage:
            "radial-gradient(ellipse 70% 70% at center, black 40%, transparent 72%)",
          maskImage:
            "radial-gradient(ellipse 70% 70% at center, black 40%, transparent 72%)",
        }}
      >
        <Image
          src="/images/belle-orb.png"
          alt="Belle AI — glowing orb visual"
          width={560}
          height={560}
          className="h-auto w-[320px] md:w-[400px] lg:w-[480px]"
          priority
        />
      </motion.div>
    </motion.div>
  );
}
