import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@repo/ui", "@repo/shared", "@repo/gql"],
  typescript: {
    ignoreBuildErrors: true,
  },

};

export default nextConfig;
