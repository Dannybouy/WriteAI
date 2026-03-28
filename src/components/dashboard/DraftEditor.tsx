"use client";

import { useState, useEffect, useRef } from "react";
import { useAppStore } from "@/lib/store";
import TextareaAutosize from "react-textarea-autosize";
import { notifyDraftEdited } from "@/lib/api";
import { toast } from "@/lib/toastStore";
import MarkdownRenderer from "@/components/shared/MarkdownRenderer";

export default function DraftEditor() {
  const { current_job_id, current_drafts, selected_draft_id, edit_history, saveDraftEdit, resetDraftEdit } = useAppStore();
  
  const draft = current_drafts.find(d => d.draft_number === selected_draft_id);
  const editRecord = edit_history.find(h => h.draft_id === selected_draft_id);
  
  const [activeTab, setActiveTab] = useState<'EDIT' | 'PREVIEW'>('EDIT');
  const [localContent, setLocalContent] = useState("");
  const isEditedMode = !!editRecord?.isEdited;
  const originalContent = draft?.body || "";
  
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  useEffect(() => {
    if (editRecord?.editedContent) {
      setLocalContent(editRecord.editedContent);
      setHasUnsavedChanges(false);
    } else if (originalContent) {
      setLocalContent(originalContent);
      setHasUnsavedChanges(false);
    }
  }, [selected_draft_id, originalContent, editRecord?.editedContent]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setLocalContent(e.target.value);
    setHasUnsavedChanges(e.target.value !== (editRecord?.editedContent || originalContent));
  };

  const handleSave = async () => {
    if (!draft || !current_job_id) return;
    saveDraftEdit(draft.draft_number, localContent);
    setHasUnsavedChanges(false);
    
    toast.success("Changes saved");
    
    // Fire and forget webhook
    notifyDraftEdited({
      job_id: current_job_id,
      draft_id: draft.draft_number,
      edited_content: localContent
    });
  };

  const handleReset = () => {
    if (!draft) return;
    resetDraftEdit(draft.draft_number);
    setLocalContent(originalContent);
    setHasUnsavedChanges(false);
    toast.info("Reset to original content");
  };

  if (!draft) return null;

  return (
    <div className="flex flex-col h-full bg-[#0A0A0A] border border-white/10 rounded-[16px] overflow-hidden">
      <div className="p-6 border-b border-white/10 flex justify-between items-center bg-black/40">
        <div className="flex items-center gap-6">
          <div className="flex bg-black/50 p-1 rounded-[8px] border border-white/10">
            <button
              onClick={() => setActiveTab('EDIT')}
              className={`px-6 py-2 font-heading text-[16px] uppercase tracking-widest rounded-[6px] transition-colors ${
                activeTab === 'EDIT' ? 'bg-[#FF5A00] text-white' : 'text-[#B3B3B3] hover:text-white'
              }`}
            >
              Edit
            </button>
            <button
              onClick={() => setActiveTab('PREVIEW')}
              className={`px-6 py-2 font-heading text-[16px] uppercase tracking-widest rounded-[6px] transition-colors ${
                activeTab === 'PREVIEW' ? 'bg-[#FF5A00] text-white' : 'text-[#B3B3B3] hover:text-white'
              }`}
            >
              Preview
            </button>
          </div>
          {isEditedMode && (
            <span className="bg-[#FF5A00]/20 text-[#FF5A00] border border-[#FF5A00]/50 text-[11px] font-sans font-bold px-2 py-0.5 rounded uppercase tracking-widest">
              Edited
            </span>
          )}
        </div>
        <div className="flex items-center gap-3">
          {isEditedMode && (
            <button 
              onClick={handleReset}
              className="text-[#B3B3B3] hover:text-white text-[12px] uppercase tracking-widest font-sans transition-colors"
            >
              Reset to Original
            </button>
          )}
          {hasUnsavedChanges && (
            <button 
              onClick={handleSave}
              className="bg-[#FF5A00] hover:bg-[#FF5A00]/90 text-white font-sans font-medium text-[13px] uppercase tracking-widest px-4 py-2 rounded-[6px] transition-colors"
            >
              Save Changes
            </button>
          )}
        </div>
      </div>
      
      <div className="p-6 flex-1 flex flex-col overflow-y-auto">
        {activeTab === 'EDIT' ? (
          <TextareaAutosize
            minRows={20}
            value={localContent}
            onChange={handleChange}
            className="w-full h-full bg-transparent text-white/90 font-mono text-[14px] leading-relaxed resize-none outline-none placeholder:text-white/20"
            placeholder="Markdown content here..."
          />
        ) : (
          <div className="w-full h-full text-white/90 font-sans text-[15px] leading-relaxed">
            <MarkdownRenderer content={localContent} />
          </div>
        )}
      </div>
    </div>
  );
}
