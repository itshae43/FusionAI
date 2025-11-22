"use client";

import { Inter } from 'next/font/google';
import { useRouter, usePathname } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';
import './globals.css';
import Sidebar from '@/components/layout/Sidebar';
import NavTabs from '@/components/layout/NavTabs';

const inter = Inter({ subsets: ['latin'] });

const MIN_SIDEBAR_WIDTH = 240;
const MAX_SIDEBAR_WIDTH = 480;
const DEFAULT_SIDEBAR_WIDTH = 288; // 72 * 4 = w-72

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarWidth, setSidebarWidth] = useState(DEFAULT_SIDEBAR_WIDTH);
  const [isResizing, setIsResizing] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);

  // Load saved width on mount
  useEffect(() => {
    const saved = localStorage.getItem('fusion-ai-sidebar-width');
    if (saved) {
      setSidebarWidth(parseInt(saved, 10));
    }
  }, []);

  // Save width to localStorage
  useEffect(() => {
    localStorage.setItem('fusion-ai-sidebar-width', sidebarWidth.toString());
  }, [sidebarWidth]);

  const handleNewChat = () => {
    router.push('/chat');
    // Emit event to clear current chat
    window.dispatchEvent(new CustomEvent('fusion-ai-clear-chat'));
  };

  const handleChatSelect = (chatId: string) => {
    router.push('/chat');
    // Emit event to load specific chat
    window.dispatchEvent(new CustomEvent('fusion-ai-load-chat', { detail: chatId }));
  };

  const startResizing = () => {
    setIsResizing(true);
  };

  const stopResizing = () => {
    setIsResizing(false);
  };

  const resize = (e: MouseEvent) => {
    if (isResizing && sidebarRef.current) {
      const newWidth = e.clientX;
      if (newWidth >= MIN_SIDEBAR_WIDTH && newWidth <= MAX_SIDEBAR_WIDTH) {
        setSidebarWidth(newWidth);
      }
    }
  };

  useEffect(() => {
    if (isResizing) {
      window.addEventListener('mousemove', resize);
      window.addEventListener('mouseup', stopResizing);
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
    } else {
      window.removeEventListener('mousemove', resize);
      window.removeEventListener('mouseup', stopResizing);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    }

    return () => {
      window.removeEventListener('mousemove', resize);
      window.removeEventListener('mouseup', stopResizing);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  }, [isResizing]);

  return (
    <html lang="en">
      <body className={`${inter.className} flex h-screen w-full overflow-hidden bg-white`}>
        <div 
          ref={sidebarRef}
          style={{ width: `${sidebarWidth}px` }}
          className="relative shrink-0"
        >
          <Sidebar 
            onChatSelect={handleChatSelect}
            onNewChat={handleNewChat}
          />
          
          {/* Resize Handle */}
          <div
            onMouseDown={startResizing}
            className="absolute top-0 right-0 w-1 h-full cursor-col-resize hover:bg-blue-500 transition-colors group"
          >
            <div className="absolute top-0 right-0 w-1 h-full bg-transparent group-hover:bg-blue-500 transition-colors" />
          </div>
        </div>

        <div className="flex-1 flex flex-col h-full overflow-hidden relative">
           {/* Shared Header / Tabs */}
           <div className="px-8 py-6 pb-2 shrink-0 z-10">
             <NavTabs />
           </div>
           
           <main className="flex-1 overflow-hidden relative">
            {children}
           </main>
        </div>
      </body>
    </html>
  );
}
