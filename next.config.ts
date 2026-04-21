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
              "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://unpkg.com blob:;", 
              "style-src 'self' 'unsafe-inline';",
              "img-src 'self' data: blob: https:;",
              // Connect-src handles the fetching of CSVs and WASM files
              "connect-src 'self' https://docs.google.com https://*.googleusercontent.com https://unpkg.com blob: https://*.googlevideo.com;",
              // Media-src needs https: to allow external video streams
              "media-src 'self' blob: https: https://sfmcompile.club https://v.redd.it https://*.googlevideo.com https://*.googleusercontent.com;",
              "worker-src 'self' blob:;",
              "frame-ancestors 'none';",
            ].join(" "),
          },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          // REQUIRED FOR FFMPEG MULTITHREADING
          { key: "Cross-Origin-Embedder-Policy", value: "require-corp" },
          { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
        ],
      },
    ];
  },
};

export default nextConfig;