"use client";

import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format, addDays, setHours, setMinutes, isPast } from "date-fns";
import { Calendar as CalendarIcon, Clock } from "lucide-react";

interface SchedulePickerProps {
  onConfirm: (date: Date) => void;
}

export default function SchedulePicker({ onConfirm }: SchedulePickerProps) {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const filterPassedTime = (time: Date) => {
    const currentDate = new Date();
    const selectedDate = new Date(time);

    return currentDate.getTime() < selectedDate.getTime();
  };

  // Time options in 3-hour intervals: 00:00, 03:00, 06:00, 09:00, 12:00, 15:00, 18:00, 21:00
  // React Datepicker has `includeTimes`
  const includeTimes = [];
  for (let i = 0; i < 24; i += 3) {
    includeTimes.push(setHours(setMinutes(new Date(), 0), i));
  }

  const maxDate = addDays(new Date(), 30);

  return (
    <div className="bg-[#0A0A0A] border border-white/10 rounded-[16px] p-8 flex flex-col md:flex-row gap-8 items-start relative z-10">
      <div className="flex-1 w-full">
        <label className="font-sans text-[14px] uppercase tracking-widest text-[#B3B3B3] mb-3 block">
          Select Date & Time
        </label>
        
        {/* Custom Styling applied via global css to react-datepicker classes */}
        <div className="custom-datepicker-wrapper w-full relative">
          <DatePicker
            selected={selectedDate}
            onChange={(date: Date | null) => setSelectedDate(date)}
            showTimeSelect
            includeTimes={includeTimes}
            filterTime={filterPassedTime}
            minDate={new Date()}
            maxDate={maxDate}
            dateFormat="MMMM d, yyyy h:mm aa"
            placeholderText="Choose date and time..."
            className="w-full bg-black border border-white/20 text-white px-5 py-4 rounded-[8px] focus:border-[#FF5A00] outline-none font-sans text-[16px] transition-colors"
          />
          <CalendarIcon className="absolute right-4 top-1/2 -translate-y-1/2 text-[#B3B3B3] pointer-events-none" size={20} />
        </div>
      </div>

      <div className="flex-1 flex flex-col justify-end w-full h-full pt-6">
        {selectedDate ? (
          <div className="bg-[#FF5A00]/10 border border-[#FF5A00]/30 rounded-[8px] p-5 mb-5 flex items-center gap-4">
            <Clock className="text-[#FF5A00]" size={24} />
            <p className="font-sans text-[15px] text-white leading-relaxed">
              Scheduling for <span className="font-bold text-[#FF5A00]">{format(selectedDate, "EEEE, d MMMM yyyy 'at' HH:mm")}</span>
            </p>
          </div>
        ) : (
          <div className="h-[92px] mb-5"></div>
        )}

        <button
          onClick={() => selectedDate && onConfirm(selectedDate)}
          disabled={!selectedDate}
          className="w-full bg-[#FF5A00] hover:bg-[#FF5A00]/90 disabled:bg-[#333333] disabled:text-[#888888] disabled:cursor-not-allowed text-white font-heading font-medium text-[16px] uppercase tracking-widest py-4 rounded-[8px] transition-all h-[56px]"
        >
          CONFIRM SCHEDULE
        </button>
      </div>
    </div>
  );
}
