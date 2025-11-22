// src/app/api/chat/route.ts

import Groq from 'groq-sdk';
import { NextRequest, NextResponse } from 'next/server';
import { createE2bSandbox, destroySandbox } from '@/lib/e2b/sandbox';
import { conductExternalResearch } from '@/lib/e2b/research';

// Create Groq client
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    // Validate required environment variables
    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json(
        { error: 'GROQ_API_KEY is not configured' },
        { status: 500 }
      );
    }

    const { messages, useResearch } = await req.json();

    // Get the last user message
    const lastMessage = messages[messages.length - 1];
    const userQuery = lastMessage.content;

    console.log(`💬 Chat request: "${userQuery}" (Research: ${useResearch})`);

    let researchContext = '';
    let sandbox: any = null;

    // If research mode is enabled, conduct research first
    if (useResearch) {
      try {
        console.log('🔍 Conducting research...');
        
        // Create sandbox for research
        sandbox = await createE2bSandbox();
        
        // Conduct research
        const researchResults = await conductExternalResearch(sandbox, {
          query: userQuery,
          numResults: 5,
          type: 'auto',
        });

        // Format research results as context
        if (researchResults.length > 0) {
          researchContext = `\n\n**Research Results:**\n\n${researchResults
            .map((result, index) => 
              `${index + 1}. **${result.title}**\n   Source: ${result.url}\n   ${result.snippet}\n   ${result.publishedDate ? `Published: ${result.publishedDate}` : ''}`
            )
            .join('\n\n')}`;
        }

        console.log(`✅ Research complete: ${researchResults.length} results`);
      } catch (error: any) {
        console.error('❌ Research failed:', error.message);
        researchContext = '\n\n[Research temporarily unavailable]';
      } finally {
        // Clean up sandbox
        if (sandbox) {
          await destroySandbox(sandbox);
        }
      }
    }

    // Build the system message with research context
    const systemMessage = {
      role: 'system',
      content: `You are a helpful AI assistant. ${
        researchContext
          ? `The user asked a research question. Below are recent web search results to help answer their question. Use these sources to provide accurate, up-to-date information. Always cite the sources when using information from them.${researchContext}`
          : 'Answer questions clearly and concisely.'
      }`,
    };

    // Create chat completion with streaming using Groq
    const response = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile', // Fast and powerful Groq model
      stream: true,
      messages: [systemMessage, ...messages] as any,
      temperature: 0.7,
      max_tokens: 2000,
    });

    // Create a readable stream for the response
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of response) {
            const text = chunk.choices[0]?.delta?.content || '';
            if (text) {
              controller.enqueue(encoder.encode(text));
            }
          }
          controller.close();
        } catch (error) {
          controller.error(error);
        }
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Transfer-Encoding': 'chunked',
      },
    });

  } catch (error: any) {
    console.error('❌ Chat API error:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message || 'An error occurred',
        hint: 'Check your API keys in .env file'
      }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}
