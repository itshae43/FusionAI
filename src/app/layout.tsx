import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Sidebar from '@/components/layout/Sidebar';
import NavTabs from '@/components/layout/NavTabs';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Research Chat App',
  description: 'Next.js Research Application',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} flex h-screen w-full overflow-hidden bg-white`}>
        <Sidebar />
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
