"use client";

import React, { useState } from 'react';
import { Plus, Send, X, FileSpreadsheet } from 'lucide-react';

interface ChatInputProps {
  onSend: (text: string, attachment: string | null) => void;
}

export default function ChatInput({ onSend }: ChatInputProps) {
  const [chatInput, setChatInput] = useState('');
  const [uploadedFile, setUploadedFile] = useState<string | null>('Business.csv');
  const [isFocused, setIsFocused] = useState(false);

  const handleSend = () => {
    if (!chatInput.trim()) return;
    onSend(chatInput, uploadedFile);
    setChatInput('');
    setUploadedFile(null);
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

        <div className="flex items-center gap-3 px-2">
           <button className="p-3 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition">
              <Plus size={24} />
           </button>
          <input
            type="text"
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder="Ask a Question...."
            className="flex-1 py-4 text-lg outline-none text-gray-700 placeholder:text-gray-300 bg-transparent"
          />
          <button 
              onClick={handleSend}
              className="p-3 bg-black text-white rounded-xl hover:bg-gray-800 transition shadow-lg"
          >
             <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
