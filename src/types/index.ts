export interface FileItem {
  id: string;
  name: string;
  type: 'csv' | 'pdf' | 'svg';
  folderId: string;
  filePath: string; // Supabase storage path
  size: number; // File size in bytes
  uploadedAt: string; // ISO timestamp
  createdAt?: string; // Database timestamp
}

export interface FolderStructure {
  id: string;
  name: string;
  count: number;
  isOpen?: boolean;
  children?: FolderStructure[];
}

import type { AnalysisResult } from './analysis';

export interface ChatMessage {
  id: string;
  role: 'user' | 'system';
  text: string;
  attachments?: string[];
  analysis?: ChatAnalysisMeta;
}

export interface ChatAnalysisMeta {
  status: 'running' | 'completed' | 'error';
  result?: AnalysisResult;
  code?: string;
  files?: Array<{ id: string; name: string }>;
}

export interface DatasetFolder {
  id: string;
  name: string;
  count: number;
  color: string;
  iconColor: string;
}
