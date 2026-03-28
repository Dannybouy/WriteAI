import { XCircle } from "lucide-react";

interface ErrorBannerProps {
  message: string;
  onDismiss?: () => void;
  className?: string;
}

export default function ErrorBanner({ message, onDismiss, className = "" }: ErrorBannerProps) {
  if (!message) return null;

  return (
    <div className={`flex items-start gap-3 p-4 bg-[#FF3B30] text-white rounded-[8px] ${className}`}>
      <div className="flex-1 text-[16px] leading-snug font-sans">
        {message}
      </div>
      {onDismiss && (
        <button 
          onClick={onDismiss}
          className="text-white hover:text-white/70 transition-colors flex-shrink-0"
          aria-label="Dismiss error"
        >
          <XCircle size={20} />
        </button>
      )}
    </div>
  );
}
