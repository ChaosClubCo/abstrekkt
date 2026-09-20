import type { Metadata } from "next";
import { Fraunces, Crimson_Pro, JetBrains_Mono, Space_Mono, Syncopate, Syne } from "next/font/google";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const crimsonPro = Crimson_Pro({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

const syncopate = Syncopate({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-syncopate",
  display: "swap",
});

const spaceMono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-space-mono",
  display: "swap",
});

const syne = Syne({
  subsets: ["latin"],
  weight: ["400", "600", "800"],
  variable: "--font-syne",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Kyle Rosebrook | Abstrekkt",
  description:
    "Self-taught AI practitioner. I build AI-assisted systems and write about what holds under load.",
  openGraph: {
    title: "Kyle Rosebrook | Abstrekkt",
    description:
      "Self-taught AI practitioner. I build AI-assisted systems and write about what holds under load.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${fraunces.variable} ${crimsonPro.variable} ${jetbrainsMono.variable} ${syncopate.variable} ${spaceMono.variable} ${syne.variable} bg-ink text-paper antialiased selection:bg-ember selection:text-ink`}
      >
        {children}
      </body>
    </html>
  );
}
