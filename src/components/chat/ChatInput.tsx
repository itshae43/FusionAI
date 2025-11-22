"use client";

import React, { useState } from 'react';
import { Send, X, FileSpreadsheet, Search, BarChart3, Plus } from 'lucide-react';

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
  const [showFileSelector, setShowFileSelector] = useState(false);

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
    setShowFileSelector(false);
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
        w-full max-w-4xl bg-white rounded-3xl shadow-2xl border relative transition-all
        ${isFocused ? 'border-[#B4EBE2] ring-4 ring-[#B4EBE2]/20' : 'border-gray-200'}
      `}>
        {/* Mode indicators */}
        {useResearch && (
          <div className="absolute -top-12 right-4 animate-fade-in">
            <div className="flex items-center gap-2 bg-blue-50 text-blue-800 px-3 py-1.5 rounded-lg border border-blue-100 text-sm font-medium shadow-sm">
              <Search size={16} className="text-blue-600" />
              Research Mode
              <button 
                onClick={() => setUseResearch(false)}
                className="hover:bg-blue-100 rounded-full p-0.5 ml-1 transition"
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
              Analysis Mode · {selectedFileIds.length} file{selectedFileIds.length !== 1 ? 's' : ''}
              <button
                onClick={() => {
                  setUseAnalysis(false);
                  setSelectedFileIds([]);
                }}
                className="hover:bg-purple-100 rounded-full p-0.5 ml-1 transition"
              >
                <X size={14} />
              </button>
            </div>
          </div>
        )}

        {/* Selected files */}
        {selectedFileIds.length > 0 && (
          <div className="px-4 pt-3 pb-2 flex flex-wrap gap-2 border-b border-gray-100">
            {selectedFileIds.map(fileId => (
              <span
                key={fileId}
                className="text-xs bg-green-50 text-green-800 px-3 py-1.5 rounded-lg border border-green-200 flex items-center gap-2 hover:bg-green-100 transition"
              >
                <FileSpreadsheet size={14} className="text-green-600" />
                <span className="font-medium">{getFileName(fileId)}</span>
                <button
                  onClick={() => handleRemoveFile(fileId)}
                  className="text-green-600 hover:text-green-900 hover:bg-green-200 rounded-full p-0.5 transition"
                  title="Remove file"
                >
                  <X size={12} />
                </button>
              </span>
            ))}
          </div>
        )}

        {/* File selector popup */}
        {showFileSelector && availableOptions.length > 0 && (
          <div className="absolute bottom-full left-4 right-4 mb-2 bg-white rounded-xl shadow-xl border border-gray-200 max-h-64 overflow-y-auto animate-fade-in">
            <div className="sticky top-0 bg-white border-b border-gray-100 px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileSpreadsheet size={18} className="text-purple-600" />
                <span className="font-semibold text-gray-900">Select Dataset</span>
              </div>
              <button
                onClick={() => setShowFileSelector(false)}
                className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full p-1 transition"
              >
                <X size={18} />
              </button>
            </div>
            <div className="p-2">
              {availableOptions.map((file) => (
                <button
                  key={file.id}
                  onClick={() => handleAddFile(file.id)}
                  className="w-full text-left px-3 py-2.5 rounded-lg hover:bg-purple-50 transition flex items-center gap-3 group"
                >
                  <div className="p-2 bg-purple-50 rounded-lg group-hover:bg-purple-100 transition">
                    <FileSpreadsheet size={16} className="text-purple-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">{file.name}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Main input area */}
        <div className="flex items-center gap-2 p-3">
          {/* Attach file button */}
          <button
            onClick={() => setShowFileSelector(!showFileSelector)}
            disabled={isLoading || availableOptions.length === 0}
            className={`p-3 rounded-xl transition flex-shrink-0 ${
              showFileSelector
                ? 'bg-purple-100 text-purple-600'
                : 'text-gray-400 hover:text-purple-600 hover:bg-purple-50'
            } ${(isLoading || availableOptions.length === 0) ? 'opacity-50 cursor-not-allowed' : ''}`}
            title={availableOptions.length === 0 ? 'No datasets available' : 'Attach dataset'}
          >
            <Plus size={20} />
          </button>

          {/* Research mode button */}
          <button 
            onClick={toggleResearch}
            disabled={isLoading || useAnalysis}
            className={`p-3 rounded-xl transition flex-shrink-0 ${
              useResearch 
                ? 'bg-blue-100 text-blue-600' 
                : 'text-gray-400 hover:text-blue-600 hover:bg-blue-50'
            } ${(isLoading || useAnalysis) ? 'opacity-50 cursor-not-allowed' : ''}`}
            title="Toggle Research Mode"
          >
            <Search size={20} />
          </button>

          {/* Text input */}
          <input
            type="text"
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder={useAnalysis ? "Ask about your data..." : useResearch ? "Ask a research question..." : "Ask a question..."}
            disabled={isLoading}
            className="flex-1 py-3 px-4 text-base outline-none text-gray-900 placeholder:text-gray-400 bg-transparent disabled:opacity-50"
          />
          
          {/* Send button */}
          <button 
            onClick={handleSend}
            disabled={isLoading || !chatInput.trim() || (useAnalysis && selectedFileIds.length === 0)}
            className="p-3 bg-black text-white rounded-xl hover:bg-gray-800 transition shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
            title="Send message"
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
