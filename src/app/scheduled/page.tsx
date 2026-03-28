"use client";

import ScheduledList from "@/components/scheduled/ScheduledList";

export default function ScheduledPage() {
  return (
    <div className="flex-1 flex flex-col pt-12 pb-24 px-4 md:px-[48px] max-w-[1440px] mx-auto w-full animate-in fade-in duration-500">
      
      <div className="mb-12">
        <h1 className="font-heading text-6xl md:text-[clamp(60px,8vw,120px)] uppercase font-extrabold tracking-[0.01em] leading-none mb-4 text-white">
          SCHEDULED <span className="text-[#FF5A00]">CONTENT</span>
        </h1>
        <p className="font-sans text-[#B3B3B3] text-[18px] md:text-[20px] max-w-2xl">
          Content waiting to be published across your platforms
        </p>
      </div>

      <ScheduledList />
      
    </div>
  );
}
