"use client";

import React, { useState } from 'react';
import { FileSpreadsheet } from 'lucide-react';
import { ChatMessage } from '@/types';
import ChatInput from '@/components/chat/ChatInput';

export default function ChatPage() {
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);

  const handleSendMessage = (text: string, attachment: string | null) => {
    const newMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: text,
      attachments: attachment ? [attachment] : []
    };
    setChatHistory([...chatHistory, newMsg]);
  };

  return (
    <div className="h-full flex flex-col relative">
      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-8 pb-32">
        {chatHistory.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-gray-400 space-y-4">
             <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mb-2">
                <FileSpreadsheet size={32} className="text-gray-300"/>
             </div>
             <p className="text-lg font-medium text-gray-500">Upload a CSV to start researching</p>
          </div>
        ) : (
          <div className="space-y-6 max-w-3xl mx-auto">
            {chatHistory.map(msg => (
              <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`
                  max-w-lg p-4 rounded-2xl
                  ${msg.role === 'user' ? 'bg-gray-100 text-gray-900 rounded-tr-sm' : 'bg-white border border-gray-200 shadow-sm rounded-tl-sm'}
                `}>
                  <p>{msg.text}</p>
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
          </div>
        )}
      </div>

      {/* Input Area */}
      <ChatInput onSend={handleSendMessage} />
    </div>
  );
}
