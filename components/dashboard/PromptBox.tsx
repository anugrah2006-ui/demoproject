"use client";

import { Paperclip, Image as ImageIcon, Mic, ArrowUp } from "lucide-react";
import { useState } from "react";

export default function PromptBox() {
  const [prompt, setPrompt] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;
    // Logic to send message goes here
    console.log("Sending:", prompt);
    setPrompt("");
  };

  return (
    <div className="w-full max-w-[900px] mx-auto bg-white rounded-3xl p-4 shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-[#ECE8E2] transition-shadow duration-300 focus-within:shadow-[0_8px_40px_rgba(201,135,102,0.08)] focus-within:border-[#C98766]/30">
      <form onSubmit={handleSubmit} className="flex flex-col h-full min-h-[140px]">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Ask Belle anything about skincare, hairstyle, fashion, grooming, lifestyle or confidence..."
          className="flex-1 w-full resize-none bg-transparent outline-none text-[#1D1D1F] text-lg placeholder:text-[#6E6E73]/60 placeholder:font-light leading-relaxed p-2"
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSubmit(e);
            }
          }}
        />
        
        <div className="flex items-center justify-between mt-auto pt-4">
          <div className="flex items-center gap-2">
            <button type="button" className="p-2 text-[#6E6E73] hover:text-[#1D1D1F] hover:bg-[#F2F2F7]/50 rounded-full transition-colors">
              <Paperclip className="w-5 h-5" />
            </button>
            <button type="button" className="p-2 text-[#6E6E73] hover:text-[#1D1D1F] hover:bg-[#F2F2F7]/50 rounded-full transition-colors">
              <ImageIcon className="w-5 h-5" />
            </button>
          </div>
          
          <div className="flex items-center gap-2">
            <button type="button" className="p-2 text-[#6E6E73] hover:text-[#1D1D1F] hover:bg-[#F2F2F7]/50 rounded-full transition-colors">
              <Mic className="w-5 h-5" />
            </button>
            <button
              type="submit"
              disabled={!prompt.trim()}
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
