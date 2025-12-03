import type { NextConfig } from "next";
import withPWAInit from "next-pwa";

const isProd = process.env.NODE_ENV === "production";

const withPWA = withPWAInit({
  dest: "public",
  disable: !isProd,
  register: false,
  scope: "/",
  sw: "sw.js",
  swSrc: "public/sw.js",
  runtimeCaching: [],
});

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
  },
  turbopack: {},
};

export default withPWA(nextConfig);
