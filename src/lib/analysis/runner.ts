import type { Sandbox } from '@e2b/code-interpreter';
import { createSandbox, runPythonCode, destroySandbox, uploadTextFile } from '@/lib/e2b/Analysis';
import type { AnalysisResult } from '@/types/analysis';

export type AnalysisFilePayload = {
  id: string;
  name: string;
  content: string;
};

export type ExecuteAnalysisArgs = {
  code: string;
  files?: AnalysisFilePayload[];
};

export type ExecuteAnalysisResponse = {
  result: AnalysisResult;
  rawStdout: string;
  status: 'completed' | 'error' | 'unknown';
};

export async function executeAnalysis({ code, files = [] }: ExecuteAnalysisArgs): Promise<ExecuteAnalysisResponse> {
  const sandbox = await createSandbox();

  try {
    await ensurePythonDependencies(sandbox);

    for (const file of files) {
      await uploadTextFile(sandbox, file.name, file.content);
    }

    const execution = await runPythonCode(sandbox, code);
    const stdout = execution.logs?.stdout?.join('\n') ?? '';
    const stderr = execution.logs?.stderr?.join('\n') ?? '';

    const markerDetected = /ANALYSIS_COMPLETED/i.test(stdout);
    const completionMarker = /ANALYSIS_COMPLETED/gi;
    const status: ExecuteAnalysisResponse['status'] = execution.error
      ? 'error'
      : markerDetected
        ? 'completed'
        : 'unknown';

    const cleanedOutput = stdout.replace(completionMarker, '').trim();

    const result: AnalysisResult = {
      text: cleanedOutput || undefined,
      error: execution.error
        ? {
            name: execution.error.name,
            message: execution.error.value,
            traceback: stderr,
          }
        : undefined,
    };

    return {
      result,
      rawStdout: stdout,
      status,
    };
  } finally {
    await destroySandbox(sandbox);
  }
}

async function ensurePythonDependencies(sandbox: Sandbox) {
  const dependencyInstaller = `
import importlib
import subprocess
import sys

def ensure(package: str):
    if importlib.util.find_spec(package) is None:
        subprocess.run([sys.executable, '-m', 'pip', 'install', '--quiet', package], check=True)

for pkg in ['tabulate']:
    ensure(pkg)
`;

  await sandbox.runCode(dependencyInstaller);
}
