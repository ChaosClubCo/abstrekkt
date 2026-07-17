/** @type {import('next').NextConfig} */
const nextConfig = {
  // Security headers on every response
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          // Prevent framing (clickjacking)
          { key: "X-Frame-Options", value: "DENY" },
          // Block MIME sniffing
          { key: "X-Content-Type-Options", value: "nosniff" },
          // No referrer leakage
          { key: "Referrer-Policy", value: "no-referrer" },
          // No caching of assessment results
          {
            key: "Cache-Control",
            value: "no-store, no-cache, must-revalidate",
          },
          // Permissions policy — no camera, mic, geolocation needed
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
          // CSP — tighten after confirming Supabase domain
          // Fonts: fonts.googleapis.com + fonts.gstatic.com
          // QR: api.qrserver.com (img-src only, not connect-src)
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline'",  // Next.js requires unsafe-inline for hydration
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "font-src 'self' https://fonts.gstatic.com",
              "img-src 'self' data: https://api.qrserver.com",
              "connect-src 'self' https://*.supabase.co",  // API route is same-origin, no Anthropic here
            ].join("; "),
          },
        ],
      },
      // API routes: no caching, stricter
      {
        source: "/api/(.*)",
        headers: [
          { key: "Cache-Control", value: "no-store" },
          { key: "X-Content-Type-Options", value: "nosniff" },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
