'use client';

import React, { useState, useEffect } from 'react';
import { DATASET_FOLDERS } from '@/lib/constants';
import { supabase } from '@/lib/supabase';
import FolderCard from '@/components/datasets/FolderCard';
import FileTable from '@/components/datasets/FileTable';
import UploadFileModal from '@/components/datasets/UploadFileModal';
import { FileItem, DatasetFolder } from '@/types';

export default function DatasetsPage() {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [folders, setFolders] = useState<DatasetFolder[]>(DATASET_FOLDERS);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch files from Supabase on mount
  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('files')
        .select('*')
        .order('uploaded_at', { ascending: false });

      if (error) throw error;

      // Transform database records to FileItem format
      const transformedFiles: FileItem[] = (data || []).map((file: any) => ({
        id: file.id,
        name: file.name,
        type: file.type,
        folderId: file.folder_id,
        filePath: file.file_path,
        size: file.size,
        uploadedAt: file.uploaded_at,
      }));

      setFiles(transformedFiles);

      // Update folder counts
      updateFolderCounts(transformedFiles);
    } catch (error: any) {
      console.error('Error fetching files:', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const updateFolderCounts = (fileList: FileItem[]) => {
    const counts: Record<string, number> = {};
    fileList.forEach((file) => {
      counts[file.folderId] = (counts[file.folderId] || 0) + 1;
    });

    setFolders((prevFolders) =>
      prevFolders.map((folder) => ({
        ...folder,
        count: counts[folder.id] || 0,
      }))
    );
  };

  const handleFolderRename = async (folderId: string, newName: string) => {
    setFolders((prevFolders) =>
      prevFolders.map((folder) =>
        folder.id === folderId ? { ...folder, name: newName } : folder
      )
    );
    // TODO: Persist folder renames to database if needed
  };

  const handleFolderChange = async (fileId: string, newFolderId: string) => {
    try {
      // Update in database
      const { error } = await supabase
        .from('files')
        .update({ folder_id: newFolderId })
        .eq('id', fileId);

      if (error) throw error;

      // Update local state
      setFiles((prevFiles) =>
        prevFiles.map((file) =>
          file.id === fileId ? { ...file, folderId: newFolderId } : file
        )
      );

      // Refresh folder counts
      const updatedFiles = files.map((file) =>
        file.id === fileId ? { ...file, folderId: newFolderId } : file
      );
      updateFolderCounts(updatedFiles);
    } catch (error: any) {
      console.error('Error updating folder:', error.message);
    }
  };

  const handleUploadSuccess = () => {
    fetchFiles(); // Refresh file list after upload
  };

  return (
    <div className="h-full overflow-y-auto px-8 py-2 animate-fade-in">
      {/* Folders Grid */}
      <div className="mb-10">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Folders</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {folders.map((folder) => (
            <FolderCard
              key={folder.id}
              folder={folder}
              onRename={handleFolderRename}
            />
          ))}
        </div>
      </div>

      {/* Files Table */}
      <div className="pb-10">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Files</h2>
        {isLoading ? (
          <div className="text-center py-12 text-gray-400">Loading files...</div>
        ) : (
          <FileTable
            files={files}
            folders={folders}
            onUploadClick={() => setIsUploadModalOpen(true)}
            onFolderChange={handleFolderChange}
          />
        )}
      </div>

      {/* Upload Modal */}
      <UploadFileModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        folders={folders}
        onUploadSuccess={handleUploadSuccess}
      />
    </div>
  );
}
