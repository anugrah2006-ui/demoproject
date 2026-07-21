"use client";

import { motion, Variants } from "motion/react";

const benefits = [
  "Personalized AI that learns your unique preferences.",
  "Science-backed recommendations for skincare and hair.",
  "Save time by eliminating the guesswork in grooming.",
  "Build confidence with routines that actually work.",
  "Daily routines automatically scheduled for you.",
  "Progress tracking to celebrate your improvements.",
];

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

export default function BenefitsSection() {
  return (
    <section id="benefits" className="py-24 md:py-32 px-6 bg-[#FFFDF9]">
      <div className="mx-auto max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          
          {/* Left Column: Text */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <h2 className="font-heading text-4xl md:text-5xl lg:text-6xl font-light tracking-tight text-[#2A2A2A] mb-6">
              Why Choose Belle
            </h2>
            <p className="text-lg text-text-secondary leading-relaxed mb-8 max-w-md">
              Grooming and personal care shouldn&apos;t feel like a chore. Belle simplifies the complex world of fashion, skincare, and daily regimens, transforming it into an effortless daily habit that yields real results.
            </p>
          </motion.div>

          {/* Right Column: Benefits List */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            className="flex flex-col gap-4"
          >
            {benefits.map((benefit, i) => (
              <motion.div
                key={i}
                variants={itemVariants}
                className="flex items-start gap-4 p-5 rounded-2xl bg-[#FAF8F5] border border-[rgba(0,0,0,0.03)] transition-colors hover:bg-white hover:shadow-[0_4px_20px_rgba(201,135,102,0.08)]"
              >
                <div className="flex-shrink-0 flex h-6 w-6 items-center justify-center rounded-full bg-[#E8DCC4] text-[#C98766] mt-0.5">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <span className="text-base font-medium text-[#2A2A2A] leading-relaxed">
                  {benefit}
                </span>
              </motion.div>
            ))}
          </motion.div>

        </div>
      </div>
    </section>
  );
}
