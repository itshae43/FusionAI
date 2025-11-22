'use client';

import { Loader2 } from 'lucide-react';
import type { AnalysisResult } from '@/types/analysis';

interface AnalysisOutputProps {
  result: AnalysisResult;
  status: 'running' | 'completed' | 'error';
}

export function AnalysisOutput({ result, status }: AnalysisOutputProps) {
  if (status === 'running') {
    return (
      <div className="border border-dashed border-gray-300 bg-white rounded-lg p-3 text-sm flex items-center gap-2 text-gray-600">
        <Loader2 className="w-4 h-4 animate-spin" />
        Analyzing data in secure sandbox...
      </div>
    );
  }

  if (result.error) {
    return (
      <div className="border border-red-300 bg-red-50 text-red-800 rounded-lg p-3 text-sm">
        <div className="font-semibold mb-1">
          Error: {result.error.name}
        </div>
        <div className="mb-1">{result.error.message}</div>
        <pre className="text-xs overflow-auto max-h-40 whitespace-pre-wrap">
          {result.error.traceback}
        </pre>
      </div>
    );
  }

  if (result.text) {
    return (
      <div className="border border-gray-200 bg-gray-50 rounded-lg p-3 text-sm space-y-2">
        <div className="text-xs uppercase tracking-wide text-gray-500 font-semibold">
          Terminal · {status === 'completed' ? 'Analysis completed' : 'Output'}
        </div>
        <pre className="whitespace-pre-wrap">{result.text}</pre>
      </div>
    );
  }

  // Nothing to show yet (no text, no error, no chart)
  return null;
}
