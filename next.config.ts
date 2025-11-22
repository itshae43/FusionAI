import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Environment variables exposed to browser
  env: {
    E2B_API_KEY: process.env.E2B_API_KEY,
    EXA_API_KEY: process.env.EXA_API_KEY,
    BROWSERBASE_API_KEY: process.env.BROWSERBASE_API_KEY,
    BROWSERBASE_PROJECT_ID: process.env.BROWSERBASE_PROJECT_ID,
    GEMINI_API_KEY: process.env.GEMINI_API_KEY,
  },
  
  // Optimize production builds
  poweredByHeader: false,
  
  // Enable strict mode for better error catching
  reactStrictMode: true,
  
  // Optimize images (if using next/image)
  images: {
    formats: ['image/avif', 'image/webp'],
  },
};

export default nextConfig;
