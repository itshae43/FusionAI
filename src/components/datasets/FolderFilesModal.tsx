'use client';

import React from 'react';
import { X, FileSpreadsheet, FileText, Image, Download, Trash2 } from 'lucide-react';
import { FileItem, DatasetFolder } from '@/types';

interface FolderFilesModalProps {
  isOpen: boolean;
  onClose: () => void;
  folder: DatasetFolder;
  files: FileItem[];
  onDeleteFile?: (fileId: string) => void;
}

export default function FolderFilesModal({
  isOpen,
  onClose,
  folder,
  files,
  onDeleteFile,
}: FolderFilesModalProps) {
  if (!isOpen) return null;

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'csv':
        return <FileSpreadsheet size={20} className="text-green-600" />;
      case 'pdf':
        return <FileText size={20} className="text-red-600" />;
      case 'svg':
        return <Image size={20} className="text-purple-600" />;
      default:
        return <FileSpreadsheet size={20} className="text-gray-600" />;
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className={`${folder.color} rounded-t-2xl p-6 flex items-center justify-between`}>
          <div>
            <h2 className="text-2xl font-bold">{folder.name}</h2>
            <p className="text-sm opacity-70 mt-1">{files.length} {files.length === 1 ? 'Item' : 'Items'}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-black/10 rounded-lg transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Files List */}
        <div className="flex-1 overflow-y-auto p-6">
          {files.length === 0 ? (
            <div className="text-center py-12">
              <div className={`w-16 h-16 rounded-2xl ${folder.iconColor} mx-auto mb-4 opacity-50`}></div>
              <p className="text-gray-500 font-medium">No files in this folder</p>
              <p className="text-gray-400 text-sm mt-1">Upload files to get started</p>
            </div>
          ) : (
            <div className="space-y-2">
              {files.map((file) => (
                <div
                  key={file.id}
                  className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-xl transition-colors border border-gray-100"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="shrink-0">
                      {getFileIcon(file.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 truncate">{file.name}</p>
                      <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                        <span>{formatFileSize(file.size)}</span>
                        <span>•</span>
                        <span>{formatDate(file.uploadedAt)}</span>
                        <span>•</span>
                        <span className="uppercase">{file.type}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                      title="Download"
                    >
                      <Download size={16} className="text-gray-600" />
                    </button>
                    {onDeleteFile && (
                      <button
                        onClick={() => {
                          if (confirm(`Delete "${file.name}"?`)) {
                            onDeleteFile(file.id);
                          }
                        }}
                        className="p-2 hover:bg-red-100 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={16} className="text-red-600" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="w-full px-4 py-3 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-colors font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
