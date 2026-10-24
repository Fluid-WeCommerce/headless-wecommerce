import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The dev server only serves its scripts to localhost by default. Allow
  // 127.0.0.1 too: the Fairshare SDK sends checkout to Fluid's local checkout
  // server on any "localhost" hostname, so checkout is tested on 127.0.0.1.
  allowedDevOrigins: ["127.0.0.1"],
};

// Fluid serves images already resized by ImageKit, so FluidImage puts its
// renditions straight into `srcset` and no next/image hosts are configured.
// Add `images.remotePatterns` here if you use next/image for other images.

export default nextConfig;
