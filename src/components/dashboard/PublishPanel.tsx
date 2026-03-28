"use client";

import { useState } from "react";
import { Send, Calendar, CheckCircle2, XCircle, Clock } from "lucide-react";
import { useAppStore } from "@/lib/store";
import SchedulePicker from "./SchedulePicker";
import ConfirmModal from "./ConfirmModal";
import { format } from "date-fns";
import { publishPosts } from "@/lib/api";
import { useRouter } from "next/navigation";

export default function PublishPanel() {
  const router = useRouter();
  const { current_job_id, platform_content, addScheduledJob, updateHistoryJobStatus, clearCurrentJob } = useAppStore();
  
  const [showSchedule, setShowSchedule] = useState(false);
  const [scheduleDate, setScheduleDate] = useState<Date | null>(null);
  const [modalMode, setModalMode] = useState<'PUBLISH' | 'SCHEDULE' | null>(null);
  
  const [publishSuccess, setPublishSuccess] = useState<boolean>(false);
  const [publishResult, setPublishResult] = useState<any>(null); // To store success/fail per platform

  // When "Publish Now" is clicked
  const handlePublishNow = () => {
    setShowSchedule(false);
    setModalMode('PUBLISH');
  };

  // When "Schedule For Later" is clicked
  const handleScheduleClick = () => {
    setShowSchedule(!showSchedule);
  };

  const handleConfirmSchedule = (date: Date) => {
    setScheduleDate(date);
    setModalMode('SCHEDULE');
  };

  const handleModalConfirm = async () => {
    if (!current_job_id || !platform_content) return;
    
    try {
      const payload: any = {
        job_id: current_job_id,
        publish_now: true,
        scheduled_for: null
      };

      if (modalMode === 'SCHEDULE' && scheduleDate) {
        payload.scheduled_for = scheduleDate.toISOString();
      }

      const res = await publishPosts(payload);
      
      // Post-publish success state
      setPublishResult(res.status);
      setPublishSuccess(true);
      setModalMode(null);
      
      const newStatus = modalMode === 'SCHEDULE' ? 'scheduled' : 'published';
      updateHistoryJobStatus(current_job_id, newStatus);
      
      if (modalMode === 'SCHEDULE' && scheduleDate) {
        addScheduledJob({
          id: current_job_id,
          createdAt: new Date().toISOString(), // Mock timestamp for schedule record
          rawInput: "Content generated from dashboard", // We can't access original here easily without reading history
          inputType: "text",
          status: "scheduled",
          drafts: useAppStore.getState().current_drafts,
          selectedDraftId: useAppStore.getState().selected_draft_id || undefined,
          platformContent: platform_content,
          scheduledFor: scheduleDate.toISOString(),
          platformStatus: res.status
        });
      }
      
    } catch (e: any) {
      // Handle error gracefully
      console.error(e);
      setModalMode(null);
      alert("Failed to publish: " + e.message);
    }
  };

  const handleStartNew = () => {
    clearCurrentJob();
    router.push("/");
  };

  if (publishSuccess) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-[#0A0A0A] border border-[#30D158]/30 rounded-[16px] animate-in zoom-in-95 mt-12 mb-24 max-w-3xl mx-auto shadow-2xl">
        <div className="w-24 h-24 bg-[#30D158]/20 rounded-full flex items-center justify-center mb-6">
          <CheckCircle2 size={48} className="text-[#30D158]" />
        </div>
        <h2 className="font-heading text-4xl text-white uppercase tracking-tight mb-8">
          {modalMode === 'SCHEDULE' ? 'CONTENT SCHEDULED' : 'CONTENT PUBLISHED'}
        </h2>
        
        <div className="flex gap-8 mb-12">
          {['linkedin', 'twitter', 'email'].map((p) => {
            const status = publishResult?.[p];
            return (
              <div key={p} className="flex flex-col items-center gap-3">
                <span className="font-sans text-[14px] text-white uppercase tracking-widest">{p === 'twitter' ? 'X' : p}</span>
                {status === 'published' ? (
                  <CheckCircle2 size={32} className="text-[#30D158]" />
                ) : status === 'scheduled' ? (
                  <Clock size={32} className="text-[#FF9F0A]" />
                ) : (
                  <div className="flex flex-col gap-2 items-center">
                    <XCircle size={32} className="text-[#FF3B30]" />
                    <button className="text-[12px] text-[#FF3B30] hover:underline uppercase tracking-widest">Retry</button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
        
        <button
          onClick={handleStartNew}
          className="bg-transparent border-2 border-[#FF5A00] text-[#FF5A00] hover:bg-[#FF5A00] hover:text-white uppercase font-sans font-bold tracking-widest px-8 py-4 rounded-[8px] transition-colors"
        >
          Start New Content
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 pb-12">
      <div className="text-center">
        <h2 className="font-heading text-4xl md:text-5xl text-white uppercase tracking-tight mb-3">
          READY TO PUBLISH
        </h2>
        <p className="font-sans text-[#B3B3B3] text-[16px] md:text-[18px]">
          Your content is adapted for all three platforms. Choose when to publish.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto w-full">
        {/* Publish Now Card */}
        <button 
          onClick={handlePublishNow}
          className="flex flex-col items-start text-left p-8 bg-black border-[2px] border-[#FF5A00] rounded-[16px] hover:bg-[#FF5A00]/5 transition-colors group relative overflow-hidden focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#FF5A00]"
        >
          <div className="bg-[#FF5A00] p-4 rounded-full mb-6">
            <Send size={32} className="text-white relative -left-0.5" />
          </div>
          <h3 className="font-heading text-3xl text-white uppercase mb-4">PUBLISH NOW</h3>
          <p className="font-sans text-[#B3B3B3] text-[16px] leading-relaxed">
            Post to LinkedIn, X, and Email Newsletter immediately
          </p>
        </button>

        {/* Schedule Card */}
        <button 
          onClick={handleScheduleClick}
          className={`flex flex-col items-start text-left p-8 bg-black border-[2px] rounded-[16px] transition-colors group relative overflow-hidden focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#FF5A00] ${
            showSchedule ? 'border-[#FF5A00] bg-[#FF5A00]/5' : 'border-white/20 hover:border-[#FF5A00]'
          }`}
        >
          <div className={`p-4 rounded-full mb-6 transition-colors ${showSchedule ? 'bg-[#FF5A00]' : 'bg-[#1A1A1A] group-hover:bg-[#FF5A00]'}`}>
            <Calendar size={32} className={`transition-colors ${showSchedule ? 'text-white' : 'text-[#B3B3B3] group-hover:text-white'}`} />
          </div>
          <h3 className="font-heading text-3xl text-white uppercase mb-4">SCHEDULE FOR LATER</h3>
          <p className="font-sans text-[#B3B3B3] text-[16px] leading-relaxed">
            Choose a date and time to publish all platforms simultaneously
          </p>
        </button>
      </div>

      {showSchedule && (
        <div className="max-w-4xl mx-auto w-full animate-in slide-in-from-top-4 fade-in duration-300">
          <SchedulePicker onConfirm={handleConfirmSchedule} />
        </div>
      )}

      {modalMode && (
        <ConfirmModal 
          mode={modalMode} 
          date={scheduleDate} 
          onCancel={() => setModalMode(null)} 
          onConfirm={handleModalConfirm} 
        />
      )}
    </div>
  );
}
