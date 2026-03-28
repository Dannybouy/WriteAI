import { Loader2 } from "lucide-react";

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function LoadingSpinner({ size = 'md', className = "" }: LoadingSpinnerProps) {
  const sizeMap = {
    sm: 16,
    md: 32,
    lg: 64
  };

  return (
    <Loader2 
      size={sizeMap[size]} 
      className={`animate-spin text-[#FF5A00] ${className}`} 
    />
  );
}
