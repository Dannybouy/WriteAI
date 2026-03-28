"use client";

import { useState } from "react";
import { useAppStore } from "@/lib/store";
import HistoryRow from "./HistoryRow";
import HistoryDraftModal from "./HistoryDraftModal";
import { Search, FileText } from "lucide-react";
import Link from "next/link";
import { JobRecord } from "@/types";

type FilterStatus = 'All' | 'published' | 'scheduled' | 'failed' | 'draft';

export default function HistoryList() {
  const { history_jobs } = useAppStore();
  const [filter, setFilter] = useState<FilterStatus>('All');
  const [search, setSearch] = useState("");
  const [selectedJob, setSelectedJob] = useState<JobRecord | null>(null);

  const statuses: FilterStatus[] = ['All', 'published', 'scheduled', 'failed', 'draft'];

  const filteredJobs = history_jobs.filter(job => {
    // Filter by status
    if (filter !== 'All' && job.status !== filter) return false;
    
    // Search by keyword or input
    if (search.trim()) {
      const q = search.toLowerCase();
      // Search raw input or drafts titles
      const matchInput = job.rawInput.toLowerCase().includes(q);
      const matchTitle = job.drafts.some(d => d.title.toLowerCase().includes(q));
      if (!matchInput && !matchTitle) return false;
    }
    
    return true;
  });

  if (history_jobs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-16 bg-[#0A0A0A] border border-white/5 rounded-[16px] text-center mt-8">
        <div className="w-24 h-24 bg-[#1A1A1A] rounded-full flex items-center justify-center mb-6">
          <FileText size={48} className="text-[#333333]" />
        </div>
        <h2 className="font-heading text-3xl text-white uppercase tracking-tight mb-3">
          NO CONTENT YET
        </h2>
        <p className="font-sans text-[#B3B3B3] text-[16px] mb-8">
          Your generated content will appear here
        </p>
        <Link 
          href="/"
          className="bg-[#FF5A00] hover:bg-[#FF5A00]/90 text-white uppercase font-heading font-medium tracking-widest px-8 py-4 rounded-[8px] transition-colors"
        >
          CREATE YOUR FIRST DRAFT
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 w-full">
      
      {/* Filter Bar */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 bg-[#0A0A0A] p-4 lg:p-2 rounded-[12px] border border-white/10">
        
        {/* Status Tabs */}
        <div className="flex overflow-x-auto hide-scrollbar gap-2">
          {statuses.map(s => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`flex-shrink-0 px-6 py-3 font-heading text-[16px] uppercase tracking-widest rounded-[8px] transition-colors ${
                filter === s ? 'bg-[#FF5A00] text-white' : 'bg-transparent text-[#B3B3B3] hover:text-white hover:bg-white/5'
              }`}
            >
              {s === 'draft' ? 'Awaiting Selection' : s}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full xl:max-w-md lg:mr-2">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#B3B3B3]" size={20} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search keyword or title..."
            className="w-full bg-black border border-white/10 text-white pl-12 pr-4 py-3.5 rounded-[8px] font-sans text-[15px] focus:outline-none focus:border-[#FF5A00] transition-colors placeholder:text-[#666666]"
          />
        </div>
      </div>

      {/* List */}
      <div className="flex flex-col gap-4">
        {filteredJobs.length > 0 ? (
          filteredJobs.map(job => (
            <HistoryRow key={job.id} job={job} onViewDrafts={() => setSelectedJob(job)} />
          ))
        ) : (
          <div className="py-16 text-center text-[#B3B3B3] font-sans">
            No jobs found matching your filters.
          </div>
        )}
      </div>

      {/* Modal */}
      {selectedJob && (
        <HistoryDraftModal job={selectedJob} onClose={() => setSelectedJob(null)} />
      )}
    </div>
  );
}
