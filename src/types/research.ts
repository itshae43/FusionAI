// src/types/research.ts

// What we send TO Exa
export interface ResearchQuery {
  query: string;              // "German AI market size"
  numResults?: number;        // How many results to return (default: 10)
  type?: 'auto' | 'news' | 'paper'; // What kind of content to search
}

// What we GET BACK from Exa
export interface ResearchResult {
  title: string;              // "AI Market Reaches $500B"
  url: string;                // "https://example.com/article"
  snippet: string;            // First 200 chars of content
  publishedDate?: string;     // "2024-01-15"
  author?: string;            // "John Doe"
  highlights?: string[];      // Key phrases: ["market growth", "AI"]
}
