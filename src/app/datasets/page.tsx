"use client";

import React, { useState } from 'react';
import { DATASET_FOLDERS, INITIAL_FILES } from '@/lib/constants';
import FolderCard from '@/components/datasets/FolderCard';
import FileTable from '@/components/datasets/FileTable';

export default function DatasetsPage() {
  const [files] = useState(INITIAL_FILES);

  return (
    <div className="h-full overflow-y-auto px-8 py-2 animate-fade-in">
      {/* Folders Grid */}
      <div className="mb-10">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Folders</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {DATASET_FOLDERS.map(folder => (
            <FolderCard key={folder.id} folder={folder} />
          ))}
        </div>
      </div>

      {/* Files Table */}
      <div className="pb-10">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Files</h2>
        <FileTable files={files} />
      </div>
    </div>
  );
}
