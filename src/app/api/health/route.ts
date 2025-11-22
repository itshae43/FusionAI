// src/app/api/health/route.ts

import { NextResponse } from 'next/server';

export async function GET() {
  const health = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    checks: {
      groq: !!process.env.GROQ_API_KEY,
      e2b: !!process.env.E2B_API_KEY,
      exa: !!process.env.EXA_API_KEY,
      supabase: !!(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY),
      supabaseAdmin: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
    },
  };

  const allHealthy = Object.values(health.checks).every(check => check === true);

  return NextResponse.json(health, {
    status: allHealthy ? 200 : 503,
  });
}
