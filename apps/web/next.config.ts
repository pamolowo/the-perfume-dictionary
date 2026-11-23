import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  // Container build: a minimal self-contained server in .next/standalone (see apps/web/Dockerfile).
  output: "standalone",
  // Monorepo: trace files from the repo root so the workspace package (packages/api-client) is included.
  outputFileTracingRoot: path.join(__dirname, "../../"),
  transpilePackages: ["@tpd/api-client"],
  poweredByHeader: false,
  turbopack: {
    rules: { "*.css": { loaders: ["@tailwindcss/turbopack"], as: "*.css" } },
  },
};

export default nextConfig;
