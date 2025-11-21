// src/app/api/test-sandbox/route.ts
import { NextResponse } from 'next/server';
import { createE2bSandbox, destroySandbox } from '@/lib/e2b/sandbox';

export async function GET() {
  try {
    console.log('🧪 Testing E2B Sandbox...');
    
    // Test 1: Create sandbox
    const sandbox = await createE2bSandbox();

    // Test 2: Run simple code
    const execution = await sandbox.runCode(`
import sys
print(f"Python {sys.version}")
print("✅ E2B sandbox is working!")
    `);

    const output = execution.logs.stdout.join('\n');
    const errors = execution.logs.stderr.join('\n');

    // Test 3: Destroy sandbox
    await destroySandbox(sandbox);

    return NextResponse.json({
      success: true,
      sandboxId: sandbox.sandboxId,
      pythonOutput: output,
      pythonErrors: errors || null,
      message: 'Feature 1 complete! ✅',
    });

  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message,
        hint: 'Check your .env.local file for correct API keys'
      },
      { status: 500 }
    );
  }
}

