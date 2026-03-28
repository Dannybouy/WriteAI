"use client";

import { Draft } from "@/types";
import { useAppStore } from "@/lib/store";
import { Check } from "lucide-react";
import Image from "next/image";

interface DraftCardProps {
  draft: Draft;
  index: number;
}

export default function DraftCard({ draft, index }: DraftCardProps) {
  const { selected_draft_id, selectDraft } = useAppStore();

  const isSelected = selected_draft_id === draft.draft_number;
  const hasSelection = selected_draft_id !== null;
  const isMuted = hasSelection && !isSelected;

  const handleSelect = () => {
    selectDraft(draft.draft_number);
    setTimeout(() => {
      document.getElementById('phase-2')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const stripMarkdown = (md: string) => {
    return md.replace(/[#*`_\[\]]/g, '').substring(0, 150) + "...";
  };

  return (
    <div 
      className={`relative w-full h-full flex flex-col bg-[#0A0A0A] rounded-[16px] transition-all duration-300 group overflow-hidden ${
        isSelected ? 'border-2 border-[#FF5A00] shadow-[0_4px_30px_rgba(255,90,0,0.2)] md:scale-[1.02]' : 'border border-white/10 hover:border-white/30'
      } ${isMuted ? 'opacity-40 hover:opacity-100' : 'opacity-100'}`}
    >
      {isSelected && (
        <div className="absolute top-4 right-4 z-20 bg-[#FF5A00] text-white w-8 h-8 rounded-full flex items-center justify-center shadow-lg">
          <Check size={20} strokeWidth={3} />
        </div>
      )}

      {isMuted && (
        <div className="absolute inset-0 z-30 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer" onClick={handleSelect}>
          <span className="font-heading text-xl text-white uppercase tracking-widest px-6 py-3 border-2 border-white rounded-[8px] bg-black/50 backdrop-blur-sm shadow-xl">
            Change Selection
          </span>
        </div>
      )}

      <div className="p-6 md:p-8 flex flex-col flex-1 relative z-10">
        
        <div className="flex justify-between items-start mb-5">
          <div className="bg-black border border-[#FF5A00]/40 text-[#FF5A00] font-sans text-[12px] font-bold uppercase tracking-widest px-3 py-1 rounded-full shadow-sm">
            DRAFT {index + 1}
          </div>
          <div className="bg-[#1A1A1A] border border-white/5 text-[#B3B3B3] font-sans text-[12px] uppercase tracking-widest px-3 py-1 rounded-full">
            {draft.body.length} WORDS
          </div>
        </div>

        <p className="font-sans text-[13px] md:text-[14px] text-[#B3B3B3] uppercase tracking-[0.1em] mb-3 font-medium">
          {draft.angle}
        </p>

        <h3 className="font-heading text-[22px] md:text-[24px] text-white uppercase leading-tight mb-4 tracking-wide">
          {draft.title}
        </h3>

        <div className="mb-5 inline-flex">
          <span className="bg-black border border-[#FF5A00]/80 text-[#FF5A00] font-sans text-[11px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full">
            {draft.primary_keyword}
          </span>
        </div>

        <p className="font-sans text-[14px] text-[#B3B3B3] leading-relaxed line-clamp-2 mb-6">
          {draft.meta_description}
        </p>

        {draft.image_url ? (
          <div className="w-full aspect-video relative rounded-[8px] overflow-hidden mb-6 border border-white/10 bg-[#1A1A1A]">
            <Image 
              src={draft.image_url} 
              alt={draft.primary_keyword} 
              fill 
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
            />
          </div>
        ) : (
          <div className="flex-1 mb-6">
            <p className="font-sans text-[14px] text-white/60 leading-relaxed italic border-l-[3px] border-white/10 pl-4 h-full">
              "{stripMarkdown(draft.body)}"
            </p>
          </div>
        )}

        <div className="mt-auto pt-2">
          <button
            onClick={handleSelect}
            className={`w-full font-heading font-medium text-[16px] uppercase tracking-[0.05em] py-4 rounded-[8px] transition-all duration-300 border-[2px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#FF5A00] ${
              isSelected 
                ? 'bg-[#FF5A00] text-white border-[#FF5A00]' 
                : 'bg-black text-[#FF5A00] border-[#FF5A00]/50 hover:border-[#FF5A00] hover:bg-[#FF5A00] hover:text-white'
            }`}
          >
            {isSelected ? 'SELECTED' : 'SELECT THIS DRAFT'}
          </button>
        </div>
      </div>
    </div>
  );
}
