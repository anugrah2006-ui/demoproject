"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useAuthNavigation } from "@/hooks/useAuthNavigation";
import AuthLoadingOverlay from "@/components/auth/AuthLoadingOverlay";
import BelleLogo from "@/components/brand/BelleLogo";

const navLinks = [
  { name: "Features", href: "#features" },
  { name: "How It Works", href: "#how-it-works" },
  { name: "Benefits", href: "#benefits" },
  { name: "Testimonials", href: "#testimonials" },
  { name: "About", href: "#about" },
];

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const { navigateWithAuthCheck, isChecking } = useAuthNavigation();

  // Handle smooth scrolling
  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>, href: string) => {
    if (href.startsWith("#")) {
      e.preventDefault();
      const targetId = href.replace("#", "");
      const elem = document.getElementById(targetId);
      if (elem) {
        elem.scrollIntoView({ behavior: "smooth" });
        setIsMobileMenuOpen(false);
      }
    }
  };

  // Scroll spy
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: "-20% 0px -80% 0px" }
    );

    navLinks.forEach((link) => {
      const id = link.href.replace("#", "");
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <>
      <header className="sticky top-0 z-50 w-full bg-[#FFFDF9] border-b border-[rgba(0,0,0,0.05)] transition-colors duration-300">
        <nav
        className="mx-auto flex h-[88px] md:h-[96px] max-w-[1400px] items-center justify-between px-5 md:px-8 lg:px-12"
        role="navigation"
        aria-label="Main navigation"
      >
        {/* Left: Logo */}
        <div className="relative flex items-center">
          {/* Champagne radial glow */}
          <div className="absolute left-1/2 top-1/2 -z-10 h-16 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#E5D5C1] opacity-70 blur-xl" />
          
          <Link
            href="#"
            onClick={(e) => {
               e.preventDefault();
               window.scrollTo({ top: 0, behavior: "smooth" });
               setActiveSection("");
            }}
            aria-label="Belle home"
          >
            <BelleLogo size={42} />
          </Link>
        </div>

        {/* Center: Desktop Links */}
        <div className="absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 lg:flex items-center gap-10 xl:gap-12">
          {navLinks.map((link) => {
            const isActive = activeSection === link.href.replace("#", "");
            return (
              <Link
                key={link.name}
                href={link.href}
                onClick={(e) => handleScroll(e, link.href)}
                className={`text-base font-medium transition-colors duration-250 ${
                  isActive ? "text-[#C98766]" : "text-[#2A2A2A] hover:text-[#C98766]"
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-6">
          <button
            type="button"
            onClick={navigateWithAuthCheck}
            className="hidden md:block text-base font-medium text-[#2A2A2A] transition-colors duration-250 hover:text-[#C98766]"
          >
            Log in
          </button>
          
          <button
            type="button"
            onClick={navigateWithAuthCheck}
            className="flex h-[48px] md:h-[52px] items-center justify-center rounded-full bg-gradient-to-r from-[#C98766] to-[#B87554] px-7 md:px-8 text-base font-medium text-white shadow-[0_4px_16px_rgba(201,135,102,0.25)] transition-all duration-250 hover:scale-[1.02] hover:from-[#B87554] hover:to-[#A76343] hover:shadow-[0_6px_24px_rgba(201,135,102,0.35)]"
          >
            Get Started
          </button>

          {/* Mobile Hamburger Toggle */}
          <button
            type="button"
            className="flex flex-col justify-center gap-1.5 p-2 lg:hidden text-[#2A2A2A]"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <span className={`block h-[2px] w-6 bg-current transition-transform duration-300 ${isMobileMenuOpen ? "translate-y-[8px] rotate-45" : ""}`} />
            <span className={`block h-[2px] w-6 bg-current transition-opacity duration-300 ${isMobileMenuOpen ? "opacity-0" : ""}`} />
            <span className={`block h-[2px] w-6 bg-current transition-transform duration-300 ${isMobileMenuOpen ? "-translate-y-[8px] -rotate-45" : ""}`} />
          </button>
        </div>
      </nav>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="border-t border-[rgba(0,0,0,0.05)] bg-[#FFFDF9] lg:hidden overflow-hidden"
          >
            <div className="flex flex-col space-y-4 px-6 py-6">
              {navLinks.map((link) => {
                const isActive = activeSection === link.href.replace("#", "");
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={(e) => handleScroll(e, link.href)}
                    className={`text-lg font-medium ${
                      isActive ? "text-[#C98766]" : "text-[#2A2A2A] hover:text-[#C98766]"
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}
              <div className="mt-4 pt-4 border-t border-[rgba(0,0,0,0.05)]">
                 <button
                  type="button"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    navigateWithAuthCheck();
                  }}
                  className="text-lg font-medium text-[#2A2A2A] hover:text-[#C98766] text-left w-full"
                >
                  Log in
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
      <AuthLoadingOverlay isVisible={isChecking} />
    </>
  );
}
