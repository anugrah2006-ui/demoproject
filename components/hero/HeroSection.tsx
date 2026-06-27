"use client";

import { motion } from "motion/react";

export default function HeroSection() {
  return (
    <section className="px-6 pt-4 pb-0 text-center md:pt-6 md:pb-0">
      <motion.h1
        className="font-heading text-4xl font-light leading-[1.1] tracking-tight text-text-primary sm:text-5xl md:text-6xl lg:text-[4.25rem]"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        Your Personal AI Grooming Assistant
      </motion.h1>

      <motion.p
        className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-text-secondary md:text-lg"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut", delay: 0.15 }}
      >
        Elevate your grooming and lifestyle with Belle&apos;s intelligent,
        personalized advice.
      </motion.p>
    </section>
  );
}
