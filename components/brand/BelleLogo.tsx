"use client";

import React from "react";
import Image from "next/image";

export interface BelleLogoProps {
  /** If true, renders only the circular emblem mark */
  iconOnly?: boolean;
  /** Height in pixels (default 46px) */
  size?: number;
  /** Color theme variant (kept for API compatibility) */
  variant?: "gradient" | "light" | "dark" | "monochrome";
  /** Custom className wrapper */
  className?: string;
}

export default function BelleLogo({
  iconOnly = false,
  size = 46,
  className = "",
}: BelleLogoProps) {
  if (iconOnly) {
    return (
      <div
        className={`inline-flex items-center justify-center select-none ${className}`}
        style={{ width: `${size}px`, height: `${size}px` }}
      >
        <Image
          src="/belle-icon.svg"
          alt="Belle AI — Circular Emblem Logo Mark"
          width={size}
          height={size}
          className="h-full w-full object-contain transition-transform duration-300 hover:scale-[1.03]"
          priority
        />
      </div>
    );
  }

  const calculatedWidth = Math.round(size * 2.334);

  return (
    <div
      className={`inline-flex items-center select-none ${className}`}
      style={{ height: `${size}px` }}
    >
      <Image
        src="/belle-logo.svg"
        alt="Belle — Your Personal AI Grooming Assistant Logo"
        width={calculatedWidth}
        height={size}
        className="h-full w-auto object-contain transition-transform duration-300 hover:scale-[1.02]"
        style={{ height: `${size}px` }}
        priority
      />
    </div>
  );
}
