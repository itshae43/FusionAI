"use client";

import React, { useState } from 'react';
import { User, MessageSquare, FolderOpen, Folder, GripVertical, Edit2, Trash2 } from 'lucide-react';
import { FolderStructure } from '@/types';

interface ChatItem {
  id: string;
  title: string;
  timestamp: string;
  folderId?: string;
}

const INITIAL_FOLDERS: FolderStructure[] = [
  { id: '1', name: 'General Knowledge', count: 10, isOpen: false },
  { id: '2', name: 'Onboarding', count: 10, isOpen: false },
  { id: '3', name: 'Data Analysis', count: 5, isOpen: false },
  { id: '4', name: 'Research', count: 8, isOpen: false },
];

const MOCK_CHATS: ChatItem[] = [
  { id: 'c1', title: 'Sales data analysis', timestamp: 'Today', folderId: '3' },
  { id: 'c2', title: 'Customer insights report', timestamp: 'Yesterday', folderId: '3' },
  { id: 'c3', title: 'What is machine learning?', timestamp: '2 days ago', folderId: '1' },
  { id: 'c4', title: 'New employee onboarding flow', timestamp: '3 days ago', folderId: '2' },
  { id: 'c5', title: 'Market research trends', timestamp: '1 week ago', folderId: '4' },
];

export default function Sidebar() {
  const [folders, setFolders] = useState<FolderStructure[]>(INITIAL_FOLDERS);
  const [chats, setChats] = useState<ChatItem[]>(MOCK_CHATS);
  const [draggedChat, setDraggedChat] = useState<string | null>(null);
  const [editingFolder, setEditingFolder] = useState<string | null>(null);
  const [editName, setEditName] = useState('');

  const toggleFolder = (id: string) => {
    setFolders(folders.map(f => 
      f.id === id ? { ...f, isOpen: !f.isOpen } : f
    ));
  };

  const handleDragStart = (chatId: string) => {
    setDraggedChat(chatId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (folderId: string) => {
    if (draggedChat) {
      setChats(chats.map(chat => 
        chat.id === draggedChat ? { ...chat, folderId } : chat
      ));
      setDraggedChat(null);
    }
  };

  const startEditFolder = (id: string, currentName: string) => {
    setEditingFolder(id);
    setEditName(currentName);
  };

  const saveEditFolder = (id: string) => {
    if (editName.trim()) {
      setFolders(folders.map(f => 
        f.id === id ? { ...f, name: editName.trim() } : f
      ));
    }
    setEditingFolder(null);
  };

  const getChatsInFolder = (folderId: string) => 
    chats.filter(chat => chat.folderId === folderId);

  const getUnorganizedChats = () => 
    chats.filter(chat => !chat.folderId);

  return (
    <div className="w-72 bg-[#F5F5F5] h-full flex flex-col shrink-0 border-r border-gray-200">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-[#000000] text-base font-bold">Chat History</h2>
      </div>

      {/* Folders and Chats */}
      <div className="flex-1 overflow-y-auto py-3 px-2 space-y-1">
        {/* Folders */}
        {folders.map((folder) => {
          const folderChats = getChatsInFolder(folder.id);
          return (
            <div key={folder.id} className="mb-1">
              {/* Folder Header */}
              <div
                className="bg-[#FDFDFD] rounded-lg px-3 py-2.5 hover:bg-white transition cursor-pointer border border-gray-200"
                onDragOver={handleDragOver}
                onDrop={() => handleDrop(folder.id)}
              >
                <div className="flex items-center justify-between">
                  <div 
                    className="flex items-center gap-2 flex-1"
                    onClick={() => toggleFolder(folder.id)}
                  >
                    {folder.isOpen ? (
                      <FolderOpen size={16} className="text-gray-600 shrink-0" />
                    ) : (
                      <Folder size={16} className="text-gray-600 shrink-0" />
                    )}
                    {editingFolder === folder.id ? (
                      <input
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        onBlur={() => saveEditFolder(folder.id)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') saveEditFolder(folder.id);
                          if (e.key === 'Escape') setEditingFolder(null);
                        }}
                        className="flex-1 text-sm text-[#000000] font-semibold bg-white border border-gray-300 rounded px-1 outline-none"
                        autoFocus
                        onClick={(e) => e.stopPropagation()}
                      />
                    ) : (
                      <span className="text-sm text-[#000000] font-semibold truncate">
                        {folder.name}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-xs text-gray-500 font-medium px-1.5">
                      {folderChats.length}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        startEditFolder(folder.id, folder.name);
                      }}
                      className="p-1 hover:bg-gray-200 rounded transition"
                      title="Rename folder"
                    >
                      <Edit2 size={12} className="text-gray-500" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Chats in Folder */}
              {folder.isOpen && folderChats.length > 0 && (
                <div className="ml-4 mt-1 space-y-0.5">
                  {folderChats.map((chat) => (
                    <div
                      key={chat.id}
                      draggable
                      onDragStart={() => handleDragStart(chat.id)}
                      className="group flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white transition cursor-pointer"
                    >
                      <GripVertical size={12} className="text-gray-400 opacity-0 group-hover:opacity-100 transition shrink-0" />
                      <MessageSquare size={14} className="text-gray-500 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-gray-700 truncate font-medium">
                          {chat.title}
                        </p>
                        <p className="text-[10px] text-gray-400">
                          {chat.timestamp}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}

        {/* Unorganized Chats */}
        {getUnorganizedChats().length > 0 && (
          <div className="mt-4 space-y-0.5">
            <h3 className="text-xs text-gray-500 font-semibold uppercase tracking-wide px-3 py-2">
              Unorganized
            </h3>
            {getUnorganizedChats().map((chat) => (
              <div
                key={chat.id}
                draggable
                onDragStart={() => handleDragStart(chat.id)}
                className="group flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white transition cursor-pointer"
              >
                <GripVertical size={12} className="text-gray-400 opacity-0 group-hover:opacity-100 transition shrink-0" />
                <MessageSquare size={14} className="text-gray-500 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-700 truncate font-medium">
                    {chat.title}
                  </p>
                  <p className="text-[10px] text-gray-400">
                    {chat.timestamp}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* User Profile */}
      <div className="p-4 border-t border-gray-200 flex items-center gap-3 hover:bg-white cursor-pointer transition rounded-lg mx-2 mb-2">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center shrink-0">
          <User size={16} className="text-white" />
        </div>
        <div className="flex flex-col flex-1 min-w-0">
          <span className="text-sm font-bold text-[#000000] truncate">Kevin Account</span>
          <span className="text-xs text-gray-500">Pro Plan</span>
        </div>
      </div>
    </div>
  );
}
