import React, { useEffect, useRef } from 'react';
import Image from 'next/image';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useChatStore, Message } from '@/store/chatStore';
import BelleOrb from './BelleOrb';

export default function ChatThread() {
  const { messages, isLoading, error } = useChatStore();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  if (messages.length === 0 && !isLoading) {
    return null;
  }

  return (
    <div className="flex-1 w-full max-w-[900px] mx-auto overflow-y-auto pb-4 pt-10 px-4 space-y-8 no-scrollbar scroll-smooth">
      {messages.map((message) => (
        <MessageBubble key={message.id} message={message} />
      ))}
      
      {isLoading && messages.length > 0 && messages[messages.length - 1].role === 'user' && (
        <div className="flex items-center gap-4 py-4 animate-pulse">
          <div className="w-12 h-12 flex-shrink-0 flex items-center justify-center bg-[#FAF8F5] rounded-full border border-[#ECE8E2]">
            <div className="scale-[0.25]">
               <BelleOrb />
            </div>
          </div>
          <p className="text-[#6E6E73] text-sm">Belle is thinking...</p>
        </div>
      )}
      
      {error && (
        <div className="p-4 bg-red-50 text-red-600 rounded-2xl border border-red-100 text-sm">
          {error}
        </div>
      )}
      
      <div ref={messagesEndRef} className="h-4" />
    </div>
  );
}

function MessageBubble({ message }: { message: Message }) {
  const isUser = message.role === 'user';
  
  return (
    <div className={"flex gap-4 " + (isUser ? "flex-row-reverse" : "flex-row")}>
      {!isUser && (
        <div className="w-10 h-10 flex-shrink-0 flex items-center justify-center bg-[#FAF8F5] rounded-full border border-[#ECE8E2] mt-1 shadow-sm">
          <div className="scale-[0.2]">
             <BelleOrb />
          </div>
        </div>
      )}
      
      <div 
        className={"max-w-[85%] rounded-3xl p-5 shadow-sm " + 
          (isUser 
            ? "bg-[#1D1D1F] text-white rounded-tr-sm" 
            : "bg-white border border-[#ECE8E2] text-[#1D1D1F] rounded-tl-sm")
        }
      >
        {message.imageUrl && (
          <div className="mb-4 rounded-xl overflow-hidden shadow-sm relative w-full h-[300px]">
            <Image src={message.imageUrl} alt="Attached image or generated AI image" fill className="object-contain" sizes="(max-width: 768px) 100vw, 50vw" />
          </div>
        )}
        
        <div className="prose prose-sm md:prose-base leading-relaxed break-words">
          {isUser ? (
            <p className="whitespace-pre-wrap">{message.content}</p>
          ) : (
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {message.content}
            </ReactMarkdown>
          )}
        </div>
      </div>
    </div>
  );
}
