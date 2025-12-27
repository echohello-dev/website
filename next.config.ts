import type { NextConfig } from "next";
import { withContentlayer } from "next-contentlayer2";

const nextConfig: NextConfig = {
  output: "export",
  basePath: process.env.NODE_ENV === "production" ? "/website" : "",
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
  turbopack: {},
};

export default withContentlayer(nextConfig);
