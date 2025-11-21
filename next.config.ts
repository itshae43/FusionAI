import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    E2B_API_KEY: process.env.E2B_API_KEY,
    EXA_API_KEY: process.env.EXA_API_KEY,
    BROWSERBASE_API_KEY: process.env.BROWSERBASE_API_KEY,
    BROWSERBASE_PROJECT_ID: process.env.BROWSERBASE_PROJECT_ID,
    GEMINI_API_KEY: process.env.GEMINI_API_KEY,
  },
};

export default nextConfig;
