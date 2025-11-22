import { Sandbox } from '@e2b/code-interpreter';

// Create a sandbox with a generous timeout
export async function createSandbox() {
  const sandbox = await Sandbox.create({
    timeoutMs: 300_000, // 5 minutes
  });

  return sandbox;
}

// Run Python code inside the sandbox and collect logs + error
export async function runPythonCode(sandbox: Sandbox, code: string) {
  const execution = await sandbox.runCode(code);

  return execution;
}

// Always clean up after yourself
export async function destroySandbox(sandbox: Sandbox) {
  try {
    await sandbox.kill();
  } catch {
    // ignore errors on cleanup
  }
}

// Upload a single text file (e.g. CSV) into the sandbox filesystem
export async function uploadTextFile(
  sandbox: Sandbox,
  fileName: string,
  content: string,
) {
  await sandbox.files.write(fileName, content);
}
