"use client";

import { useToastStore } from "@/lib/toastStore";
import { useEffect } from "react";
import { X, CheckCircle, AlertCircle, Info } from "lucide-react";

export default function ToastContainer() {
  const { toasts, removeToast } = useToastStore();

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 max-w-[400px] w-full items-end pointer-events-none">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onDismiss={() => removeToast(toast.id)} />
      ))}
    </div>
  );
}

function ToastItem({ toast, onDismiss }: { toast: any, onDismiss: () => void }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss();
    }, 4000);
    return () => clearTimeout(timer);
  }, [toast.id, onDismiss]);

  const styleMap = {
    success: "bg-[#30D158] border-[#30D158]/80",
    error: "bg-[#FF3B30] border-[#FF3B30]/80",
    info: "bg-[#FF5A00] border-[#FF5A00]/80",
  };

  const IconMap = {
    success: CheckCircle,
    error: AlertCircle,
    info: Info,
  };

  const Icon = IconMap[toast.type as keyof typeof IconMap];

  return (
    <div className={`pointer-events-auto flex items-start gap-3 p-4 border rounded-[8px] text-white shadow-[0_8px_30px_rgb(0,0,0,0.5)] w-full transform transition-all duration-300 animate-in slide-in-from-right-4 fade-in ${styleMap[toast.type as keyof typeof styleMap]}`}>
      <Icon className="flex-shrink-0 mt-0.5" size={20} />
      <p className="flex-1 font-sans text-[16px] leading-snug">{toast.message}</p>
      <button 
        onClick={onDismiss} 
        className="opacity-70 hover:opacity-100 transition-opacity"
        aria-label="Close"
      >
        <X size={20} />
      </button>
    </div>
  );
}
