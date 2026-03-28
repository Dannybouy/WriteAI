import { JobRecord } from "@/types";
import { format } from "date-fns";
import { Mail } from "lucide-react";
import { LinkedinIcon, TwitterIcon } from "@/components/shared/Icons";

interface HistoryRowProps {
  job: JobRecord;
  onViewDrafts: () => void;
}

export default function HistoryRow({ job, onViewDrafts }: HistoryRowProps) {
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-[#30D158] text-[#1A1A1A]';
      case 'scheduled': return 'bg-[#FF9F0A] text-[#1A1A1A]';
      case 'failed': return 'bg-[#FF3B30] text-white';
      case 'draft': return 'bg-[#333333] text-white';
      case 'processing': return 'bg-[#007AFF] text-white';
      default: return 'bg-[#333333] text-white';
    }
  };

  const getStatusLabel = (status: string) => {
    if (status === 'draft') return 'AWAITING SELECTION';
    return status.toUpperCase();
  };

  const truncate = (str: string, length: number) => {
    if (str.length <= length) return str;
    return str.substring(0, length) + "...";
  };

  return (
    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 p-6 bg-[#0A0A0A] border border-white/10 rounded-[12px] hover:border-white/30 transition-colors">
      
      <div className="flex-1 flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <span className="font-mono text-[13px] text-[#B3B3B3]">
            {format(new Date(job.createdAt), "d MMM yyyy, HH:mm")}
          </span>
          <span className="font-sans text-[11px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full bg-black border border-white/20 text-white">
            {job.inputType}
          </span>
          <span className={`font-sans text-[11px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full ${getStatusColor(job.status)}`}>
            {getStatusLabel(job.status)}
          </span>
        </div>
        
        <p className="font-sans text-[16px] text-white leading-relaxed">
          {truncate(job.rawInput, 80)}
        </p>
      </div>

      <div className="flex items-center gap-6 lg:gap-8 justify-between lg:justify-end border-t border-white/10 lg:border-t-0 pt-4 lg:pt-0">
        
        {/* Platforms Status */}
        <div className="flex items-center gap-4">
          <PlatformDot platform="LinkedIn" status={job.platformStatus?.linkedin} />
          <PlatformDot platform="X" status={job.platformStatus?.twitter} />
          <PlatformDot platform="Email" status={job.platformStatus?.email} />
        </div>

        <button
          onClick={onViewDrafts}
          className="font-heading font-medium text-[14px] uppercase tracking-widest px-6 py-2.5 rounded-[6px] border border-white/20 hover:border-[#FF5A00] hover:bg-[#FF5A00]/10 text-white transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#FF5A00]"
        >
          View Drafts
        </button>

      </div>

    </div>
  );
}

function PlatformDot({ platform, status }: { platform: string, status?: string }) {
  
  const getIcon = () => {
    if (platform === "LinkedIn") return <LinkedinIcon size={16} />;
    if (platform === "X") return <TwitterIcon size={16} />;
    return <Mail size={16} />;
  };

  const getDotColor = () => {
    if (!status) return "bg-gray-600";
    if (status === 'published') return "bg-[#30D158]";
    if (status === 'scheduled') return "bg-[#FF9F0A]";
    if (status === 'failed') return "bg-[#FF3B30]";
    return "bg-transparent border border-gray-600";
  };

  return (
    <div className="flex items-center gap-1.5 text-[#B3B3B3]">
      {getIcon()}
      <div className={`w-2 h-2 rounded-full ${getDotColor()}`}></div>
    </div>
  );
}
