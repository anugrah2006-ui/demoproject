"use client";

import React from "react";

interface BelleLogoProps {
  /** If true, renders only the circular emblem mark */
  iconOnly?: boolean;
  /** Height in pixels (default 40px) */
  size?: number;
  /** Custom className wrapper */
  className?: string;
  /** Optional custom text color class or hex */
  textColor?: string;
  /** Show subtle metallic gradient fill on text */
  gradientText?: boolean;
}

export default function BelleLogo({
  iconOnly = false,
  size = 40,
  className = "",
  textColor,
  gradientText = true,
}: BelleLogoProps) {
  // Aspect ratio calculation for horizontal logo vs icon only
  const emblemWidth = size;
  const totalWidth = iconOnly ? size : Math.round(size * 3.4);
  const fontSize = Math.round(size * 0.72);

  return (
    <div
      className={`inline-flex items-center gap-3.5 select-none ${className}`}
      style={{ height: `${size}px` }}
    >
      {/* Emblem SVG */}
      <svg
        width={emblemWidth}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0 transition-transform duration-300 hover:scale-[1.03]"
        aria-label="Belle Emblem"
      >
        <defs>
          {/* Metallic Rose Gold Gradient */}
          <linearGradient
            id="belleRoseGold"
            x1="10"
            y1="10"
            x2="90"
            y2="90"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor="#E8C3A9" />
            <stop offset="35%" stopColor="#D79A72" />
            <stop offset="70%" stopColor="#C98766" />
            <stop offset="100%" stopColor="#B8764A" />
          </linearGradient>

          {/* Soft inner glow */}
          <radialGradient
            id="belleInnerGlow"
            cx="50%"
            cy="50%"
            r="48%"
          >
            <stop offset="60%" stopColor="#FAF8F4" stopOpacity="0" />
            <stop offset="100%" stopColor="#F5E8DD" stopOpacity="0.45" />
          </radialGradient>
        </defs>

        {/* Soft Background Tint */}
        <circle cx="50" cy="50" r="46" fill="url(#belleInnerGlow)" />

        {/* Ultra-thin Metallic Outer Ring */}
        <circle
          cx="50"
          cy="50"
          r="45.5"
          stroke="url(#belleRoseGold)"
          strokeWidth="2.25"
        />

        {/* Integrated 'B' + Female Profile + Flowing Hair Mark */}
        <g fill="url(#belleRoseGold)">
          {/* Main Stem & Profile Silhouette (Forehead, Nose, Lips, Chin, Neck) */}
          <path
            d="M34 26
               C34 26 31 32 30 36
               C29 40 25.5 44 23 46.5
               C22 47.5 24.5 48.5 26 48
               C27.5 47.5 29 46.5 30 47.5
               C31.2 48.7 28.5 50.5 27 52
               C25.5 53.5 27.5 54.8 29.5 54
               C31 53.4 33 51.5 34.5 53.5
               C36 55.5 31 60 28 62.5
               C25 65 24 67.5 26 67
               C28 66.5 33 63.5 36.5 60
               C39.5 57 41.5 52 41 46
               C40.5 40 37.5 32 34 26 Z"
            opacity="0.95"
          />

          {/* Flowing Upper Loop of 'B' merging into Hair */}
          <path
            d="M33 26.5
               C38 23 48 22 56 26.5
               C64 31 66 39.5 61 45.5
               C56 51.5 44 51.5 37 47.5
               C35 46.3 36.5 44 38.5 45.2
               C44.5 48.8 53.5 48.5 57.5 43.5
               C61.5 38.5 59.5 32.5 53 29
               C46.5 25.5 38 26.5 33 26.5 Z"
          />

          {/* Flowing Lower Loop of 'B' cascading down into elegant locks */}
          <path
            d="M36.5 47.5
               C43.5 47.5 57.5 48 64 54.5
               C71 61.5 67.5 72.5 58 76.5
               C47.5 81 36.5 78.5 29 72
               C27.5 70.7 29.5 68.8 31 70
               C37.5 75.5 47 77 55.5 73.5
               C63 70.3 65.5 61.5 60 56
               C54.5 50.5 42.5 50.5 36.5 47.5 Z"
          />

          {/* Secondary Inner Hair Strand Accent */}
          <path
            d="M38 31
               C43 27.5 51 28 56.5 32
               C61.5 35.5 61 41 56 44.5
               C51 48 42 46.5 38 43
               C37 42.1 38.2 40.5 39.2 41.3
               C42.5 44 49.5 45.2 53.5 42.5
               C57.5 39.8 57.8 35.5 54 32.8
               C49.5 29.6 42.5 29.2 38 31 Z"
            opacity="0.85"
          />

          {/* Lower Hair Sweep Accent */}
          <path
            d="M39 53
               C45 53 54 55 58.5 59.5
               C63 64 61.5 71 54 73.5
               C46.5 76 38 73 34 68.5
               C33 67.4 34.4 65.8 35.5 66.8
               C38.8 70.6 46 73 52.5 70.8
               C58.5 68.7 59.5 63.3 55.8 59.8
               C52 56.2 44.5 54.5 39 53 Z"
            opacity="0.8"
          />

          {/* Signature 4-Point AI & Beauty Sparkle (Upper Right) */}
          <path d="M72 24 C72 27.5 72 31 75.5 31 C72 31 72 34.5 72 38 C72 34.5 72 31 68.5 31 C72 31 72 27.5 72 24 Z" />
        </g>
      </svg>

      {/* Typography "Belle" */}
      {!iconOnly && (
        <span
          className={`font-serif tracking-[0.08em] font-medium leading-none ${
            textColor || ""
          }`}
          style={{
            fontSize: `${fontSize}px`,
            ...(gradientText && !textColor
              ? {
                  background:
                    "linear-gradient(135deg, #E8C3A9 0%, #D79A72 40%, #C98766 75%, #B8764A 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }
              : {}),
          }}
        >
          Belle
        </span>
      )}
    </div>
  );
}
