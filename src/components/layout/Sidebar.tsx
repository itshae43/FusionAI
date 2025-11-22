"use client";

import React, { useState, useEffect } from 'react';
import { User, MessageSquare, FolderOpen, Folder, GripVertical, Edit2, Trash2, Plus } from 'lucide-react';
import { FolderStructure } from '@/types';
import { formatChatTimestamp } from '@/lib/chatUtils';

export interface ChatItem {
  id: string;
  title: string;
  timestamp: string;
  folderId?: string;
  createdAt: number;
}

const INITIAL_FOLDERS: FolderStructure[] = [
  { id: '1', name: 'General Knowledge', count: 0, isOpen: false },
  { id: '2', name: 'Onboarding', count: 0, isOpen: false },
  { id: '3', name: 'SubFolder 1', count: 0, isOpen: false },
  { id: '4', name: 'SubFolder 2', count: 0, isOpen: false },
];

// Load chats from localStorage
const loadChats = (): ChatItem[] => {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem('fusion-ai-chats');
  return stored ? JSON.parse(stored) : [];
};

// Save chats to localStorage
const saveChats = (chats: ChatItem[]) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem('fusion-ai-chats', JSON.stringify(chats));
};

// Load folders from localStorage
const loadFolders = (): FolderStructure[] => {
  if (typeof window === 'undefined') return INITIAL_FOLDERS;
  const stored = localStorage.getItem('fusion-ai-folders');
  return stored ? JSON.parse(stored) : INITIAL_FOLDERS;
};

// Save folders to localStorage
const saveFolders = (folders: FolderStructure[]) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem('fusion-ai-folders', JSON.stringify(folders));
};

interface SidebarProps {
  onChatSelect?: (chatId: string) => void;
  currentChatId?: string;
  onNewChat?: () => void;
}

export default function Sidebar({ onChatSelect, currentChatId, onNewChat }: SidebarProps) {
  const [folders, setFolders] = useState<FolderStructure[]>(loadFolders());
  const [chats, setChats] = useState<ChatItem[]>(loadChats());
  const [draggedChat, setDraggedChat] = useState<string | null>(null);
  const [editingFolder, setEditingFolder] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [isAddingFolder, setIsAddingFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');

  // Load data on mount
  useEffect(() => {
    setChats(loadChats());
    setFolders(loadFolders());
  }, []);

  // Save folders when they change
  useEffect(() => {
    saveFolders(folders);
  }, [folders]);

  // Save chats when they change
  useEffect(() => {
    saveChats(chats);
  }, [chats]);

  // Listen for new chat events from chat page
  useEffect(() => {
    const handleNewChat = (event: CustomEvent<ChatItem>) => {
      const newChat = event.detail;
      setChats(prev => {
        const exists = prev.some(c => c.id === newChat.id);
        if (exists) return prev;
        return [newChat, ...prev];
      });
    };

    window.addEventListener('fusion-ai-new-chat' as any, handleNewChat);
    return () => {
      window.removeEventListener('fusion-ai-new-chat' as any, handleNewChat);
    };
  }, []);

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
      setChats(prev => prev.map(chat => 
        chat.id === draggedChat ? { ...chat, folderId } : chat
      ));
      setDraggedChat(null);
    }
  };

  const handleDropToUnorganized = () => {
    if (draggedChat) {
      setChats(prev => prev.map(chat => 
        chat.id === draggedChat ? { ...chat, folderId: undefined } : chat
      ));
      setDraggedChat(null);
    }
  };

  const addNewFolder = () => {
    if (newFolderName.trim()) {
      const newFolder: FolderStructure = {
        id: Date.now().toString(),
        name: newFolderName.trim(),
        count: 0,
        isOpen: true,
      };
      setFolders(prev => [...prev, newFolder]);
      setNewFolderName('');
      setIsAddingFolder(false);
    }
  };

  const deleteFolder = (folderId: string) => {
    // Move chats to unorganized
    setChats(prev => prev.map(chat => 
      chat.folderId === folderId ? { ...chat, folderId: undefined } : chat
    ));
    // Remove folder
    setFolders(prev => prev.filter(f => f.id !== folderId));
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
    chats
      .filter(chat => chat.folderId === folderId)
      .sort((a, b) => b.createdAt - a.createdAt);

  const getUnorganizedChats = () => 
    chats
      .filter(chat => !chat.folderId)
      .sort((a, b) => b.createdAt - a.createdAt);

  // Update timestamps every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setChats(prev => [...prev]); // Force re-render to update timestamps
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full bg-[#F5F5F5] h-full flex flex-col border-r border-gray-200">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <h2 className="text-[#000000] text-base font-bold">Chat History</h2>
        <button
          onClick={onNewChat}
          className="p-1.5 hover:bg-gray-200 rounded-lg transition"
          title="New Chat"
        >
          <Plus size={18} className="text-gray-700" />
        </button>
      </div>

      {/* Folders and Chats */}
      <div className="flex-1 overflow-y-auto py-3 px-2 space-y-1">
        {/* Folders */}
        {folders.map((folder, folderIndex) => {
          const folderChats = getChatsInFolder(folder.id);
          return (
            <div key={folder.id} className="mb-1 relative">
              {/* Folder Header */}
              <div
                className="bg-[#FDFDFD] rounded-lg px-3 py-2.5 hover:bg-white transition cursor-pointer border border-gray-200 relative"
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
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (confirm(`Delete folder "${folder.name}"? Chats will be moved to Unorganized.`)) {
                          deleteFolder(folder.id);
                        }
                      }}
                      className="p-1 hover:bg-red-100 rounded transition"
                      title="Delete folder"
                    >
                      <Trash2 size={12} className="text-gray-500 hover:text-red-600" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Vertical Line Connector */}
              {folder.isOpen && folderChats.length > 0 && (
                <div 
                  className="absolute left-6 bg-gray-300"
                  style={{
                    top: '44px',
                    bottom: '8px',
                    width: '1px',
                  }}
                />
              )}

              {/* Chats in Folder */}
              {folder.isOpen && folderChats.length > 0 && (
                <div className="ml-6 mt-1 space-y-0.5">
                  {folderChats.map((chat) => (
                    <div key={chat.id} className="relative">
                      {/* Horizontal Line Connector */}
                      <div 
                        className="absolute left-0 top-1/2 w-3 h-px bg-gray-300"
                        style={{ transform: 'translateY(-50%)' }}
                      />
                      <div
                        draggable
                        onDragStart={() => handleDragStart(chat.id)}
                        onClick={() => onChatSelect?.(chat.id)}
                        className={`group flex items-center gap-2 px-3 py-2 ml-3 rounded-lg hover:bg-white transition cursor-pointer ${
                          currentChatId === chat.id ? 'bg-white border border-gray-300' : ''
                        }`}
                      >
                        <GripVertical size={12} className="text-gray-400 opacity-0 group-hover:opacity-100 transition shrink-0" />
                        <MessageSquare size={14} className="text-gray-500 shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-gray-700 truncate font-medium">
                            {chat.title}
                          </p>
                          <p className="text-[10px] text-gray-400">
                            {formatChatTimestamp(chat.createdAt)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}

        {/* Add New Folder */}
        {isAddingFolder ? (
          <div className="bg-[#FDFDFD] rounded-lg px-3 py-2.5 border border-gray-300">
            <input
              type="text"
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              onBlur={() => {
                if (!newFolderName.trim()) setIsAddingFolder(false);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') addNewFolder();
                if (e.key === 'Escape') {
                  setIsAddingFolder(false);
                  setNewFolderName('');
                }
              }}
              placeholder="Folder name..."
              className="w-full text-sm text-[#000000] font-semibold bg-transparent outline-none"
              autoFocus
            />
          </div>
        ) : (
          <button
            onClick={() => setIsAddingFolder(true)}
            className="w-full bg-[#FDFDFD] rounded-lg px-3 py-2.5 hover:bg-white transition border border-dashed border-gray-300 flex items-center gap-2 justify-center text-gray-600 text-sm font-medium"
          >
            <Plus size={14} />
            New Folder
          </button>
        )}

        {/* Unorganized Chats */}
        {getUnorganizedChats().length > 0 && (
          <div 
            className="mt-4 space-y-0.5"
            onDragOver={handleDragOver}
            onDrop={handleDropToUnorganized}
          >
            <h3 className="text-xs text-gray-500 font-semibold uppercase tracking-wide px-3 py-2">
              Unorganized
            </h3>
            {getUnorganizedChats().map((chat) => (
              <div
                key={chat.id}
                draggable
                onDragStart={() => handleDragStart(chat.id)}
                onClick={() => onChatSelect?.(chat.id)}
                className={`group flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white transition cursor-pointer ${
                  currentChatId === chat.id ? 'bg-white border border-gray-300' : ''
                }`}
              >
                <GripVertical size={12} className="text-gray-400 opacity-0 group-hover:opacity-100 transition shrink-0" />
                <MessageSquare size={14} className="text-gray-500 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-700 truncate font-medium">
                    {chat.title}
                  </p>
                  <p className="text-[10px] text-gray-400">
                    {formatChatTimestamp(chat.createdAt)}
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
