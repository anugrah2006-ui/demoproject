import FeatureCard from "./FeatureCard";

/* ── Inline SVG Icons ── */

function GroomingIcon() {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Razor / grooming icon */}
      <rect
        x="8"
        y="6"
        width="16"
        height="12"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <line
        x1="8"
        y1="12"
        x2="24"
        y2="12"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M14 18V26"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M18 18V26"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M12 26H20"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function StyleIcon() {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* T-shirt / fashion icon */}
      <path
        d="M12 6L8 8L6 14L10 15V26H22V15L26 14L24 8L20 6"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      <path
        d="M12 6C12 6 13 10 16 10C19 10 20 6 20 6"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function SkincareIcon() {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Leaf / skincare icon */}
      <path
        d="M16 28C16 28 6 20 6 13C6 8 10 4 16 4C22 4 26 8 26 13C26 20 16 28 16 28Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M16 28V16"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M16 18C16 18 12 15 10 12"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

/* ── Feature data ── */

const features = [
  {
    icon: <GroomingIcon />,
    title: "Grooming Tips",
    description: "Expert guidance",
  },
  {
    icon: <StyleIcon />,
    title: "Style Advice",
    description: "Curated for you",
  },
  {
    icon: <SkincareIcon />,
    title: "Skincare Plans",
    description: "Tailored solutions",
  },
] as const;

export default function FeatureCards() {
  return (
    <section
      className="mx-auto grid max-w-4xl grid-cols-1 gap-5 px-6 py-0 -mt-8 md:-mt-11 md:grid-cols-3 md:py-0 relative z-10"
      aria-label="Features"
    >
      {features.map((feature, index) => (
        <FeatureCard
          key={feature.title}
          icon={feature.icon}
          title={feature.title}
          description={feature.description}
          index={index}
        />
      ))}
    </section>
  );
}
