// src/lib/sandbox.ts
import Sandbox from 'e2b';

export async function createE2bSandbox() {
  // Step 1: Define MCP configuration
  const mcpConfig = {
    exa: {
      apiKey: process.env.EXA_API_KEY!,
    },
    browserbase: {
      apiKey: process.env.BROWSERBASE_API_KEY!,
      geminiApiKey: process.env.GEMINI_API_KEY!,
      projectId: process.env.BROWSERBASE_PROJECT_ID!,
    }
  };

  try {
    console.log('Creating E2B sandbox with Docker MCPs...');

    // Step 2: Actually CREATE the sandbox (this was missing!)
    const sandbox = await Sandbox.create({
      mcp: mcpConfig,
      timeout: 300000, // 5 minutes timeout
    });

    console.log('Sandbox created successfully:', sandbox.id);

    // Step 3: Return the sandbox so other functions can use it
    return sandbox;

  } catch (error: any) {
    console.error('Failed to create sandbox:', error.message);
    throw new Error(`Sandbox creation failed: ${error.message}`);
  }
}

// Bonus: Helper function to destroy sandboxes safely
export async function destroySandbox(sandbox: Sandbox) {
  try {
    await sandbox.kill();
    console.log('Sandbox destroyed successfully');
  } catch (error: any) {
    console.error('Error destroying sandbox:', error.message);
  }
}

