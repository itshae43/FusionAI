import { NextRequest, NextResponse } from 'next/server';
import Groq from 'groq-sdk';
import Papa from 'papaparse';
import { getSupabaseAdmin } from '@/lib/supabase';
import { executeAnalysis } from '@/lib/analysis/runner';
import type { AnalysisFilePayload } from '@/lib/analysis/runner';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const MODEL = 'llama-3.3-70b-versatile';

export const maxDuration = 60;

export async function POST(req: NextRequest) {
  try {
    const { question, fileIds } = await req.json();

    if (!question || typeof question !== 'string') {
      return NextResponse.json({ error: 'Question is required' }, { status: 400 });
    }

    if (!Array.isArray(fileIds) || fileIds.length === 0) {
      return NextResponse.json({ error: 'At least one file must be selected for analysis' }, { status: 400 });
    }

    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json({ error: 'GROQ_API_KEY is not configured' }, { status: 500 });
    }

    const { files, contextSummary } = await loadFilesAndSummaries(fileIds);

    if (files.length === 0) {
      return NextResponse.json({ error: 'Unable to load the requested files' }, { status: 404 });
    }

    const systemPrompt = buildSystemPrompt(contextSummary, files.map((file) => file.name));

    const completion = await groq.chat.completions.create({
      model: MODEL,
      temperature: 0.15,
      max_tokens: 1800,
      messages: [
        {
          role: 'system',
          content: systemPrompt,
        },
        {
          role: 'user',
          content: question,
        },
      ],
    });

    const rawResponse = completion.choices?.[0]?.message?.content ?? '';
    const pythonCode = extractPythonCode(rawResponse);

    if (!pythonCode) {
      return NextResponse.json({ error: 'Model did not return Python code' }, { status: 422 });
    }

    const { result, rawStdout, status } = await executeAnalysis({
      code: pythonCode,
      files: files.map<AnalysisFilePayload>((file) => ({
        id: file.id,
        name: file.name,
        content: file.content,
      })),
    });

    return NextResponse.json({
      success: !result.error,
      status,
      stdout: result.text,
      rawStdout,
      code: pythonCode,
      files: files.map((file) => ({
        id: file.id,
        name: file.name,
        columns: file.columns,
      })),
      error: result.error,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Analysis request failed';
    console.error('chat/analyze error:', message);
    return NextResponse.json(
      { error: message },
      { status: 500 },
    );
  }
}

type LoadedFile = {
  id: string;
  name: string;
  content: string;
  columns: string[];
  samples: Array<Record<string, unknown>>;
};

type LoadedFilesResponse = {
  files: LoadedFile[];
  contextSummary: string;
};

async function loadFilesAndSummaries(fileIds: string[]): Promise<LoadedFilesResponse> {
  const supabaseAdmin = getSupabaseAdmin();

  const { data, error } = await supabaseAdmin
    .from('files')
    .select('id, name, file_path')
    .in('id', fileIds);

  if (error) {
    throw new Error(`Failed to load file metadata: ${error.message}`);
  }

  const files: LoadedFile[] = [];

  for (const file of data ?? []) {
    const { data: fileBuffer, error: downloadError } = await supabaseAdmin
      .storage
      .from('e2b')
      .download(file.file_path);

    if (downloadError || !fileBuffer) {
      console.warn(`Could not download ${file.name}:`, downloadError?.message);
      continue;
    }

    const content = await fileBuffer.text();
    const { columns, samples } = summarizeCsv(content);

    files.push({
      id: file.id,
      name: file.name,
      content,
      columns,
      samples,
    });
  }

  const contextSummary = files
    .map((file) => {
      const samplePreview = file.samples
        .map((row) => JSON.stringify(row))
        .join('\n');

      return [
        `File: ${file.name}`,
        `Columns: ${file.columns.join(', ') || 'None detected'}`,
        samplePreview ? `Samples:\n${samplePreview}` : 'Samples: (no rows)'
      ].join('\n');
    })
    .join('\n\n');

  return { files, contextSummary };
}

function summarizeCsv(content: string) {
  const parsed = Papa.parse<Record<string, unknown>>(content, {
    header: true,
    skipEmptyLines: true,
    dynamicTyping: false,
    preview: 5,
  });

  const columns = parsed.meta.fields ?? [];
  const samples = (parsed.data ?? [])
    .filter((row): row is Record<string, unknown> => {
      if (!row) {
        return false;
      }
      return Object.values(row).some((value) => value !== null && value !== '');
    })
    .slice(0, 3);

  return { columns, samples };
}

function extractPythonCode(raw: string) {
  const pattern = /```python([\s\S]*?)```/i;
  const match = raw.match(pattern);

  if (match && match[1]) {
    return match[1].trim();
  }

  const fallback = raw.trim();
  return fallback ? fallback : null;
}

function buildSystemPrompt(context: string, filenames: string[]) {
  const filesList = filenames.map((name) => `- ${name}`).join('\n');

  return `You are a meticulous senior data analyst who writes production-ready Python.
You receive CSV files that already exist in the working directory. Only use these files:
${filesList}

Context about their schema:
${context}

Your job is to produce **only** one Python code block (fenced with triple backticks) that:
1. Imports pandas (and optionally numpy/matplotlib/seaborn) and loads the files by their exact filenames.
2. Maps the user's request to the real column names using the provided schema context before performing any operation.
3. Validates that referenced columns exist; if not, raise a descriptive ValueError explaining which column is missing and suggest the closest match.
4. Performs the requested aggregations, joins, or filters.
5. Prints clear insights plus any key tables using DataFrame.to_markdown(index=False) when appropriate.
6. Prints "ANALYSIS_COMPLETED" as the final line so the UI knows the run finished.

Rules:
- Do not run shell commands or access the network.
- Never use placeholders; rely on the actual column names provided above.
- If multiple interpretations are possible, inspect the sample rows to decide or explain your assumption in a printed note.
- Output nothing except the Python code block.`;
}
