"use client";

import React, { useState, useRef, useEffect } from 'react';
import { FileSpreadsheet, Loader2 } from 'lucide-react';
import { ChatMessage } from '@/types';
import ChatInput from '@/components/chat/ChatInput';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function ChatPage() {
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [streamingMessage, setStreamingMessage] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory, streamingMessage]);

  const handleSendMessage = async (text: string, attachment: string | null, useResearch: boolean) => {
    // Add user message to chat
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: text,
      attachments: attachment ? [attachment] : []
    };
    setChatHistory(prev => [...prev, userMsg]);
    
    setIsLoading(true);
    setStreamingMessage('');

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

    } catch (error: any) {
      console.error('Chat error:', error);
      
      // Add error message
      const errorMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'system',
        text: `Sorry, I encountered an error: ${error.message}. Please try again.`,
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
          <div className="space-y-6 max-w-3xl mx-auto">
            {chatHistory.map(msg => (
              <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`
                  max-w-lg p-4 rounded-2xl
                  ${msg.role === 'user' ? 'bg-gray-100 text-gray-900 rounded-tr-sm' : 'bg-white border border-gray-200 shadow-sm rounded-tl-sm'}
                `}>
                  {msg.role === 'system' ? (
                    <div className="prose prose-sm max-w-none">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {msg.text}
                      </ReactMarkdown>
                    </div>
                  ) : (
                    <p>{msg.text}</p>
                  )}
                  {msg.attachments && msg.attachments.length > 0 && (
                     <div className="mt-2 flex gap-2">
                        {msg.attachments.map((att, i) => (
                           <span key={i} className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded flex items-center gap-1">
                              <FileSpreadsheet size={12}/> {att}
                           </span>
                        ))}
                     </div>
                  )}
                </div>
              </div>
            ))}
            
            {/* Streaming message */}
            {streamingMessage && (
              <div className="flex justify-start">
                <div className="max-w-lg p-4 rounded-2xl bg-white border border-gray-200 shadow-sm rounded-tl-sm">
                  <div className="prose prose-sm max-w-none">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {streamingMessage}
                    </ReactMarkdown>
                  </div>
                  <div className="mt-2 flex items-center gap-2 text-xs text-gray-400">
                    <Loader2 size={12} className="animate-spin" />
                    Typing...
                  </div>
                </div>
              </div>
            )}
            
            {/* Loading indicator */}
            {isLoading && !streamingMessage && (
              <div className="flex justify-start">
                <div className="max-w-lg p-4 rounded-2xl bg-white border border-gray-200 shadow-sm rounded-tl-sm">
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
      <ChatInput onSend={handleSendMessage} isLoading={isLoading} />
    </div>
  );
}
