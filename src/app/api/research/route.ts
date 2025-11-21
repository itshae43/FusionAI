// src/app/api/research/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { createE2bSandbox, destroySandbox } from '@/lib/e2b/sandbox';
import { conductExternalResearch } from '@/lib/e2b/research';

export async function POST(req: NextRequest) {
  try {
    // Step 1: Get the query from the request body
    const { query, numResults, type } = await req.json();

    // Validate input
    if (!query || typeof query !== 'string') {
      return NextResponse.json(
        { error: 'Query is required and must be a string' },
        { status: 400 }
      );
    }

    console.log(`📥 Received research request: "${query}"`);

    // Step 2: Create E2B sandbox with Exa MCP
    const sandbox = await createE2bSandbox();

    try {
      // Step 3: Conduct research
      const results = await conductExternalResearch(sandbox, {
        query,
        numResults: numResults || 10,
        type: type || 'auto',
      });

      // Step 4: Return results
      return NextResponse.json({
        success: true,
        query,
        resultsCount: results.length,
        results,
      });

    } finally {
      // Step 5: ALWAYS clean up sandbox (even if error)
      await destroySandbox(sandbox);
      console.log('🗑️ Sandbox destroyed');
    }

  } catch (error: any) {
    console.error('❌ API error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error.message 
      },
      { status: 500 }
    );
  }
}
