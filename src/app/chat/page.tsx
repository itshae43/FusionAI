"use client";

import React, { useState, useRef, useEffect, useMemo } from 'react';
import { FileSpreadsheet, Loader2 } from 'lucide-react';
import { ChatMessage } from '@/types';
import ChatInput from '@/components/chat/ChatInput';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { AnalysisOutput } from '@/components/analysis/AnalysisOutput';
import { supabase } from '@/lib/supabase';

type AnalysisApiFile = {
  id: string;
  name: string;
};

export default function ChatPage() {
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [streamingMessage, setStreamingMessage] = useState('');
  const [availableFiles, setAvailableFiles] = useState<Array<{ id: string; name: string }>>([]);
  const [currentChatId, setCurrentChatId] = useState<string>('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Load chat history from sessionStorage on mount
  useEffect(() => {
    const savedHistory = sessionStorage.getItem('fusion-ai-current-chat');
    const savedChatId = sessionStorage.getItem('fusion-ai-current-chat-id');
    
    if (savedHistory) {
      try {
        setChatHistory(JSON.parse(savedHistory));
      } catch (e) {
        console.error('Failed to load chat history:', e);
      }
    }
    
    if (savedChatId) {
      setCurrentChatId(savedChatId);
    }
  }, []);

  // Save chat history to sessionStorage whenever it changes
  useEffect(() => {
    if (chatHistory.length > 0) {
      sessionStorage.setItem('fusion-ai-current-chat', JSON.stringify(chatHistory));
    } else {
      sessionStorage.removeItem('fusion-ai-current-chat');
    }
  }, [chatHistory]);

  // Save current chat ID to sessionStorage
  useEffect(() => {
    if (currentChatId) {
      sessionStorage.setItem('fusion-ai-current-chat-id', currentChatId);
    } else {
      sessionStorage.removeItem('fusion-ai-current-chat-id');
    }
  }, [currentChatId]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory, streamingMessage]);

  useEffect(() => {
    const fetchFiles = async () => {
      const { data, error } = await supabase
        .from('files')
        .select('id, name')
        .order('uploaded_at', { ascending: false });

      if (error) {
        console.error('Failed to load files for chat:', error.message);
        return;
      }

      setAvailableFiles((data ?? []).map((file) => ({ id: file.id, name: file.name })));
    };

    fetchFiles();
  }, []);

  // Listen for clear/new chat event
  useEffect(() => {
    const handleClearChat = () => {
      setChatHistory([]);
      setCurrentChatId('');
      setStreamingMessage('');
      sessionStorage.removeItem('fusion-ai-current-chat');
      sessionStorage.removeItem('fusion-ai-current-chat-id');
    };

    window.addEventListener('fusion-ai-clear-chat', handleClearChat);
    return () => {
      window.removeEventListener('fusion-ai-clear-chat', handleClearChat);
    };
  }, []);

  // Create chat entry when first message is sent
  const createChatEntry = (firstMessage: string) => {
    const chatId = Date.now().toString();
    const title = firstMessage.length > 50 ? firstMessage.substring(0, 50) + '...' : firstMessage;
    
    const event = new CustomEvent('fusion-ai-new-chat', {
      detail: {
        id: chatId,
        title,
        timestamp: 'Just now',
        createdAt: Date.now(),
      }
    });
    
    window.dispatchEvent(event);
    setCurrentChatId(chatId);
  };

  const fileNameMap = useMemo(() => {
    const map = new Map<string, string>();
    availableFiles.forEach((file) => map.set(file.id, file.name));
    return map;
  }, [availableFiles]);

  const handleSendMessage = async (
    text: string,
    fileIds: string[],
    useResearch: boolean,
    useAnalysis: boolean,
  ) => {
    // Create chat entry on first message
    if (chatHistory.length === 0 && !currentChatId) {
      createChatEntry(text);
    }

    // Add user message to chat
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: text,
      attachments: useAnalysis ? fileIds.map((id) => fileNameMap.get(id) || 'Dataset') : [],
    };
    setIsLoading(true);
    setStreamingMessage('');

    if (useAnalysis) {
      const analysisMessageId = `${Date.now()}-analysis`;

      setChatHistory(prev => [
        ...prev,
        userMsg,
        {
          id: analysisMessageId,
          role: 'system',
          text: 'Running data analysis...',
          analysis: {
            status: 'running',
            result: {},
          },
        },
      ]);

      try {
        const response = await fetch('/api/chat/analyze', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            question: text,
            fileIds,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Analysis failed');
        }

        setChatHistory(prev => prev.map(msg => {
          if (msg.id !== analysisMessageId) return msg;

          const normalizedStdout = typeof data.stdout === 'string' ? data.stdout.trim() : '';
          const filesUsed: AnalysisApiFile[] = Array.isArray(data.files)
            ? data.files.filter((file: Partial<AnalysisApiFile>): file is AnalysisApiFile =>
                !!file && typeof file.id === 'string' && typeof file.name === 'string')
            : [];

          return {
            id: analysisMessageId,
            role: 'system',
            text: data.status === 'completed' ? 'Data analysis finished.' : 'Data analysis output',
            analysis: {
              status: data.status || (data.error ? 'error' : 'completed'),
              result: {
                text: normalizedStdout || (data.error ? undefined : 'Analysis completed successfully.'),
                error: data.error,
              },
              code: data.code,
              files: filesUsed,
            },
          };
        }));
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown error during analysis';
        setChatHistory(prev => prev.map(msg => {
          if (msg.id !== analysisMessageId) return msg;
          return {
            ...msg,
            text: 'Analysis failed',
            analysis: {
              status: 'error',
              result: {
                error: {
                  name: 'AnalysisError',
                  message,
                  traceback: '',
                },
              },
            },
          };
        }));
      } finally {
        setIsLoading(false);
      }

      return;
    }

    setChatHistory(prev => [...prev, userMsg]);

    try {
      // Call the chat API
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            ...chatHistory.map(msg => ({
              role: msg.role,
              content: msg.text
            })),
            { role: 'user', content: text }
          ],
          useResearch
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      // Handle streaming response
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let fullResponse = '';

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          fullResponse += chunk;
          setStreamingMessage(fullResponse);
        }
      }

      // Add assistant message to chat history
      const assistantMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'system',
        text: fullResponse,
      };
      
      setChatHistory(prev => [...prev, assistantMsg]);
      setStreamingMessage('');

    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      console.error('Chat error:', message);
      
      // Add error message
      const errorMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'system',
        text: `Sorry, I encountered an error: ${message}. Please try again.`,
      };
      setChatHistory(prev => [...prev, errorMsg]);
      
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col relative">
      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-8 pb-32">
        {chatHistory.length === 0 && !streamingMessage ? (
          <div className="h-full flex flex-col items-center justify-center text-gray-400 space-y-4">
             <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mb-2">
                <FileSpreadsheet size={32} className="text-gray-300"/>
             </div>
             <p className="text-lg font-medium text-gray-500">Ask me anything or enable research mode</p>
             <p className="text-sm text-gray-400">Click the search icon to search the web for answers</p>
          </div>
        ) : (
          <div className="space-y-6 w-full flex flex-col items-center">
            {chatHistory.map(msg => (
              <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} w-full max-w-4xl px-8`}>
                <div className={`
                  ${msg.role === 'user' ? 'max-w-2xl' : 'w-full'}
                `}>
                  {msg.analysis ? (
                    <div className="space-y-3">
                      <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                        Data Analysis
                      </p>
                      <p className="text-sm text-gray-700">{msg.text}</p>
                      <AnalysisOutput
                        result={msg.analysis.result || {}}
                        status={msg.analysis.status}
                      />
                      {msg.analysis.code && (
                        <details className="text-sm text-gray-500">
                          <summary className="cursor-pointer text-gray-600 hover:text-gray-900">
                            View generated Python
                          </summary>
                          <pre className="mt-2 text-xs bg-gray-900 text-gray-100 rounded-lg p-3 overflow-auto">
                            {msg.analysis.code}
                          </pre>
                        </details>
                      )}
                    </div>
                  ) : msg.role === 'system' ? (
                    <div className="prose prose-base max-w-none text-gray-800">
                      <ReactMarkdown 
                        remarkPlugins={[remarkGfm]}
                        components={{
                          a: ({ node, ...props }) => (
                            <a
                              {...props}
                              className="text-blue-600 hover:text-blue-800 underline font-medium"
                              target="_blank"
                              rel="noopener noreferrer"
                            />
                          ),
                          h1: ({ node, ...props }) => (
                            <h1 {...props} className="text-2xl font-bold text-gray-900 mt-6 mb-4" />
                          ),
                          h2: ({ node, ...props }) => (
                            <h2 {...props} className="text-xl font-bold text-gray-900 mt-5 mb-3" />
                          ),
                          h3: ({ node, ...props }) => (
                            <h3 {...props} className="text-lg font-semibold text-gray-900 mt-4 mb-2" />
                          ),
                          ul: ({ node, ...props }) => (
                            <ul {...props} className="list-disc list-inside space-y-2 my-3" />
                          ),
                          ol: ({ node, ...props }) => (
                            <ol {...props} className="list-decimal list-inside space-y-2 my-3" />
                          ),
                          li: ({ node, ...props }) => (
                            <li {...props} className="text-gray-800 leading-relaxed" />
                          ),
                          p: ({ node, ...props }) => (
                            <p {...props} className="text-gray-800 leading-relaxed my-3" />
                          ),
                          code: ({ node, inline, ...props }: any) => 
                            inline ? (
                              <code {...props} className="bg-gray-100 text-red-600 px-1.5 py-0.5 rounded text-sm font-mono" />
                            ) : (
                              <code {...props} className="block bg-gray-900 text-gray-100 p-3 rounded-lg overflow-x-auto text-sm font-mono" />
                            ),
                          blockquote: ({ node, ...props }) => (
                            <blockquote {...props} className="border-l-4 border-gray-300 pl-4 italic text-gray-700 my-3" />
                          ),
                        }}
                      >
                        {msg.text}
                      </ReactMarkdown>
                    </div>
                  ) : (
                    <div className="bg-gray-100 rounded-2xl px-5 py-3 inline-block">
                      <p className="text-gray-900">{msg.text}</p>
                    </div>
                  )}
                  {msg.attachments && msg.attachments.length > 0 && (
                     <div className="mt-3 flex gap-2 flex-wrap">
                        {msg.attachments.map((att, i) => (
                           <span key={i} className="text-xs bg-green-100 text-green-800 px-3 py-1.5 rounded-lg flex items-center gap-1.5 font-medium">
                              <FileSpreadsheet size={13}/> {att}
                           </span>
                        ))}
                     </div>
                  )}
                </div>
              </div>
            ))}
            
            {/* Streaming message */}
            {streamingMessage && (
              <div className="flex justify-start w-full max-w-4xl px-8">
                <div className="w-full">
                  <div className="prose prose-base max-w-none text-gray-800">
                    <ReactMarkdown 
                      remarkPlugins={[remarkGfm]}
                      components={{
                        a: ({ node, ...props }) => (
                          <a
                            {...props}
                            className="text-blue-600 hover:text-blue-800 underline font-medium"
                            target="_blank"
                            rel="noopener noreferrer"
                          />
                        ),
                        h1: ({ node, ...props }) => (
                          <h1 {...props} className="text-2xl font-bold text-gray-900 mt-6 mb-4" />
                        ),
                        h2: ({ node, ...props }) => (
                          <h2 {...props} className="text-xl font-bold text-gray-900 mt-5 mb-3" />
                        ),
                        h3: ({ node, ...props }) => (
                          <h3 {...props} className="text-lg font-semibold text-gray-900 mt-4 mb-2" />
                        ),
                        ul: ({ node, ...props }) => (
                          <ul {...props} className="list-disc list-inside space-y-2 my-3" />
                        ),
                        ol: ({ node, ...props }) => (
                          <ol {...props} className="list-decimal list-inside space-y-2 my-3" />
                        ),
                        li: ({ node, ...props }) => (
                          <li {...props} className="text-gray-800 leading-relaxed" />
                        ),
                        p: ({ node, ...props }) => (
                          <p {...props} className="text-gray-800 leading-relaxed my-3" />
                        ),
                        code: ({ node, inline, ...props }: any) => 
                          inline ? (
                            <code {...props} className="bg-gray-100 text-red-600 px-1.5 py-0.5 rounded text-sm font-mono" />
                          ) : (
                            <code {...props} className="block bg-gray-900 text-gray-100 p-3 rounded-lg overflow-x-auto text-sm font-mono" />
                          ),
                        blockquote: ({ node, ...props }) => (
                          <blockquote {...props} className="border-l-4 border-gray-300 pl-4 italic text-gray-700 my-3" />
                        ),
                      }}
                    >
                      {streamingMessage}
                    </ReactMarkdown>
                  </div>
                  <div className="mt-3 flex items-center gap-2 text-xs text-gray-400">
                    <Loader2 size={12} className="animate-spin" />
                    Typing...
                  </div>
                </div>
              </div>
            )}
            
            {/* Loading indicator */}
            {isLoading && !streamingMessage && chatHistory[chatHistory.length - 1]?.role !== 'system' && (
              <div className="flex justify-start w-full max-w-4xl px-8">
                <div className="w-full">
                  <div className="flex items-center gap-3 text-gray-700 bg-gray-50 rounded-xl px-4 py-3 border border-gray-200">
                    <Loader2 size={18} className="animate-spin text-gray-500" />
                    <span className="font-medium">Thinking...</span>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={chatEndRef} />
          </div>
        )}
      </div>

      {/* Input Area */}
      <ChatInput 
        onSend={handleSendMessage} 
        isLoading={isLoading} 
        files={availableFiles}
      />
    </div>
  );
}
