// test-sandbox.ts - Quick test script
import { config } from 'dotenv';
import { createE2bSandbox, destroySandbox } from './src/lib/e2b/sandbox.js';

// Load .env file
config();

async function test() {
  try {
    console.log('\n🧪 Starting E2B Sandbox Test...\n');
    
    // Create sandbox
    const sandbox = await createE2bSandbox();
    
    // Run Python code
    const execution = await sandbox.runCode(`
import sys
print(f"Python {sys.version}")
print("✅ E2B sandbox is working!")
print("📦 MCP Config loaded successfully!")
    `);
    
    console.log('\n📤 Python Output:');
    console.log(execution.logs.stdout.join(''));
    
    if (execution.logs.stderr.length > 0) {
      console.log('\n⚠️ Errors:');
      console.log(execution.logs.stderr.join(''));
    }
    
    // Clean up
    await destroySandbox(sandbox);
    
    console.log('\n✅ Test completed successfully!\n');
    
  } catch (error: any) {
    console.error('\n❌ Test failed:', error.message);
    console.log('\n💡 Hint: Check your .env file for correct API keys\n');
    process.exit(1);
  }
}

test();
