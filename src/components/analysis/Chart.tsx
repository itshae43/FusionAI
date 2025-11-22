'use client';

import type { ChartData } from '@/types/analysis';

// Step 1: debug-only chart renderer
// It just prints the structured chart data as JSON.
// We'll replace this with a real chart library later.
export function Chart({ chart }: { chart: ChartData }) {
  return (
    <pre className="text-xs bg-gray-900 text-gray-100 p-3 rounded-lg overflow-auto">
      {JSON.stringify(chart, null, 2)}
    </pre>
  );
}
