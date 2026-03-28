interface SkeletonLoaderProps {
  className?: string;
}

export default function SkeletonLoader({ className = "" }: SkeletonLoaderProps) {
  return (
    <div className={`animate-pulse bg-[#1A1A1A] rounded-md ${className}`}></div>
  );
}
