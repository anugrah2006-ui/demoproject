"use client";

import { motion } from "motion/react";

export default function AboutSection() {
  return (
    <section id="about" className="py-24 md:py-32 px-6 bg-[#FFFDF9]">
      <div className="mx-auto max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          
          {/* Left Column: Image Placeholder */}
          <motion.div
            className="order-2 lg:order-1 relative aspect-square md:aspect-[4/5] w-full max-w-md mx-auto lg:max-w-none rounded-[2rem] overflow-hidden bg-[#FAF5F0] border border-[#E5D5C1] shadow-[0_8px_32px_rgba(201,135,102,0.1)] flex items-center justify-center"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            {/* Elegant placeholder content */}
            <div className="text-center p-8">
              <div className="inline-block h-16 w-16 rounded-full bg-white mb-6 shadow-sm flex items-center justify-center text-[#C98766]">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                  <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                  <line x1="12" y1="22.08" x2="12" y2="12" />
                </svg>
              </div>
              <p className="font-heading text-xl text-[#C98766] font-medium tracking-wide uppercase letter-spacing-widest">
                Belle Vision
              </p>
            </div>
            
            {/* Soft decorative glow behind placeholder */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-white opacity-40 blur-3xl rounded-full -z-10" />
          </motion.div>

          {/* Right Column: Text */}
          <motion.div
            className="order-1 lg:order-2"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <h2 className="font-heading text-4xl md:text-5xl lg:text-6xl font-light tracking-tight text-[#2A2A2A] mb-8">
              Meet Belle
            </h2>
            
            <div className="space-y-6 text-lg text-text-secondary leading-relaxed">
              <p>
                Belle is your premium AI grooming assistant, meticulously engineered to help you master skincare, hairstyle, fashion, and self-care. We believe that looking your best shouldn&apos;t require endless research or guesswork.
              </p>
              
              <div className="pt-4">
                <h3 className="font-medium text-[#2A2A2A] mb-2">Our Mission</h3>
                <p>
                  To democratize access to premium, expert-level personal styling and grooming advice, empowering individuals to present their best selves to the world with confidence and ease.
                </p>
              </div>
              
              <div className="pt-4">
                <h3 className="font-medium text-[#2A2A2A] mb-2">Our Vision</h3>
                <p>
                  A world where personalized, intelligent self-care is seamlessly integrated into daily life, helping everyone unlock their full aesthetic potential.
                </p>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
