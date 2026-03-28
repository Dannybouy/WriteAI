import { Check } from "lucide-react";

interface StepIndicatorProps {
  currentStep: number;
}

export default function StepIndicator({ currentStep }: StepIndicatorProps) {
  const steps = [
    { num: 1, label: "Review Drafts" },
    { num: 2, label: "Edit & Preview" },
    { num: 3, label: "Publish" },
  ];

  return (
    <div className="flex items-center justify-between w-full max-w-3xl mx-auto relative px-4 sm:px-0">
      {/* Connecting lines */}
      <div className="absolute top-5 sm:top-6 left-8 sm:left-4 right-8 sm:right-4 h-[2px] bg-[#1A1A1A] -z-10 -translate-y-1/2 rounded-full overflow-hidden">
        <div 
          className="h-full bg-[#FF5A00] transition-all duration-500 ease-in-out"
          style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
        />
      </div>

      {steps.map((step) => {
        const isActive = currentStep === step.num;
        const isCompleted = currentStep > step.num;

        return (
          <div key={step.num} className="flex flex-col items-center bg-[#000000] px-2 sm:px-4">
            <div 
              className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center font-heading text-[18px] sm:text-[20px] transition-colors duration-300 border-[2px] sm:border-[3px] ${
                isCompleted 
                  ? 'bg-[#FF5A00] border-[#FF5A00] text-white' 
                  : isActive 
                    ? 'bg-black border-[#FF5A00] text-[#FF5A00]' 
                    : 'bg-black border-[#333333] text-[#333333]'
              }`}
            >
              {isCompleted ? <Check size={24} strokeWidth={3} /> : step.num}
            </div>
            <span 
              className={`mt-3 font-sans text-[12px] sm:text-[14px] uppercase tracking-widest transition-colors duration-300 text-center ${
                isActive || isCompleted ? 'text-white' : 'text-[#333333]'
              }`}
            >
              {step.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}
