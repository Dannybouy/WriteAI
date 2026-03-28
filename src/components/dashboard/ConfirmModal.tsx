"use client";

import { AlertTriangle, Calendar } from "lucide-react";
import { format } from "date-fns";

interface ConfirmModalProps {
  mode: 'PUBLISH' | 'SCHEDULE';
  date?: Date | null;
  onCancel: () => void;
  onConfirm: () => void;
}

export default function ConfirmModal({ mode, date, onCancel, onConfirm }: ConfirmModalProps) {
  
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={onCancel}
      ></div>

      {/* Modal */}
      <div className="bg-[#0A0A0A] border border-white/10 rounded-[16px] w-full max-w-md relative z-10 overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
        <div className="p-8 pb-6 flex flex-col items-center text-center">
          
          <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-6 ${mode === 'PUBLISH' ? 'bg-[#FF3B30]/10' : 'bg-[#FF5A00]/10'}`}>
            {mode === 'PUBLISH' ? (
              <AlertTriangle size={32} className="text-[#FF3B30]" />
            ) : (
              <Calendar size={32} className="text-[#FF5A00]" />
            )}
          </div>
          
          <h2 className="font-heading text-3xl text-white uppercase tracking-wide mb-4">
            {mode === 'PUBLISH' ? 'Publish Now?' : 'Confirm Schedule'}
          </h2>

          <p className="font-sans text-[16px] text-[#B3B3B3] leading-relaxed mb-6">
            {mode === 'PUBLISH' ? (
              "You are about to publish to LinkedIn, X, and Email Newsletter. This cannot be undone."
            ) : (
              `You are scheduling this content for ${date ? format(date, "EEEE, d MMMM yyyy 'at' HH:mm") : '...'} across all platforms.`
            )}
          </p>

        </div>

        <div className="flex border-t border-white/5 bg-black/50">
          <button 
            onClick={onCancel}
            className="flex-1 py-4 font-sans font-medium text-[#B3B3B3] hover:text-white uppercase tracking-widest text-[14px] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
          >
            Cancel
          </button>
          <div className="w-[1px] bg-white/5"></div>
          <button 
            onClick={onConfirm}
            className={`flex-1 py-4 font-sans font-medium uppercase tracking-widest text-[14px] transition-colors focus-visible:outline focus-visible:outline-2 ${
               mode === 'PUBLISH' ? 'text-[#FF3B30] hover:bg-[#FF3B30]/10 focus-visible:outline-[#FF3B30]' : 'text-[#FF5A00] hover:bg-[#FF5A00]/10 focus-visible:outline-[#FF5A00]'
            }`}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}
