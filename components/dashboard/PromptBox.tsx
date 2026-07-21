"use client";

import { Paperclip, Image as ImageIcon, Mic, ArrowUp, X } from "lucide-react";
import Image from "next/image";
import { useState, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import TextareaAutosize from 'react-textarea-autosize';
import { useChat } from "@/lib/hooks/useChat";
import { useChatStore } from "@/store/chatStore";

export default function PromptBox() {
  const router = useRouter();
  const pathname = usePathname();
  const [prompt, setPrompt] = useState("");
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [mimeType, setMimeType] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const { sendMessage } = useChat();
  const { isLoading } = useChatStore();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      const base64Data = result.split(',')[1];
      setImageBase64(base64Data);
      setMimeType(file.type);
    };
    reader.readAsDataURL(file);
    
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!prompt.trim() && !imageBase64) return;
    if (isLoading) return;
    
    const currentPrompt = prompt;
    const currentImg = imageBase64;
    const currentMime = mimeType;
    
    setPrompt("");
    setImageBase64(null);
    setMimeType(null);

    const newConversationId = await sendMessage(currentPrompt, currentImg || undefined, currentMime || undefined);
    
    if (newConversationId && !pathname.includes('/chat/')) {
      router.push(`/dashboard/chat/${newConversationId}`);
    }
  };

  return (
    <div className="w-full max-w-[900px] mx-auto bg-white rounded-3xl p-4 shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-[#ECE8E2] transition-shadow duration-300 focus-within:shadow-[0_8px_40px_rgba(201,135,102,0.08)] focus-within:border-[#C98766]/30">
      
      {imageBase64 && (
        <div className="mb-3 relative inline-block h-20 w-20">
          <Image src={"data:" + mimeType + ";base64," + imageBase64} alt="Upload preview" fill className="rounded-xl object-cover border border-[#ECE8E2]" sizes="80px" />
          <button 
            type="button"
            onClick={() => { setImageBase64(null); setMimeType(null); }}
            className="absolute -top-2 -right-2 bg-[#1D1D1F] text-white p-1 rounded-full hover:bg-gray-800 transition"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col h-full min-h-[50px]">
        <TextareaAutosize
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Ask Belle anything about skincare, hairstyle, fashion, grooming..."
          className="flex-1 w-full resize-none bg-transparent outline-none text-[#1D1D1F] text-[17px] placeholder:text-[#6E6E73]/60 placeholder:font-light leading-relaxed p-2"
          minRows={1}
          maxRows={6}
          disabled={isLoading}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSubmit();
            }
          }}
        />
        
        <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#ECE8E2]/50">
          <div className="flex items-center gap-2">
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              accept="image/*" 
              className="hidden" 
            />
            <button 
              type="button" 
              onClick={() => fileInputRef.current?.click()}
              disabled={isLoading}
              className="p-2 text-[#6E6E73] hover:text-[#1D1D1F] hover:bg-[#F2F2F7]/50 rounded-full transition-colors disabled:opacity-50"
            >
              <Paperclip className="w-5 h-5" />
            </button>
            <button 
              type="button" 
              onClick={() => fileInputRef.current?.click()}
              disabled={isLoading}
              className="p-2 text-[#6E6E73] hover:text-[#1D1D1F] hover:bg-[#F2F2F7]/50 rounded-full transition-colors disabled:opacity-50"
            >
              <ImageIcon className="w-5 h-5" />
            </button>
          </div>
          
          <div className="flex items-center gap-2">
            <button type="button" disabled={isLoading} className="p-2 text-[#6E6E73] hover:text-[#1D1D1F] hover:bg-[#F2F2F7]/50 rounded-full transition-colors disabled:opacity-50">
              <Mic className="w-5 h-5" />
            </button>
            <button
              type="submit"
              disabled={(!prompt.trim() && !imageBase64) || isLoading}
              className="p-2.5 rounded-full transition-all duration-200 disabled:opacity-50 disabled:bg-[#F2F2F7] disabled:text-[#6E6E73] bg-[#1D1D1F] text-white hover:bg-[#C98766]"
            >
              <ArrowUp className="w-5 h-5" />
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
