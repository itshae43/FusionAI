"use client";

import React, { useState } from 'react';
import { User } from 'lucide-react';
import SidebarItem from './SidebarItem';
import { INITIAL_FOLDERS } from '@/lib/constants';
import { FolderStructure } from '@/types';

export default function Sidebar() {
  const [folders, setFolders] = useState<FolderStructure[]>(INITIAL_FOLDERS);

  const toggleFolder = (id: string) => {
    const toggleRecursive = (items: FolderStructure[]): FolderStructure[] => {
      return items.map(item => {
        if (item.id === id) {
          return { ...item, isOpen: !item.isOpen };
        }
        if (item.children) {
          return { ...item, children: toggleRecursive(item.children) };
        }
        return item;
      });
    };
    setFolders(toggleRecursive(folders));
  };

  return (
    <div className="w-72 bg-[#121212] h-full flex flex-col text-white shrink-0 border-r border-gray-800">
      <div className="p-4 border-b border-gray-800/50">
         <div className="h-6"></div> 
      </div>

      <div className="flex-1 overflow-y-auto py-4 scrollbar-thin scrollbar-thumb-gray-700">
        {folders.map((folder, idx) => (
          <SidebarItem 
            key={folder.id} 
            item={folder} 
            onToggle={toggleFolder} 
            isLast={idx === folders.length - 1}
          />
        ))}
      </div>
      
      <div className="p-4 border-t border-gray-800 flex items-center gap-3 hover:bg-white/5 cursor-pointer transition">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
              <User size={16} />
          </div>
          <div className="flex flex-col">
              <span className="text-sm font-medium">Kevin Account</span>
              <span className="text-xs text-gray-400">Pro Plan</span>
          </div>
      </div>
    </div>
  );
}
