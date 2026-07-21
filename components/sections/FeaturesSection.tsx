"use client";

import { motion, Variants } from "motion/react";

/* ── Inline Icons (Feather/Lucide style, thin and premium) ── */
const icons = {
  ai: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
    </svg>
  ),
  skincare: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z" />
      <path d="M12 18a6 6 0 0 0 0-12" />
      <path d="M12 14a2 2 0 0 0 0-4" />
    </svg>
  ),
  hair: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M7 11v8a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-7a1 1 0 0 1 1-1h3a4 4 0 0 0 4-4V4a2 2 0 1 1 4 0v5h3a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-4" />
    </svg>
  ),
  fashion: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.38 3.46L16 2a8 8 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z" />
    </svg>
  ),
  planner: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
      <path d="M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01M16 18h.01" />
    </svg>
  ),
  products: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="4" width="16" height="16" rx="2" ry="2" />
      <rect x="9" y="9" width="6" height="6" />
      <line x1="9" y1="1" x2="9" y2="4" />
      <line x1="15" y1="1" x2="15" y2="4" />
      <line x1="9" y1="20" x2="9" y2="23" />
      <line x1="15" y1="20" x2="15" y2="23" />
      <line x1="20" y1="9" x2="23" y2="9" />
      <line x1="20" y1="14" x2="23" y2="14" />
      <line x1="1" y1="9" x2="4" y2="9" />
      <line x1="1" y1="14" x2="4" y2="14" />
    </svg>
  ),
};

const featuresData = [
  {
    title: "AI Grooming Advice",
    description: "Receive tailored grooming tips that evolve with your goals and seasonal changes.",
    icon: icons.ai,
  },
  {
    title: "Personalized Skincare",
    description: "Discover the perfect skincare routine mapped directly to your specific skin type.",
    icon: icons.skincare,
  },
  {
    title: "Hairstyle Recommendations",
    description: "Find the ideal haircut and styling techniques tailored to your face shape and hair texture.",
    icon: icons.hair,
  },
  {
    title: "Fashion & Outfit Suggestions",
    description: "Elevate your wardrobe with intelligent style advice curated for any occasion.",
    icon: icons.fashion,
  },
  {
    title: "Daily Routine Planner",
    description: "Build a sustainable, effective daily regimen that fits seamlessly into your busy lifestyle.",
    icon: icons.planner,
  },
  {
    title: "Product Recommendations",
    description: "Get unbiased, high-quality product suggestions that truly work for you.",
    icon: icons.products,
  },
];

const containerVariants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.1 },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

export default function FeaturesSection() {
  return (
    <section id="features" className="py-24 md:py-32 px-6 bg-[#FFFDF9]">
      <div className="mx-auto max-w-6xl">
        
        {/* Header */}
        <motion.div 
          className="text-center max-w-2xl mx-auto mb-16 md:mb-20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <h2 className="font-heading text-4xl md:text-5xl font-light tracking-tight text-[#2A2A2A] mb-6">
            Everything You Need to Look Your Best
          </h2>
          <p className="text-lg text-text-secondary leading-relaxed">
            Belle combines AI, personalization, and expert guidance to help you improve your appearance and confidence.
          </p>
        </motion.div>

        {/* Grid */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
        >
          {featuresData.map((feature, i) => (
            <motion.div
              key={i}
              variants={cardVariants}
              className="group flex flex-col p-8 rounded-2xl bg-white border border-[rgba(0,0,0,0.04)] shadow-[0_4px_24px_rgba(0,0,0,0.02)] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_12px_32px_rgba(201,135,102,0.12)] hover:border-[#C98766]/30"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#FAF5F0] text-[#C98766] mb-6 transition-transform duration-300 group-hover:scale-110">
                {feature.icon}
              </div>
              <h3 className="text-xl font-medium text-[#2A2A2A] mb-3">
                {feature.title}
              </h3>
              <p className="text-text-secondary leading-relaxed flex-grow">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  );
}
