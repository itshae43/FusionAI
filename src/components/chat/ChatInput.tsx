"use client";

import React, { useState } from 'react';
import { Send, X, FileSpreadsheet, Search, BarChart3 } from 'lucide-react';

interface ChatInputProps {
  onSend: (text: string, fileIds: string[], useResearch: boolean, useAnalysis: boolean) => void;
  isLoading?: boolean;
  files?: Array<{ id: string; name: string }>;
}

export default function ChatInput({ onSend, isLoading, files = [] }: ChatInputProps) {
  const [chatInput, setChatInput] = useState('');
  const [selectedFileIds, setSelectedFileIds] = useState<string[]>([]);
  const [isFocused, setIsFocused] = useState(false);
  const [useResearch, setUseResearch] = useState(false);
  const [useAnalysis, setUseAnalysis] = useState(false);

  const handleSend = () => {
    if (!chatInput.trim() || isLoading) return;
    if (useAnalysis && selectedFileIds.length === 0) return;

    const outgoingFileIds = useAnalysis ? selectedFileIds : [];

    onSend(chatInput, outgoingFileIds, useResearch, useAnalysis);
    setChatInput('');
  };

  const toggleResearch = () => {
    const next = !useResearch;
    setUseResearch(next);
    if (next) {
      setUseAnalysis(false);
    }
  };

  const handleAddFile = (fileId: string) => {
    if (!fileId || selectedFileIds.includes(fileId)) return;
    setSelectedFileIds(prev => [...prev, fileId]);
    setUseAnalysis(true);
    setUseResearch(false);
  };

  const handleRemoveFile = (fileId: string) => {
    setSelectedFileIds(prev => {
      const next = prev.filter(id => id !== fileId);
      if (next.length === 0) {
        setUseAnalysis(false);
      }
      return next;
    });
  };

  const availableOptions = files.filter(file => !selectedFileIds.includes(file.id));

  const getFileName = (id: string) => files.find(file => file.id === id)?.name || 'Unnamed file';

  return (
    <div className="absolute bottom-8 left-0 right-0 px-8 flex justify-center">
      <div className={`
        w-full max-w-4xl bg-white p-2 rounded-3xl shadow-2xl border relative transition-all
        ${isFocused ? 'border-[#B4EBE2]' : 'border-gray-100'}
      `}>
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

        {useAnalysis && (
          <div className="absolute -top-12 right-4 animate-fade-in">
            <div className="flex items-center gap-2 bg-purple-50 text-purple-800 px-3 py-1.5 rounded-lg border border-purple-100 text-sm font-medium shadow-sm">
              <BarChart3 size={16} className="text-purple-600" />
              Analysis Mode
              <button
                onClick={() => {
                  setUseAnalysis(false);
                  setSelectedFileIds([]);
                }}
                className="hover:bg-purple-100 rounded-full p-0.5 ml-1"
              >
                <X size={14} />
              </button>
            </div>
          </div>
        )}

        {selectedFileIds.length > 0 && (
          <div className="px-4 pb-2 flex flex-wrap gap-2">
            {selectedFileIds.map(fileId => (
              <span
                key={fileId}
                className="text-xs bg-green-50 text-green-700 px-3 py-1 rounded-full border border-green-100 flex items-center gap-2"
              >
                <FileSpreadsheet size={12} />
                {getFileName(fileId)}
                <button
                  onClick={() => handleRemoveFile(fileId)}
                  className="text-green-600 hover:text-green-900"
                >
                  <X size={12} />
                </button>
              </span>
            ))}
          </div>
        )}

        {availableOptions.length > 0 && (
          <div className="px-4 pb-2">
            <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">
              Attach dataset
            </label>
            <select
              className="w-full text-sm border border-gray-200 rounded-2xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#B4EBE2]"
              defaultValue=""
              disabled={isLoading}
              onChange={(event) => {
                const value = event.currentTarget.value;
                handleAddFile(value);
                event.currentTarget.value = '';
              }}
            >
              <option value="" disabled>
                {selectedFileIds.length === 0 ? 'Select a CSV to analyze' : 'Attach another CSV'}
              </option>
              {availableOptions.map((file) => (
                <option key={file.id} value={file.id}>
                  {file.name}
                </option>
              ))}
            </select>
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
          <button
            onClick={() => {
              if (selectedFileIds.length === 0 || isLoading) return;
              setUseAnalysis(prev => !prev);
              if (!useAnalysis) {
                setUseResearch(false);
              }
            }}
            disabled={isLoading || selectedFileIds.length === 0}
            className={`p-3 rounded-full transition ${
              useAnalysis 
                ? 'bg-purple-100 text-purple-600 hover:bg-purple-200' 
                : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
            } ${(isLoading || selectedFileIds.length === 0) ? 'opacity-50 cursor-not-allowed' : ''}`}
            title={selectedFileIds.length === 0 ? 'Attach a CSV to enable analysis' : 'Toggle Analysis Mode'}
          >
            <BarChart3 size={24} />
          </button>

          <input
            type="text"
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder={useAnalysis ? "Ask about your data..." : useResearch ? "Ask a research question..." : "Ask a Question...."}
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
