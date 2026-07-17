import type { Metadata } from "next";
import "./globals.css";
import { Cursor } from "@/components/Cursor";

export const metadata: Metadata = {
  title: "Kyle Rosebrook — Staff Engineer & AI SME",
  description:
    "Security-first platform engineer building production AI systems, automation, and internal platforms. Staff Engineer at Intinc. AppSec & Platform. AI SME.",
  openGraph: {
    title: "Kyle Rosebrook — Staff Engineer & AI SME",
    description:
      "Security-first platform engineer building production AI systems, automation, and internal platforms.",
    url: "https://krosebrook.com",
    siteName: "Kyle Rosebrook",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Kyle Rosebrook — Staff Engineer & AI SME",
    description:
      "Security-first platform engineer building production AI systems, automation, and internal platforms.",
    creator: "@krosebrook",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Cursor />
        {children}
      </body>
    </html>
  );
}
