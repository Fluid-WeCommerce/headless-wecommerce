import type { NextConfig } from "next";

// Fluid serves images already resized by ImageKit, so FluidImage puts its
// renditions straight into `srcset` and no next/image hosts are configured.
// Add `images.remotePatterns` here if you use next/image for other images.
const nextConfig: NextConfig = {};

export default nextConfig;
