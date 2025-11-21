export interface FileItem {
  id: string;
  name: string;
  type: 'csv' | 'pdf' | 'svg';
  addedBy: string;
  date: string;
}

export interface FolderStructure {
  id: string;
  name: string;
  count: number;
  isOpen?: boolean;
  children?: FolderStructure[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'system';
  text: string;
  attachments?: string[];
}

export interface DatasetFolder {
  id: string;
  name: string;
  count: number;
  color: string;
  iconColor: string;
}
