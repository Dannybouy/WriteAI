import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Draft, PlatformContent, JobRecord, ScheduledJob } from '@/types';

interface EditHistoryEntry {
  draft_id: string;
  isEdited: boolean;
  editedContent: string;
}

interface AppState {
  current_job_id: string | null;
  current_drafts: Draft[];
  selected_draft_id: string | null;
  platform_content: PlatformContent | null;
  edit_history: EditHistoryEntry[];
  history_jobs: JobRecord[];
  scheduled_jobs: ScheduledJob[];
  
  // Actions
  setCurrentJob: (id: string, drafts: Draft[]) => void;
  selectDraft: (id: string | null) => void;
  setPlatformContent: (content: PlatformContent | null) => void;
  saveDraftEdit: (draftId: string, content: string) => void;
  resetDraftEdit: (draftId: string) => void;
  addHistoryJob: (job: JobRecord) => void;
  addScheduledJob: (job: ScheduledJob) => void;
  updateHistoryJobStatus: (id: string, status: any) => void;
  cancelScheduledJob: (jobId: string) => void;
  clearCurrentJob: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      current_job_id: null,
      current_drafts: [],
      selected_draft_id: null,
      platform_content: null,
      edit_history: [],
      history_jobs: [],
      scheduled_jobs: [],
      
      setCurrentJob: (id, drafts) => set({ 
        current_job_id: id, 
        current_drafts: drafts, 
        selected_draft_id: null, 
        platform_content: null, 
        edit_history: [] 
      }),
      
      selectDraft: (id) => set({ selected_draft_id: id }),
      
      setPlatformContent: (content) => set({ platform_content: content }),
      
      saveDraftEdit: (draftId, content) => set((state) => {
        const newHistory = state.edit_history.filter(h => h.draft_id !== draftId);
        return {
          edit_history: [...newHistory, { draft_id: draftId, isEdited: true, editedContent: content }]
        };
      }),
      
      resetDraftEdit: (draftId) => set((state) => ({
        edit_history: state.edit_history.filter(h => h.draft_id !== draftId)
      })),
      
      addHistoryJob: (job) => set((state) => ({ 
        history_jobs: [job, ...state.history_jobs] 
      })),
      
      addScheduledJob: (job) => set((state) => ({ 
        scheduled_jobs: [job, ...state.scheduled_jobs] 
      })),
      
      updateHistoryJobStatus: (id, status) => set((state) => ({
        history_jobs: state.history_jobs.map(job => 
          job.id === id ? { ...job, status } : job
        )
      })),
      
      cancelScheduledJob: (jobId) => set((state) => ({
        scheduled_jobs: state.scheduled_jobs.filter(job => job.id !== jobId)
      })),
      
      clearCurrentJob: () => set({ 
        current_job_id: null, 
        current_drafts: [], 
        selected_draft_id: null, 
        platform_content: null, 
        edit_history: [] 
      })
    }),
    {
      name: 'writeai-storage', // name of the item in the storage (must be unique)
    }
  )
);
