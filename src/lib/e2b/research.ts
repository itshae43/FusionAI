// src/lib/e2b/research.ts

import { Sandbox } from '@e2b/code-interpreter';
import { ResearchQuery, ResearchResult } from '@/types/research';

// Main function: Conduct external research using Exa MCP
export async function conductExternalResearch(
  sandbox: Sandbox,
  query: ResearchQuery
): Promise<ResearchResult[]> {
  
  console.log(`🔍 Starting research: "${query.query}"`);

  try {
    // Build the Exa MCP command
    const numResults = query.numResults || 10;
    const searchType = query.type || 'auto';
    
    const exaCommand = `exa search --query "${query.query}" --num-results ${numResults} --type ${searchType}`;
    
    console.log(`📡 Running command: ${exaCommand}`);

    // Execute Python code that uses Exa API (since we're using code-interpreter)
    const execution = await sandbox.runCode(`
import os
import requests
import json

# Exa API configuration
EXA_API_KEY = "${process.env.EXA_API_KEY}"
EXA_API_URL = "https://api.exa.ai/search"

# Search parameters
search_params = {
    "query": """${query.query.replace(/"/g, '\\"')}""",
    "numResults": ${numResults},
    "type": "${searchType}",
    "contents": {
        "text": {"maxCharacters": 200}
    }
}

# Make API request
headers = {
    "Content-Type": "application/json",
    "x-api-key": EXA_API_KEY
}

try:
    response = requests.post(EXA_API_URL, json=search_params, headers=headers)
    response.raise_for_status()
    results = response.json()
    print(json.dumps(results))
except Exception as e:
    print(json.dumps({"error": str(e)}))
    `);

    // Check for execution errors
    if (execution.error) {
      throw new Error(`Exa search failed: ${execution.error}`);
    }

    const stdout = execution.logs.stdout.join('');
    console.log('Raw Exa output:', stdout);

    // Parse the JSON output from Exa
    const exaData = JSON.parse(stdout);
    
    // Check for API errors
    if (exaData.error) {
      throw new Error(`Exa API error: ${exaData.error}`);
    }

    // Convert to our ResearchResult format
    const results: ResearchResult[] = (exaData.results || []).map((item: any) => ({
      title: item.title || 'Untitled',
      url: item.url || '',
      snippet: item.text || item.snippet || '',
      publishedDate: item.publishedDate || item.published_date,
      author: item.author,
      highlights: item.highlights || [],
    }));

    console.log(`✅ Found ${results.length} research results`);
    return results;

  } catch (error: any) {
    console.error('❌ Research failed:', error);
    throw new Error(`Research failed: ${error.message}`);
  }
}
