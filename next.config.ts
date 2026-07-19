import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    deviceSizes: [375, 640, 750],
    qualities: [75, 85],
  },
};

export default nextConfig;
