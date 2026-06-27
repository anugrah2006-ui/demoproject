"use client";

import Image from "next/image";
import { motion } from "motion/react";

export default function BelleOrb() {
  return (
    <motion.div
      animate={{ y: [0, -8, 0] }}
      transition={{
        duration: 8,
        ease: "easeInOut",
        repeat: Infinity,
        repeatType: "loop",
      }}
      className="relative flex justify-center items-center mx-auto"
      style={{
        WebkitMaskImage: "radial-gradient(ellipse 70% 70% at center, black 40%, transparent 72%)",
        maskImage: "radial-gradient(ellipse 70% 70% at center, black 40%, transparent 72%)",
      }}
    >
      <Image
        src="/images/belle-orb.png"
        alt="Belle AI"
        width={160}
        height={160}
        className="w-[140px] md:w-[160px] lg:w-[180px] h-auto opacity-90 mix-blend-multiply"
        priority
      />
    </motion.div>
  );
}
