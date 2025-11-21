// src/lib/e2b/sandbox.ts
import { Sandbox } from '@e2b/code-interpreter';

export async function createE2bSandbox() {
  try {
    console.log('🚀 Creating E2B sandbox with MCP configuration...');

    // Create the sandbox with 5 minutes timeout
    const sandbox = await Sandbox.create({
      timeoutMs: 300000, // 5 minutes timeout
    });

    console.log('✅ Sandbox created successfully:', sandbox.sandboxId);

    // Return the sandbox so other functions can use it
    return sandbox;

  } catch (error: any) {
    console.error('❌ Failed to create sandbox:', error.message);
    throw new Error(`Sandbox creation failed: ${error.message}`);
  }
}

// Helper function to destroy sandboxes safely
export async function destroySandbox(sandbox: Sandbox) {
  try {
    await sandbox.kill();
    console.log('🗑️ Sandbox destroyed successfully');
  } catch (error: any) {
    console.error('⚠️ Error destroying sandbox:', error.message);
  }
}
