'use client';

import { useState, useRef, useEffect } from 'react';
import { MoreVertical, Edit2 } from 'lucide-react';
import { DatasetFolder } from '@/types';

interface FolderCardProps {
  folder: DatasetFolder;
  onRename: (folderId: string, newName: string) => void;
  onClick?: () => void;
}

export default function FolderCard({ folder, onRename, onClick }: FolderCardProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isRenaming, setIsRenaming] = useState(false);
  const [newName, setNewName] = useState(folder.name);
  const menuRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMenuOpen]);

  useEffect(() => {
    if (isRenaming && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isRenaming]);

  const handleRename = () => {
    if (newName.trim() && newName !== folder.name) {
      onRename(folder.id, newName.trim());
    }
    setIsRenaming(false);
    setIsMenuOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleRename();
    } else if (e.key === 'Escape') {
      setNewName(folder.name);
      setIsRenaming(false);
    }
  };

  return (
    <div
      onClick={() => !isRenaming && onClick?.()}
      className={`
        ${folder.color} 
        p-6 rounded-3xl relative cursor-pointer hover:scale-[1.02] transition-transform duration-200 h-48 flex flex-col justify-between
      `}
    >
      {/* Menu Button */}
      <div className="absolute top-4 right-4" ref={menuRef}>
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsMenuOpen(!isMenuOpen);
          }}
          className="p-1.5 rounded-lg hover:bg-black/5 transition-colors"
        >
          <MoreVertical size={18} />
        </button>

        {/* Dropdown Menu */}
        {isMenuOpen && (
          <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsRenaming(true);
                setIsMenuOpen(false);
              }}
              className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2 text-gray-700"
            >
              <Edit2 size={14} />
              Rename
            </button>
          </div>
        )}
      </div>

      {/* Folder Name */}
      <div>
        {isRenaming ? (
          <input
            ref={inputRef}
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onBlur={handleRename}
            onKeyDown={handleKeyDown}
            className="text-xl font-semibold bg-white/50 px-2 py-1 rounded border-2 border-[#B4EBE2] outline-none"
            onClick={(e) => e.stopPropagation()}
          />
        ) : (
          <h3 className="text-xl font-semibold">{folder.name}</h3>
        )}
      </div>

      {/* Item Count (bottom right only) */}
      <div className="flex items-end justify-end">
        <span className="text-sm font-medium opacity-60">{folder.count} Items</span>
      </div>
    </div>
  );
}
