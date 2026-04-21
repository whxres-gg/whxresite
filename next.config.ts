/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    allowedDevOrigins: ["localhost:3000", "26.186.84.110:3000"],
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
              "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://va.vercel-scripts.com;", 
              "style-src 'self' 'unsafe-inline';",
              "img-src 'self' data: blob: https: https://*.redgifs.com;",
              "connect-src 'self' https://docs.google.com https://*.google.com https://*.googleusercontent.com https://api.redgifs.com https://*.redgifs.com;",
              "media-src 'self' blob: https: https://*.redgifs.com https://media.redgifs.com https://*.jace.it;", 
              "frame-src 'self' https://www.redgifs.com;",
              "worker-src 'self' blob:;",
              "frame-ancestors 'none';",
            ].join(" "),
          },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          // Changed to 'no-referrer' to help bypass 403 blocks on the client-side
          { key: "Referrer-Policy", value: "no-referrer" },
        ],
      },
    ];
  },
};

export default nextConfig;