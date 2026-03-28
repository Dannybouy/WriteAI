import { JobRecord } from "@/types";
import { X } from "lucide-react";
import { useState } from "react";
import MarkdownRenderer from "@/components/shared/MarkdownRenderer";

interface HistoryDraftModalProps {
  job: JobRecord;
  onClose: () => void;
}

export default function HistoryDraftModal({ job, onClose }: HistoryDraftModalProps) {
  const [activeTab, setActiveTab] = useState(0);

  const drafts = job.drafts || [];
  const currentDraft = drafts[activeTab];

  return (
    <div className="fixed inset-0 z-[100] flex flex-col bg-[#000000] animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#0A0A0A]">
        <div className="flex items-center gap-4 cursor-default">
          <span className="font-heading text-2xl text-white uppercase tracking-wide">
            Draft History
          </span>
          <span className="bg-[#1A1A1A] font-sans text-[12px] text-[#B3B3B3] px-3 py-1 rounded-full uppercase tracking-widest hidden sm:inline-block">
            {job.id}
          </span>
        </div>
        <button 
          onClick={onClose}
          className="p-2 text-white hover:text-[#FF5A00] transition-colors bg-[#1A1A1A] rounded-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#FF5A00]"
        >
          <X size={24} />
        </button>
      </div>

      <div className="flex flex-1 overflow-hidden flex-col md:flex-row">
        
        {/* Sidebar Tabs */}
        <div className="w-full md:w-64 border-b md:border-b-0 md:border-r border-white/10 bg-[#0A0A0A] flex flex-row md:flex-col overflow-x-auto md:overflow-y-auto hide-scrollbar shrink-0">
          {drafts.map((draft, idx) => (
            <button
              key={draft.draft_number}
              onClick={() => setActiveTab(idx)}
              className={`flex-shrink-0 text-left px-6 py-5 font-heading text-[16px] uppercase tracking-widest transition-colors border-b md:border-b-0 md:border-l-[4px] ${
                activeTab === idx 
                  ? 'bg-black text-[#FF5A00] border-[#FF5A00]' 
                  : 'bg-transparent text-[#B3B3B3] border-transparent hover:bg-white/5 hover:text-white'
              }`}
            >
              DRAFT {idx + 1}
              {job.selectedDraftId === draft.draft_number && (
                <span className="ml-3 font-sans text-[10px] bg-[#FF5A00]/20 text-[#FF5A00] px-2 py-0.5 rounded-full">
                  Selected
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6 md:p-12 relative bg-black">
          {currentDraft ? (
            <div className="max-w-3xl mx-auto">
              
              <div className="mb-10 pb-8 border-b border-white/10">
                <p className="font-sans text-[14px] text-[#FF5A00] uppercase tracking-widest mb-3 font-medium">
                  {currentDraft.angle}
                </p>
                <h2 className="font-heading text-4xl text-white uppercase leading-tight mb-4">
                  {currentDraft.title}
                </h2>
                <div className="flex items-center gap-4">
                  <span className="font-sans text-[12px] bg-black border border-[#FF5A00]/50 text-[#FF5A00] px-3 py-1.5 rounded-full uppercase tracking-widest font-bold">
                    {currentDraft.primary_keyword}
                  </span>
                </div>
              </div>

              <div className="opacity-90">
                <MarkdownRenderer content={currentDraft.body} />
              </div>
            </div>
          ) : (
            <div className="flex h-full items-center justify-center text-[#B3B3B3] font-sans">
              No draft content available.
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
