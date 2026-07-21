import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  outputFileTracingRoot: process.cwd(),
  outputFileTracingIncludes: {
    "/api/secured-notes/**/*": ["./assets/secured-content/*.html"],
    "/api/secured-simulations/**/*": ["./assets/secured-content/*.html"],
  },
  async redirects() {
    return [
      { source: "/analytics", destination: "/dashboard", permanent: false },
      { source: "/planner", destination: "/dashboard", permanent: false },
      { source: "/practice/:path*", destination: "/dashboard", permanent: false },
      { source: "/mocks/:path*", destination: "/dashboard", permanent: false },
      { source: "/rank-map", destination: "/dashboard", permanent: false },
      { source: "/results/:path*", destination: "/dashboard", permanent: false },
      { source: "/diagnostic", destination: "/", permanent: false },
      { source: "/checkout/:path*", destination: "/pricing", permanent: false },
    ];
  },
  turbopack: {
    root: process.cwd(),
  },
};

export default nextConfig;
