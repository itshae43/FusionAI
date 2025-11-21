"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { MessageSquare, Database } from 'lucide-react';

export default function NavTabs() {
  const pathname = usePathname();
  const isChat = pathname === '/chat';
  const isDatasets = pathname === '/datasets';

  return (
    <div className="flex gap-4">
      <Link 
        href="/chat" 
        className={`
          flex items-center gap-2 px-6 py-2.5 rounded-full font-medium text-sm transition-all
          ${isChat 
            ? 'bg-black text-white border border-black shadow-lg' 
            : 'bg-white text-black border border-gray-300 hover:bg-gray-50'
          }
        `}
      >
        <MessageSquare size={18} /> Chat
      </Link>
      <Link 
        href="/datasets" 
        className={`
          flex items-center gap-2 px-6 py-2.5 rounded-full font-medium text-sm transition-all
          ${isDatasets 
            ? 'bg-black text-white border border-black shadow-lg' 
            : 'bg-white text-black border border-gray-300 hover:bg-gray-50'
          }
        `}
      >
        <Database size={18} /> Datasets{isDatasets && '(2)'}
      </Link>
    </div>
  );
}
