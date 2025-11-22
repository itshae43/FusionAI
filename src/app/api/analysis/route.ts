import { NextRequest, NextResponse } from 'next/server';
import { executeAnalysis } from '@/lib/analysis/runner';
import type { AnalysisFilePayload } from '@/lib/analysis/runner';

export const maxDuration = 60;


export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const code = body?.code as string | undefined;
    const files = (body?.files ?? []) as AnalysisFilePayload[];

    if (!code || typeof code !== 'string') {
      return NextResponse.json(
        { error: 'Missing "code" field in request body' },
        { status: 400 },
      );
    }

    const { result, status } = await executeAnalysis({ code, files });

    return NextResponse.json({ success: true, result, status });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    const stack = error instanceof Error ? error.stack ?? '' : '';

    return NextResponse.json(
      {
        success: false,
        result: {
          error: {
            name: 'ServerError',
            message,
            traceback: stack,
          },
        },
      },
      { status: 500 },
    );
  }
}
