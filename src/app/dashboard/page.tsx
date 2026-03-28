"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/lib/store";
import StepIndicator from "@/components/dashboard/StepIndicator";
import DraftGrid from "@/components/dashboard/DraftGrid";
import DraftEditor from "@/components/dashboard/DraftEditor";
import PlatformPreviewPanel from "@/components/dashboard/PlatformPreviewPanel";
import PublishPanel from "@/components/dashboard/PublishPanel";

export default function DashboardPage() {
  const router = useRouter();
  const { current_job_id, current_drafts, selected_draft_id, platform_content } = useAppStore();
  const [currentStep, setCurrentStep] = useState(1);

  useEffect(() => {
    if (!current_job_id || current_drafts.length === 0) {
      router.push("/");
    }
  }, [current_job_id, current_drafts, router]);

  useEffect(() => {
    if (platform_content) {
      setCurrentStep(3);
    } else if (selected_draft_id) {
      setCurrentStep(2);
    } else {
      setCurrentStep(1);
    }
  }, [selected_draft_id, platform_content]);

  if (!current_job_id || current_drafts.length === 0) return null;

  return (
    <div className="flex-1 flex flex-col pt-8 pb-24 px-4 md:px-0 max-w-[1440px] mx-auto w-full">
      <div className="mb-12 sticky top-[80px] bg-[#000000] z-20 pt-4 pb-4 border-b border-white/5">
        <StepIndicator currentStep={currentStep} />
      </div>

      <div className="flex flex-col gap-16">
        {/* Phase 1 */}
        <section id="phase-1" className="animate-in fade-in slide-in-from-bottom-8 duration-500">
          <DraftGrid />
        </section>

        {/* Phase 2 */}
        {selected_draft_id && (
          <section id="phase-2" className="animate-in fade-in slide-in-from-bottom-8 duration-500 pt-8 border-t border-white/10 scroll-mt-32">
            <div className="flex flex-col lg:flex-row gap-8 px-10">
              <div className="lg:w-[50%] lg:flex-none">
                <DraftEditor />
              </div>
              <div className="lg:w-[45%] lg:flex-none">
                <PlatformPreviewPanel />
              </div>
            </div>
          </section>
        )}

        {/* Phase 3 */}
        {platform_content && (
          <section id="phase-3" className="animate-in fade-in slide-in-from-bottom-8 duration-500 pt-8 border-t border-white/10 scroll-mt-32">
            <PublishPanel />
          </section>
        )}
      </div>
    </div>
  );
}
