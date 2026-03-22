import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@repo/ui", "@repo/shared", "@repo/gql", "@repo/mdxSetup", "@repo/reduxSetup"],
  typescript: {
    ignoreBuildErrors: true,
  },

};

export default nextConfig;
