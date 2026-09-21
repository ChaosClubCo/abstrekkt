import type { Metadata, Viewport } from "next";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: {
    default: "Nexora — The AI Business Engine",
    template: "%s | Nexora",
  },
  description:
    "The AI-powered all-in-one business platform. CRM, Calendar, Learning & Community for Coaches, Creators & Entrepreneurs.",
  keywords: [
    "CRM", "coaching platform", "business management", "AI assistant",
    "community platform", "appointment booking", "online courses",
    "network marketing", "sales pipeline", "automation",
  ],
  authors: [{ name: "Nexora" }],
  creator: "Nexora",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://nexora.app",
    siteName: "Nexora",
    title: "Nexora — The AI Business Engine",
    description:
      "CRM, Calendar, Learning & Community — all in one place. AI-powered platform for Coaches, Creators & Entrepreneurs.",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Nexora — The AI Business Engine",
    description:
      "CRM, Calendar, Learning & Community — all in one place.",
    images: ["/og-image.png"],
  },
  robots: { index: true, follow: true },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0f0f11" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&family=Caveat:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-body antialiased min-h-screen bg-background text-foreground">
        {children}
      </body>
    </html>
  );
}
