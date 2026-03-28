import { useState } from "react";
import { useRouter } from "next/navigation";
import TextareaAutosize from "react-textarea-autosize";
import { z } from "zod";
import { urlInputSchema, ideaInputSchema } from "@/lib/validation";
import { submitInput } from "@/lib/api";
import { useAppStore } from "@/lib/store";

interface InputFormProps {
  onSubmitStart: () => void;
  onSubmitError: (err: string) => void;
}

export default function InputForm({ onSubmitStart, onSubmitError }: InputFormProps) {
  const [activeTab, setActiveTab] = useState<'url' | 'text'>('url');
  const [urlValue, setUrlValue] = useState("");
  const [ideaValue, setIdeaValue] = useState("");
  const [errorMap, setErrorMap] = useState<Record<string, string>>({});
  const [shake, setShake] = useState(false);
  
  const router = useRouter();
  const { setCurrentJob, addHistoryJob } = useAppStore();

  const handleTabSwitch = (tab: 'url' | 'text') => {
    setActiveTab(tab);
    setUrlValue("");
    setIdeaValue("");
    setErrorMap({});
  };

  const validate = () => {
    try {
      if (activeTab === 'url') {
        urlInputSchema.parse({ url: urlValue });
      } else {
        ideaInputSchema.parse({ idea: ideaValue });
      }
      return true;
    } catch (e) {
      if (e instanceof z.ZodError) {
        const errors: Record<string, string> = {};
        (e as z.ZodError).issues.forEach((err: z.ZodIssue) => {
          if (err.path[0]) {
            // Check for specific character limits for IDEA
            if (activeTab === 'text' && err.path[0] === 'idea' && err.code === 'too_small') {
              const remaining = 100 - ideaValue.length;
              errors['idea'] = `Please describe your idea in at least 100 characters (${remaining} more needed)`;
            } else {
              errors[err.path[0].toString()] = err.message;
            }
          }
        });
        setErrorMap(errors);
        
        // trigger shake
        setShake(true);
        setTimeout(() => setShake(false), 500);
      }
      return false;
    }
  };

  const handleSubmit = async () => {
    setErrorMap({});
    if (!validate()) return;
    
    onSubmitStart();
    
    try {
      const payload = activeTab === 'url' 
        ? { input_type: 'url' as const, content: urlValue }
        : { input_type: 'text' as const, content: ideaValue };
        
      const response = await submitInput(payload);
      
      setCurrentJob(response.job_id, response.drafts);
      
      // Save to history as draft
      addHistoryJob({
        id: response.job_id,
        createdAt: new Date().toISOString(),
        rawInput: activeTab === 'url' ? urlValue : ideaValue,
        inputType: activeTab,
        status: 'draft',
        drafts: response.drafts,
      });
      
      router.push("/dashboard");
    } catch (error: any) {
      console.error(error);
      onSubmitError(error.message || "Failed to generate drafts. Please try again.");
    }
  };

  return (
    <div className="w-full bg-[#0A0A0A] border rounded-[16px] overflow-hidden flex flex-col shadow-lg border-white/5">
      {/* Tabs Header */}
      <div className="flex border-b border-white/5">
        <button
          onClick={() => handleTabSwitch('url')}
          className={`flex-1 py-4 md:py-5 font-heading text-[18px] uppercase tracking-widest transition-colors ${
            activeTab === 'url' ? 'bg-[#FF5A00] text-white' : 'bg-black text-[#B3B3B3] hover:text-white'
          }`}
        >
          URL
        </button>
        <button
          onClick={() => handleTabSwitch('text')}
          className={`flex-1 py-4 md:py-5 font-heading text-[18px] uppercase tracking-widest transition-colors border-l border-white/5 ${
            activeTab === 'text' ? 'bg-[#FF5A00] text-white' : 'bg-black text-[#B3B3B3] hover:text-white'
          }`}
        >
          IDEA TEXT
        </button>
      </div>

      {/* Input Area */}
      <div className="p-6 md:p-8 flex flex-col">
        
        {activeTab === 'url' ? (
          <div className="flex flex-col gap-2">
            <input
              type="text"
              value={urlValue}
              onChange={(e) => {
                setUrlValue(e.target.value);
                if (errorMap.url) setErrorMap({});
              }}
              placeholder="https://example.com/article-you-love"
              className={`w-full bg-black text-white px-5 py-5 rounded-[8px] font-sans text-[16px] border outline-none transition-colors ${
                errorMap.url ? 'border-[#FF3B30]' : 'border-white/10 focus:border-[#FF5A00]'
              }`}
              style={shake && errorMap.url ? { animation: 'shake 0.5s' } : {}}
            />
            {errorMap.url && (
              <p className="text-[#FF3B30] text-[14px] font-sans mt-1">{errorMap.url}</p>
            )}
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            <TextareaAutosize
              minRows={5}
              value={ideaValue}
              onChange={(e) => {
                setIdeaValue(e.target.value);
                if (errorMap.idea) setErrorMap({});
              }}
              placeholder="Describe your content idea in detail..."
              className={`w-full bg-black text-white px-5 py-5 rounded-[8px] font-sans text-[16px] border outline-none transition-colors resize-none ${
                errorMap.idea ? 'border-[#FF3B30]' : 'border-white/10 focus:border-[#FF5A00]'
              }`}
              style={shake && errorMap.idea ? { animation: 'shake 0.5s' } : {}}
            />
            <div className="flex justify-between items-start mt-1">
              <div className="flex-1">
                {errorMap.idea && (
                  <p className="text-[#FF3B30] text-[14px] font-sans">{errorMap.idea}</p>
                )}
              </div>
              <div className={`text-[14px] font-sans text-right transition-colors ${
                ideaValue.length > 2000 ? 'text-[#FF3B30]' : ideaValue.length >= 1800 ? 'text-[#FF9F0A]' : 'text-[#B3B3B3]'
              }`}>
                {ideaValue.length}/2000
              </div>
            </div>
          </div>
        )}

        {/* Submit */}
        <button
          onClick={handleSubmit}
          className="mt-8 w-full bg-[#FF5A00] hover:bg-[#FF5A00]/90 text-white font-heading font-medium text-[18px] uppercase tracking-[0.05em] py-4 rounded-[8px] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#FF5A00] focus-visible:outline-offset-2 flex justify-center items-center h-[60px]"
        >
          GENERATE DRAFTS
        </button>

      </div>
    </div>
  );
}
