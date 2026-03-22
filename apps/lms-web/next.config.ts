import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@repo/ui", "@repo/mdxSetup", "@repo/gql", "@repo/reduxSetup"],
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
