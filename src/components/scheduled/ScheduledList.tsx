"use client";

import { useState } from "react";
import { useAppStore } from "@/lib/store";
import ScheduledCard from "./ScheduledCard";
import HistoryDraftModal from "@/components/history/HistoryDraftModal";
import { CalendarClock } from "lucide-react";
import Link from "next/link";
import { JobRecord } from "@/types";

export default function ScheduledList() {
  const { scheduled_jobs } = useAppStore();
  const [selectedJob, setSelectedJob] = useState<JobRecord | null>(null);

  // Sort descending by scheduled_for date
  const sortedJobs = [...scheduled_jobs].sort((a, b) => {
    return new Date(b.scheduledFor).getTime() - new Date(a.scheduledFor).getTime();
  });

  if (scheduled_jobs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-16 bg-[#0A0A0A] border border-white/5 rounded-[16px] text-center mt-8">
        <div className="w-24 h-24 bg-[#1A1A1A] rounded-full flex items-center justify-center mb-6">
          <CalendarClock size={48} className="text-[#333333]" />
        </div>
        <h2 className="font-heading text-3xl text-white uppercase tracking-tight mb-3">
          NOTHING SCHEDULED
        </h2>
        <p className="font-sans text-[#B3B3B3] text-[16px] mb-8">
          Content you schedule will appear here
        </p>
        <Link 
          href="/"
          className="bg-[#FF5A00] hover:bg-[#FF5A00]/90 text-white uppercase font-heading font-medium tracking-widest px-8 py-4 rounded-[8px] transition-colors"
        >
          SCHEDULE NEW CONTENT
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8">
        {sortedJobs.map(job => (
          <ScheduledCard key={job.id} job={job} onViewDrafts={() => setSelectedJob(job as JobRecord)} />
        ))}
      </div>

      {selectedJob && (
        <HistoryDraftModal job={selectedJob} onClose={() => setSelectedJob(null)} />
      )}
    </div>
  );
}
