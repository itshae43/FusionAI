'use client';

import { FileText, UploadCloud, FolderOpen } from 'lucide-react';
import { FileItem, DatasetFolder } from '@/types';

interface FileTableProps {
  files: FileItem[];
  folders: DatasetFolder[];
  onUploadClick: () => void;
  onFolderChange: (fileId: string, newFolderId: string) => void;
}

export default function FileTable({ 
  files, 
  folders, 
  onUploadClick,
  onFolderChange 
}: FileTableProps) {
  const formatDate = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const getFolderById = (folderId: string) => {
    return folders.find(f => f.id === folderId);
  };

  return (
    <div className="bg-gray-50/50 rounded-2xl border border-gray-100 overflow-hidden">
      <table className="w-full">
        <thead>
          <tr className="text-left text-gray-500 border-b border-gray-100">
            <th className="px-6 py-4 font-medium">Name</th>
            <th className="px-6 py-4 font-medium">Uploaded</th>
            <th className="px-6 py-4 font-medium">Size</th>
            <th className="px-6 py-4 font-medium">Folder</th>
          </tr>
        </thead>
        <tbody>
          {files.length === 0 ? (
            <tr>
              <td colSpan={4} className="px-6 py-12 text-center text-gray-400">
                No files uploaded yet
              </td>
            </tr>
          ) : (
            files.map((file, i) => {
              const folder = getFolderById(file.folderId);
              return (
                <tr
                  key={file.id}
                  className={`
                    group hover:bg-white transition-colors
                    ${i !== files.length - 1 ? 'border-b border-gray-100' : ''}
                  `}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-white border border-gray-200 rounded-lg shadow-sm text-gray-700 group-hover:border-black transition-colors">
                        <FileText size={20} />
                      </div>
                      <span className="font-medium text-gray-900">{file.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-600">{formatDate(file.uploadedAt)}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-600">{formatFileSize(file.size)}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="relative inline-block">
                      <FolderOpen
                        size={16}
                        className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                        style={{ color: folder?.iconColor || '#666' }}
                      />
                      <select
                        value={file.folderId}
                        onChange={(e) => onFolderChange(file.id, e.target.value)}
                        className="pl-9 pr-3 py-1.5 text-sm rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#B4EBE2] focus:border-transparent appearance-none cursor-pointer"
                        style={{ 
                          backgroundColor: folder?.color || '#f3f4f6',
                          color: folder?.iconColor || '#666'
                        }}
                      >
                        {folders.map((f) => (
                          <option key={f.id} value={f.id}>
                            {f.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>

      <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-center">
        <button
          onClick={onUploadClick}
          className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-black transition"
        >
          <UploadCloud size={16} />
          Upload New File
        </button>
      </div>
    </div>
  );
}
