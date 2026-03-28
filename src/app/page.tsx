"use client";

import { useState } from "react";
import InputForm from "@/components/home/InputForm";
import LoadingState from "@/components/home/LoadingState";

export default function Home() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generateError, setGenerateError] = useState<string | null>(null);

  return (
    <div className="flex-1 flex flex-col items-center justify-center py-12 px-4 md:px-0">
      
      {!isGenerating ? (
        <>
          <div className="text-center w-full max-w-5xl mx-auto mb-12">
            <h1 className="font-heading text-[clamp(40px,12vw,120px)] uppercase font-extrabold tracking-[0.01em] leading-none mb-4">
              GENERATE CONTENT THAT <span className="text-[#FF5A00]">RANKS</span>
            </h1>
            <p className="font-sans text-[#B3B3B3] text-[20px] max-w-2xl mx-auto">
              Paste a URL or describe your idea. We handle the rest.
            </p>
          </div>

          <div className="w-full max-w-2xl mx-auto">
            <InputForm 
              onSubmitStart={() => { setIsGenerating(true); setGenerateError(null); }} 
              onSubmitError={(err: string) => setGenerateError(err)} 
            />
          </div>
        </>
      ) : (
        <LoadingState onCancel={() => setIsGenerating(false)} error={generateError} />
      )}
      
    </div>
  );
}
