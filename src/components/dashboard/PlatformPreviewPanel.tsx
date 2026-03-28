"use client";

import { useState } from "react";
import { useAppStore } from "@/lib/store";
import { generatePosts } from "@/lib/api";
import { toast } from "@/lib/toastStore";
import { Loader2, Mail } from "lucide-react";
import SkeletonLoader from "@/components/shared/SkeletonLoader";
import { LinkedinIcon, TwitterIcon } from "@/components/shared/Icons";

export default function PlatformPreviewPanel() {
  const { current_job_id, selected_draft_id, current_drafts, platform_content, setPlatformContent } = useAppStore();
  const [isGenerating, setIsGenerating] = useState(false);

  const draftIndex = current_drafts.findIndex(d => d.draft_number === selected_draft_id);
  const draftPositionStr = (draftIndex + 1).toString();

  const handleGenerate = async () => {
    if (!current_job_id || draftIndex === -1) return;
    
    setIsGenerating(true);
    try {
      const response = await generatePosts({
        job_id: current_job_id,
        selected_draft: draftPositionStr
      });
      setPlatformContent(response);
      toast.success("Platform content generated!");
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Failed to generate platform content.");
    } finally {
      setIsGenerating(false);
    }
  };

  console.log("platform_content: ", platform_content);
  return (
    <div className="flex flex-col h-full gap-6">
      
      {!platform_content && (
        <div className="bg-[#0A0A0A] border border-[#FF5A00]/30 rounded-[16px] p-6 lg:p-8 flex flex-col items-center justify-center text-center">
          <h3 className="font-heading text-2xl text-white uppercase tracking-wide mb-3">
            Adapt for Platforms
          </h3>
          <p className="font-sans text-[#B3B3B3] text-[15px] mb-6">
            Generate specific versions of this draft optimized for LinkedIn, X (Twitter), and Email Newsletters.
          </p>
          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="w-full bg-[#FF5A00] hover:bg-[#FF5A00]/90 disabled:opacity-70 disabled:hover:bg-[#FF5A00] text-white font-heading font-medium text-[16px] uppercase tracking-widest py-4 rounded-[8px] transition-colors flex justify-center items-center h-[56px]"
          >
            {isGenerating ? (
              <>
                <Loader2 className="animate-spin mr-3" size={20} />
                Adapting Content...
              </>
            ) : (
              "Generate Platform Content"
            )}
          </button>
        </div>
      )}

      {(platform_content || isGenerating) && (
        <div className="flex flex-col gap-6">
          <div className="flex items-center">
            <h2 className="font-heading text-2xl text-white uppercase tracking-wide">
              Platform Previews
            </h2>
          </div>

          <PreviewCard 
            platform="LinkedIn" 
            isLoading={isGenerating} 
            content={platform_content?.data?.linkedin} 
          />
          <PreviewCard 
            platform="X" 
            isLoading={isGenerating} 
            content={platform_content?.data?.twitter} 
          />
          <PreviewCard 
            platform="Email" 
            isLoading={isGenerating} 
            content={platform_content?.data?.email} 
          />
        </div>
      )}
    </div>
  );
}

function PreviewCard({ platform, isLoading, content }: { platform: string, isLoading: boolean, content?: any }) {
  
  const getIcon = () => {
    if (platform === "LinkedIn") return <LinkedinIcon size={18} className="text-white" />;
    if (platform === "X") return <TwitterIcon size={18} className="text-white" />;
    return <Mail size={18} className="text-white" />;
  };

  const getHeaderColor = () => {
    if (platform === "LinkedIn") return "bg-[#0077B5]";
    if (platform === "X") return "bg-black border-b border-white/10";
    return "bg-[#FF5A00]";
  };

  const formatContent = () => {
    if (!content) return null;
    
    if (platform === "LinkedIn") {
      const bodyText = content.body || "";
      const truncated = bodyText.length > 300 ? bodyText.substring(0, 300) + "..." : bodyText;
      return (
        <div className="text-[#333333] font-sans text-[14px] whitespace-pre-wrap leading-relaxed">
          {truncated}
          {bodyText.length > 300 && <span className="text-[#0077B5] hover:underline cursor-pointer ml-1 font-medium">see more</span>}
        </div>
      );
    }
    
    if (platform === "X") {
      const tweets = content.tweets || [];
      return (
        <div className="flex flex-col gap-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
          {tweets.map((tweet: string, i: number) => (
            <div key={i} className="text-white font-sans text-[15px] whitespace-pre-wrap leading-relaxed pb-4 border-b border-white/10 last:border-0 last:pb-0">
              {tweet}
            </div>
          ))}
        </div>
      );
    }
    
    if (platform === "Email") {
      return (
        <div className="flex flex-col gap-4 mt-2 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
          <div className="bg-[#F3F2EF] p-4 rounded-[8px]">
            <p className="text-[#666666] font-sans text-[12px] uppercase mb-1">Subject</p>
            <p className="text-[#1A1A1A] font-sans text-[15px] font-bold">{content.subject}</p>
          </div>
          <div className="text-[#333333] font-sans text-[14px] whitespace-pre-wrap leading-relaxed">
            {content.body}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className={`rounded-[12px] overflow-hidden flex flex-col ${platform === 'X' ? 'bg-[#15202B] border border-white/10' : 'bg-white'}`}>
      
      {/* Platform Header */}
      <div className={`px-4 py-2.5 flex items-center gap-2 ${getHeaderColor()}`}>
        {getIcon()}
        <span className="font-sans text-[13px] font-bold text-white uppercase tracking-wider">
          {platform}
        </span>
      </div>

      {isLoading ? (
        <div className="p-5 flex flex-col gap-3">
          <div className="flex items-center gap-3 mb-2">
            <SkeletonLoader className="w-10 h-10 rounded-full" />
            <div className="flex flex-col gap-2">
              <SkeletonLoader className="w-32 h-3" />
              <SkeletonLoader className="w-20 h-2" />
            </div>
          </div>
          <SkeletonLoader className="w-full h-4" />
          <SkeletonLoader className="w-[90%] h-4" />
          <SkeletonLoader className="w-[70%] h-4" />
        </div>
      ) : (
        <div className="p-5">
          
          {/* Mock Author info */}
          {platform !== 'Email' && (
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-[#E1E8ED] flex-shrink-0"></div>
              <div className="flex flex-col">
                <span className={`font-sans text-[14px] font-bold ${platform === 'X' ? 'text-white' : 'text-[#1A1A1A]'}`}>
                  Fetemi Marketing Agency
                </span>
                <span className={`font-sans text-[12px] ${platform === 'X' ? 'text-[#8899A6]' : 'text-[#666666]'}`}>
                  {platform === 'X' ? '@FetemiAgency · ' : ''}Just now
                </span>
              </div>
            </div>
          )}

          {platform === 'Email' && (
            <div className="flex flex-col gap-2 mb-4 border-b border-[#E1E8ED] pb-4">
              <div className="flex text-[13px] font-sans">
                <span className="text-[#666666] w-16">From:</span>
                <span className="text-[#1A1A1A] font-medium">Fetemi Marketing Agency</span>
              </div>
            </div>
          )}

          {/* Content */}
          {formatContent()}

          {/* Footers / Meta Info */}
          <div className="mt-4 pt-3 flex justify-between items-center border-t border-black/5">
            {platform === 'X' && content && (
              <span className="text-[#8899A6] text-[12px] font-sans">
                {content.tweet_count || content.tweets?.length || 0} Tweets
              </span>
            )}
            
            {platform === 'LinkedIn' && content && (
              <span className="text-[#666666] text-[12px] font-sans bg-[#F3F2EF] px-2 py-1 rounded">
                {content.character_count || content.body?.length || 0} chars
              </span>
            )}

            {platform === 'Email' && content && (
              <span className="text-[#666666] text-[12px] font-sans bg-[#F3F2EF] px-2 py-1 rounded">
                {content.estimated_read_time || Math.max(1, Math.ceil((content.body?.split(' ')?.length || 0) / 200))} min read
              </span>
            )}
          </div>

        </div>
      )}
    </div>
  );
}
