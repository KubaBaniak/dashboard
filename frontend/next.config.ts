import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",

  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${process.env.NEXT_API_PROXY}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
