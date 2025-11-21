"use client";

import React, { useState } from 'react';
import { Plus, Send, X, FileSpreadsheet, Search } from 'lucide-react';

interface ChatInputProps {
  onSend: (text: string, attachment: string | null, useResearch: boolean) => void;
  isLoading?: boolean;
}

export default function ChatInput({ onSend, isLoading }: ChatInputProps) {
  const [chatInput, setChatInput] = useState('');
  const [uploadedFile, setUploadedFile] = useState<string | null>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [useResearch, setUseResearch] = useState(false);

  const handleSend = () => {
    if (!chatInput.trim() || isLoading) return;
    onSend(chatInput, uploadedFile, useResearch);
    setChatInput('');
    setUploadedFile(null);
  };

  const toggleResearch = () => {
    setUseResearch(!useResearch);
  };

  return (
    <div className="absolute bottom-8 left-0 right-0 px-8 flex justify-center">
      <div className={`
        w-full max-w-4xl bg-white p-2 rounded-3xl shadow-2xl border relative transition-all
        ${isFocused ? 'border-[#B4EBE2]' : 'border-gray-100'}
      `}>
        {uploadedFile && (
          <div className="absolute -top-12 left-4 animate-fade-in">
            <div className="flex items-center gap-2 bg-green-50 text-green-800 px-3 py-1.5 rounded-lg border border-green-100 text-sm font-medium shadow-sm">
              <FileSpreadsheet size={16} className="text-green-600" />
              {uploadedFile}
              <button 
                onClick={() => setUploadedFile(null)}
                className="hover:bg-green-100 rounded-full p-0.5 ml-1"
              >
                <X size={14} />
              </button>
            </div>
          </div>
        )}

        {useResearch && (
          <div className="absolute -top-12 right-4 animate-fade-in">
            <div className="flex items-center gap-2 bg-blue-50 text-blue-800 px-3 py-1.5 rounded-lg border border-blue-100 text-sm font-medium shadow-sm">
              <Search size={16} className="text-blue-600" />
              Research Mode
              <button 
                onClick={() => setUseResearch(false)}
                className="hover:bg-blue-100 rounded-full p-0.5 ml-1"
              >
                <X size={14} />
              </button>
            </div>
          </div>
        )}

        <div className="flex items-center gap-3 px-2">
           <button 
             onClick={toggleResearch}
             disabled={isLoading}
             className={`p-3 rounded-full transition ${
               useResearch 
                 ? 'bg-blue-100 text-blue-600 hover:bg-blue-200' 
                 : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
             } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
             title="Toggle Research Mode"
           >
              <Search size={24} />
           </button>
          <input
            type="text"
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder={useResearch ? "Ask a research question..." : "Ask a Question...."}
            disabled={isLoading}
            className="flex-1 py-4 text-lg outline-none text-gray-700 placeholder:text-gray-300 bg-transparent disabled:opacity-50"
          />
          <button 
              onClick={handleSend}
              disabled={isLoading || !chatInput.trim()}
              className="p-3 bg-black text-white rounded-xl hover:bg-gray-800 transition shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
             <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
