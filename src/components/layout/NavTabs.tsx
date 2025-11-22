"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { MessageSquare, Database } from 'lucide-react';

export default function NavTabs() {
  const pathname = usePathname();
  const isChat = pathname === '/chat' || pathname === '/';
  const isDatasets = pathname === '/datasets';

  return (
    <div className="flex gap-3">
      <Link 
        href="/chat" 
        className={`
          flex items-center gap-2 px-6 py-2.5 rounded-full font-semibold text-sm transition-all
          ${isChat 
            ? 'bg-black text-white shadow-md' 
            : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 hover:border-gray-400'
          }
        `}
      >
        <MessageSquare size={18} strokeWidth={2.5} /> Chat
      </Link>
      <Link 
        href="/datasets" 
        className={`
          flex items-center gap-2 px-6 py-2.5 rounded-full font-semibold text-sm transition-all
          ${isDatasets 
            ? 'bg-black text-white shadow-md' 
            : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 hover:border-gray-400'
          }
        `}
      >
        <Database size={18} strokeWidth={2.5} /> Datasets
      </Link>
    </div>
  );
}
