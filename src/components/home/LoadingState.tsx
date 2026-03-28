import { useState, useEffect } from "react";
import ErrorBanner from "@/components/shared/ErrorBanner";

interface LoadingStateProps {
  onCancel: () => void;
  error?: string | null;
}

export default function LoadingState({ onCancel, error }: LoadingStateProps) {
  const [messageIndex, setMessageIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  
  const messages = [
    "Analysing your content idea...",
    "Researching SEO keywords...",
    "Writing Draft 1...",
    "Writing Draft 2...",
    "Writing Draft 3...",
    "Sourcing images...",
    "Almost ready..."
  ];

  useEffect(() => {
    if (error) return;
    
    // Cycle messages every 4 seconds
    const messageInterval = setInterval(() => {
      setMessageIndex(prev => (prev < messages.length - 1 ? prev + 1 : prev));
    }, 4000);

    // Progress bar fills over 60 seconds (60000ms). Update every 100ms.
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) return 100;
        return prev + (100 / 600); // 60 seconds = 600 ticks of 100ms
      });
    }, 100);

    return () => {
      clearInterval(messageInterval);
      clearInterval(progressInterval);
    };
  }, [error, messages.length]);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center w-full max-w-2xl mx-auto mt-12 animate-in fade-in">
        <ErrorBanner message={error} className="w-full mb-8" />
        <button
          onClick={onCancel}
          className="bg-[#1A1A1A] hover:bg-[#333333] text-white border border-[#FF5A00] uppercase font-medium text-[18px] py-4 px-8 rounded-[8px] transition-colors tracking-widest focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#FF5A00]"
        >
          TRY AGAIN
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-2xl mx-auto mt-12 animate-in fade-in">
      <div className="relative mb-8">
        <div className="w-[100px] h-[100px] rounded-full border-4 border-[#FF5A00]/20 absolute inset-0"></div>
        <div className="w-[100px] h-[100px] rounded-full border-4 border-[#FF5A00] border-t-transparent animate-spin relative z-10"></div>
        <div className="w-[100px] h-[100px] rounded-full bg-[#FF5A00]/10 absolute inset-0 animate-pulse"></div>
      </div>
      
      <h2 className="font-heading text-4xl sm:text-5xl text-white uppercase tracking-tight mb-4 text-center">
        GENERATING YOUR DRAFTS
      </h2>
      
      <div className="h-6 mb-12">
        <p className="font-sans text-[18px] sm:text-[20px] text-[#FF5A00] animate-pulse text-center">
          {messages[messageIndex]}
        </p>
      </div>
      
      {/* Progress Bar */}
      <div className="w-full h-2 bg-[#1A1A1A] rounded-full overflow-hidden">
        <div 
          className="h-full bg-[#FF5A00] transition-all duration-100 ease-linear"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    </div>
  );
}
