import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  images: {
    unoptimized: true,
  },
  // Dev-only: proxy /backend and /admin to a local PHP server so the two can be
  // tested together on one origin. Never runs during `next build` (static export
  // has no server, and production serves both from the same Apache/cPanel host
  // anyway), so this has zero effect on the deployed site.
  ...(process.env.NODE_ENV !== "production"
    ? {
        async rewrites() {
          return [
            { source: "/backend/:path*", destination: "http://localhost:8090/backend/:path*" },
            { source: "/admin/:path*", destination: "http://localhost:8090/admin/:path*" },
            { source: "/uploads/:path*", destination: "http://localhost:8090/uploads/:path*" },
          ];
        },
      }
    : {}),
};

export default nextConfig;
