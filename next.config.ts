/** @type {import('next').NextConfig} */
const nextConfig = {
  // 1. Fixes the "Cross origin request" warning for IP 10.5.0.2
  experimental: {
    allowedDevOrigins: ["localhost:3000", "10.5.0.2:3000"],
  },

  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self';",
              "script-src 'self' 'unsafe-eval' 'unsafe-inline';",
              "style-src 'self' 'unsafe-inline';",
              // Added https: to img-src so external test links work
              "img-src 'self' data: blob: https:;",
              "connect-src 'self' https://docs.google.com https://*.googleusercontent.com;",
              "media-src 'self' blob: https://sfmcompile.club https://v.redd.it https://*.googlevideo.com https://*.googleusercontent.com;",
              "frame-ancestors 'none';",
            ].join(" "),
          },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        ],
      },
    ];
  },
};

export default nextConfig;
