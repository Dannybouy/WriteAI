"use client";

import { useAppStore } from "@/lib/store";
import DraftCard from "./DraftCard";

export default function DraftGrid() {
  const { current_drafts } = useAppStore();

  if (!current_drafts || current_drafts.length === 0) return null;

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 justify-center px-10">
        {current_drafts.map((draft, index) => (
          <div 
            key={draft.draft_number} 
            className={`w-full max-w-[500px] mx-auto lg:max-w-none ${
               index === 2 ? 'md:col-span-2 lg:col-span-1 md:flex md:justify-center' : ''
            }`}
          >
            <div className={index === 2 ? 'w-full md:max-w-[500px] lg:max-w-none' : 'w-full h-full'}>
              <DraftCard draft={draft} index={index} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
