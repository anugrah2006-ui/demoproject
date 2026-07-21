"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";

interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  index: number;
}

export default function FeatureCard({
  icon,
  title,
  description,
  index,
}: FeatureCardProps) {
  return (
    <motion.article
      className="group flex flex-col items-center rounded-2xl border border-border-subtle bg-card-bg px-5 py-6 shadow-[0_2px_24px_rgba(0,0,0,0.04)] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_8px_32px_rgba(0,0,0,0.08)]"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{
        duration: 0.6,
        ease: "easeOut",
        delay: index * 0.12,
      }}
    >
      {/* Icon */}
      <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-ivory text-copper">
        {icon}
      </div>

      {/* Title */}
      <h3 className="font-heading text-lg font-semibold text-text-primary">
        {title}
      </h3>

      {/* Description */}
      <p className="mt-2 text-sm text-text-secondary">{description}</p>
    </motion.article>
  );
}
