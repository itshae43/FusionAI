import { FolderStructure, FileItem, DatasetFolder } from "@/types";

export const INITIAL_FOLDERS: FolderStructure[] = [
  {
    id: '1',
    name: 'General Knowledge',
    count: 10,
    isOpen: false,
    children: []
  },
  {
    id: '2',
    name: 'Onboarding',
    count: 10,
    isOpen: true, 
    children: [
      { id: '2-1', name: 'SubFolder 1', count: 10 },
      { id: '2-2', name: 'SubFolder 1', count: 10 },
    ]
  },
  { id: '3', name: 'SubFolder 1', count: 10, isOpen: false },
  { id: '4', name: 'SubFolder 1', count: 10, isOpen: false },
  { id: '5', name: 'Onboarding Design', count: 10, isOpen: false },
  { id: '6', name: 'Team Interviews', count: 10, isOpen: false }
];

// Initial files removed - all files now loaded from Supabase database
export const INITIAL_FILES: FileItem[] = [];

export const DATASET_FOLDERS: DatasetFolder[] = [
  { id: 'd1', name: 'Task Automation', count: 3, color: 'bg-purple-100 text-purple-800', iconColor: 'bg-purple-300' },
  { id: 'd2', name: 'Task Automation', count: 3, color: 'bg-blue-100 text-blue-800', iconColor: 'bg-blue-300' },
  { id: 'd3', name: 'Task Automation', count: 3, color: 'bg-orange-100 text-orange-800', iconColor: 'bg-orange-300' },
];
