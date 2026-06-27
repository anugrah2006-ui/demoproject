"use client";

import { motion } from "motion/react";

const testimonials = [
  {
    name: "James Carter",
    role: "Marketing Director",
    text: "Belle completely changed how I approach my mornings. The personalized skincare routine it built for me cleared up my skin in weeks, and I feel more confident walking into board meetings.",
    initials: "JC",
  },
  {
    name: "Michael Chen",
    role: "Software Engineer",
    text: "I used to hate shopping and never knew what to wear. Belle's style advice is spot-on. It suggested outfits that fit my body type perfectly without feeling too flashy. Highly recommend.",
    initials: "MC",
  },
  {
    name: "David Smith",
    role: "Entrepreneur",
    text: "As someone who travels constantly, having a pocket grooming assistant is invaluable. From finding the right hair product to adjusting my routine for different climates, Belle does it all.",
    initials: "DS",
  },
];

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.15 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

export default function TestimonialsSection() {
  return (
    <section id="testimonials" className="py-24 md:py-32 px-6 bg-[#FAF8F5]">
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
            Loved by People Improving Their Lifestyle
          </h2>
        </motion.div>

        {/* Grid */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
        >
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              variants={cardVariants}
              className="flex flex-col p-8 rounded-2xl bg-white border border-[rgba(0,0,0,0.04)] shadow-[0_4px_24px_rgba(0,0,0,0.03)] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_12px_32px_rgba(201,135,102,0.12)] hover:border-[#C98766]/30"
            >
              {/* Stars */}
              <div className="flex gap-1 mb-6 text-[#C98766]">
                {[...Array(5)].map((_, idx) => (
                  <svg key={idx} width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="none">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                ))}
              </div>
              
              <p className="text-text-secondary leading-relaxed flex-grow mb-8 italic">
                "{t.text}"
              </p>
              
              <div className="flex items-center gap-4 mt-auto">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#E8DCC4] text-[#C98766] font-medium font-heading">
                  {t.initials}
                </div>
                <div>
                  <h4 className="font-medium text-[#2A2A2A]">{t.name}</h4>
                  <p className="text-sm text-text-secondary">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  );
}
