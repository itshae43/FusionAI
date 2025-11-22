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
  const chatEndRef = useRef<HTMLDivElement>(null);

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
          <div className="space-y-6 w-full">
            {chatHistory.map(msg => (
              <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} w-full`}>
                <div className={`
                  w-full max-w-3xl px-6 py-4
                  ${msg.role === 'user' ? '' : ''}
                `}>
                  {msg.analysis ? (
                    <div className="space-y-3 max-w-4xl">
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
                    <div className="prose prose-base max-w-4xl text-gray-800">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {msg.text}
                      </ReactMarkdown>
                    </div>
                  ) : (
                    <div className="bg-gray-100 rounded-2xl px-5 py-3 inline-block max-w-2xl ml-auto">
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
              <div className="flex justify-start w-full">
                <div className="w-full max-w-3xl px-6 py-4">
                  <div className="prose prose-base max-w-4xl text-gray-800">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
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
            {isLoading && !streamingMessage && (
              <div className="flex justify-start w-full">
                <div className="w-full max-w-3xl px-6 py-4">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Loader2 size={16} className="animate-spin" />
                    <span>Thinking...</span>
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
