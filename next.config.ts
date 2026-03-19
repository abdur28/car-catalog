import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  turbopack: {
    root: path.resolve(__dirname),
  },
  images: {
    remotePatterns: [
      { hostname: "*.carsensor.net" },
      { hostname: "ccsrpcma.carsensor.net" },
      { hostname: "ccsrpcml.carsensor.net" },
      { hostname: "images.unsplash.com" },
      { hostname: "*.recruit.co.jp" },
    ],
  },
};

export default nextConfig;
