"use client";

import { motion } from "motion/react";

const steps = [
  {
    number: "1",
    title: "Create your profile",
    description: "Start by setting up your unique physical profile and lifestyle preferences.",
  },
  {
    number: "2",
    title: "Tell Belle about your goals",
    description: "Share what you want to achieve, whether it's clearer skin or a style upgrade.",
  },
  {
    number: "3",
    title: "Receive AI-powered recommendations",
    description: "Get deeply personalized advice and routines generated specifically for you.",
  },
  {
    number: "4",
    title: "Track your progress",
    description: "Log your daily routines and watch your confidence and appearance improve.",
  },
];

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.15 } },
};

const stepVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

export default function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-24 md:py-32 px-6 bg-[#FAF8F5]">
      <div className="mx-auto max-w-5xl">
        
        {/* Header */}
        <motion.div 
          className="text-center mb-20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <h2 className="font-heading text-4xl md:text-5xl font-light tracking-tight text-[#2A2A2A]">
            How Belle Works
          </h2>
        </motion.div>

        {/* Steps Container */}
        <motion.div 
          className="relative"
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
        >
          {/* Subtle connecting line (Desktop only) */}
          <div className="hidden md:block absolute top-10 left-12 right-12 h-[1px] bg-gradient-to-r from-transparent via-[#C98766]/30 to-transparent" />

          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-6">
            {steps.map((step, i) => (
              <motion.div key={i} variants={stepVariants} className="relative flex flex-col items-center text-center">
                
                {/* Connecting line (Mobile only) */}
                {i !== steps.length - 1 && (
                  <div className="md:hidden absolute top-20 bottom-[-3rem] left-1/2 w-[1px] -translate-x-1/2 bg-gradient-to-b from-[#C98766]/30 to-transparent z-0" />
                )}

                {/* Number Circle */}
                <div className="relative z-10 flex h-20 w-20 items-center justify-center rounded-full bg-white border border-[#E5D5C1] shadow-[0_4px_20px_rgba(201,135,102,0.1)] mb-6 transition-transform hover:scale-105 duration-300">
                  <span className="font-heading text-2xl text-[#C98766]">{step.number}</span>
                </div>
                
                <h3 className="text-xl font-medium text-[#2A2A2A] mb-3 px-2">
                  {step.title}
                </h3>
                <p className="text-text-secondary leading-relaxed px-4">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

      </div>
    </section>
  );
}
