import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Belle — Your Personal AI Grooming Assistant",
  description:
    "Elevate your grooming and lifestyle with Belle's intelligent, personalized advice. Expert grooming tips, curated style advice, and tailored skincare plans.",
  keywords: [
    "grooming",
    "AI assistant",
    "skincare",
    "style advice",
    "personal grooming",
  ],
  openGraph: {
    title: "Belle — Your Personal AI Grooming Assistant",
    description:
      "Elevate your grooming and lifestyle with Belle's intelligent, personalized advice.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${playfairDisplay.variable} ${inter.variable}`}>
      <body className="bg-ivory text-text-primary antialiased">
        {children}
      </body>
    </html>
  );
}
