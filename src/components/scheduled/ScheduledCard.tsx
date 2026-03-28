"use client";

import { useEffect, useState } from "react";
import { ScheduledJob } from "@/types";
import { format, differenceInDays, differenceInHours, differenceInMinutes } from "date-fns";
import { useAppStore } from "@/lib/store";
import { Mail } from "lucide-react";
import { LinkedinIcon, TwitterIcon } from "@/components/shared/Icons";

interface ScheduledCardProps {
  job: ScheduledJob;
  onViewDrafts: () => void;
}

export default function ScheduledCard({ job, onViewDrafts }: ScheduledCardProps) {
  const { cancelScheduledJob } = useAppStore();
  const [countdown, setCountdown] = useState<string>("");

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      const scheduledDate = new Date(job.scheduledFor);
      
      const diffMs = scheduledDate.getTime() - now.getTime();
      
      if (diffMs <= 0) {
        setCountdown("Time has passed");
        return;
      }
      
      const days = differenceInDays(scheduledDate, now);
      const hours = differenceInHours(scheduledDate, now) % 24;
      const mins = differenceInMinutes(scheduledDate, now) % 60;
      
      if (days > 0) {
        setCountdown(`In ${days} day${days !== 1 ? 's' : ''}, ${hours} hr${hours !== 1 ? 's' : ''}`);
      } else if (hours > 0) {
        setCountdown(`In ${hours} hr${hours !== 1 ? 's' : ''}, ${mins} min`);
      } else {
        setCountdown(`In ${mins} minute${mins !== 1 ? 's' : ''}`);
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 60000); // every minute

    return () => clearInterval(interval);
  }, [job.scheduledFor]);

  const handleCancel = () => {
    if (confirm("Are you sure you want to cancel this scheduled post?")) {
      cancelScheduledJob(job.id);
    }
  };

  const currentDraft = job.drafts.find(d => d.draft_number === job.selectedDraftId) || job.drafts[0];

  return (
    <div className="flex flex-col bg-[#0A0A0A] border border-white/10 rounded-[16px] p-6 md:p-8 hover:border-[#FF5A00]/50 transition-colors h-full">
      
      <div className="mb-6 flex flex-col gap-2">
        <h3 className="font-heading text-4xl text-[#FF5A00] uppercase tracking-tight leading-none">
          {format(new Date(job.scheduledFor), "d MMM, HH:mm")}
        </h3>
        <p className="font-sans text-[15px] text-[#B3B3B3] font-medium tracking-wide">
          {countdown}
        </p>
      </div>

      <div className="flex-1 flex flex-col">
        <p className="font-sans text-[13px] text-[#B3B3B3] uppercase tracking-[0.1em] mb-2 font-medium">
          {currentDraft?.angle || "Content Draft"}
        </p>
        <h4 className="font-heading text-[22px] text-white uppercase leading-tight mb-6 line-clamp-3">
          {currentDraft?.title || "Draft"}
        </h4>
        
        <div className="flex items-center gap-3 mb-8">
          <div className="w-8 h-8 rounded-full bg-[#1A1A1A] text-white flex items-center justify-center border border-white/10">
            <LinkedinIcon size={16} />
          </div>
          <div className="w-8 h-8 rounded-full bg-[#1A1A1A] text-white flex items-center justify-center border border-white/10">
            <TwitterIcon size={16} />
          </div>
          <div className="w-8 h-8 rounded-full bg-[#1A1A1A] text-white flex items-center justify-center border border-white/10">
            <Mail size={16} />
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3 mt-auto pt-6 border-t border-white/10">
        <button
          onClick={onViewDrafts}
          className="w-full font-heading font-medium text-[15px] uppercase tracking-widest py-3 rounded-[8px] border border-[#FF5A00] text-[#FF5A00] hover:bg-[#FF5A00] hover:text-white transition-colors text-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#FF5A00]"
        >
          View Draft
        </button>
        <button
          onClick={handleCancel}
          className="w-full font-sans font-medium text-[13px] uppercase tracking-widest py-3 text-[#B3B3B3] hover:text-[#FF3B30] transition-colors text-center"
        >
          Cancel Schedule
        </button>
      </div>

    </div>
  );
}
