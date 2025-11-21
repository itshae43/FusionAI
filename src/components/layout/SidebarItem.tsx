"use client";

import { Folder, FolderOpen } from 'lucide-react';
import { FolderStructure } from '@/types';

interface SidebarItemProps {
  item: FolderStructure;
  level?: number;
  onToggle: (id: string) => void;
  isLast?: boolean;
}

export default function SidebarItem({ 
  item, 
  level = 0, 
  onToggle, 
  isLast = false 
}: SidebarItemProps) {
  const hasChildren = item.children && item.children.length > 0;

  return (
    <div className="relative select-none">
      {/* Item Row */}
      <div 
        onClick={() => onToggle(item.id)}
        className={`
          flex items-center justify-between py-2 px-3 mx-2 rounded-lg cursor-pointer transition-colors
          hover:bg-white/10 text-white mb-1
        `}
        style={{ paddingLeft: `${level * 20 + 12}px` }}
      >
        <div className="flex items-center gap-2 overflow-hidden">
          {item.isOpen ? (
            <FolderOpen size={18} className="text-white shrink-0" />
          ) : (
            <Folder size={18} className="text-white shrink-0" />
          )}
          <span className="truncate text-sm font-medium">{item.name}</span>
        </div>
        <span className="text-xs font-bold bg-white/20 px-1.5 py-0.5 rounded text-white min-w-[24px] text-center">
          {item.count}
        </span>
      </div>

      {/* Children (Recursive) */}
      {hasChildren && item.isOpen && (
        <div className="relative">
          {/* Vertical Line for Tree Structure */}
          <div 
            className="absolute top-0 bottom-2 w-px bg-gray-600"
            style={{ left: `${level * 20 + 21}px` }} 
          />
          
          {item.children!.map((child, index) => (
            <div key={child.id} className="relative">
              {/* Horizontal Line Connector */}
              <div 
                className="absolute h-px bg-gray-600 w-3"
                style={{ 
                  left: `${level * 20 + 21}px`, 
                  top: '18px' 
                }} 
              />
              <SidebarItem 
                item={child} 
                level={level + 1} 
                onToggle={onToggle} 
                isLast={index === item.children!.length - 1}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
