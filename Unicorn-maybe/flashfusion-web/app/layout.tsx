import type { Metadata } from "next";
import { Space_Mono, Syncopate, Syne } from "next/font/google";
import "./globals.css";

const syncopate = Syncopate({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-syncopate",
});

const spaceMono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-space-mono",
});

const syne = Syne({
  subsets: ["latin"],
  weight: ["400", "600", "800"],
  variable: "--font-syne",
});

export const metadata: Metadata = {
  title: "FlashFusion - Ignite the Signal",
  description:
    "Production infrastructure for agent-native products. Build the agent internet. Any vertical. Ship in days.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${syncopate.variable} ${spaceMono.variable} ${syne.variable}`}
      >
        {children}
      </body>
    </html>
  );
}
