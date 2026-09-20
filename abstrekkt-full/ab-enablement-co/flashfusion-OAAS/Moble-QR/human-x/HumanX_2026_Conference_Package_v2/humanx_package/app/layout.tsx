/**
 * app/layout.tsx
 */
import type { Metadata, Viewport } from "next";

export const metadata: Metadata = {
  title: "Multi-Tenant AI Architecture Assessment | INT Inc.",
  description:
    "90-second assessment of your MSP data isolation patterns, compliance posture, and shadow IT exposure. Powered by Claude.",
  robots: { index: false, follow: false }, // Not for public indexing
  openGraph: {
    title: "Rate Your AI Architecture — INT Inc.",
    description: "Multi-tenant data isolation assessment for MSPs.",
    siteName: "INT Inc.",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1, // Prevent zoom breaking the wizard layout on mobile
  userScalable: false,
  themeColor: "#07090d",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link
          rel="preconnect"
          href="https://fonts.googleapis.com"
        />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700&family=JetBrains+Mono:wght@400;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body style={{ margin: 0, padding: 0, background: "#07090d" }}>
        {children}
      </body>
    </html>
  );
}
