export type Draft = {
  draft_number: string;
  job_id: string;
  angle: string;
  title: string;
  meta_description: string;
  primary_keyword: string;
  body: string; // Markdown
  image_url?: string;
  is_edited?: boolean;
  long_tail_keywords: string[];
  short_tail_keywords: string[];
  suggested_image_keyword: string;
};

export type PlatformContent = {
  success: boolean;
  job_id: string;
  data: {
    linkedin: {
      body: string;
      hook: string;
      character_count: number;
    }
    twitter: {
      hook_tweet: string;
      tweet_count: number;
      tweets: string[];
    }
    email: {
      body: string;
      cta_text: string;
      estimated_read_time: number;
      preview_text: string;
      subject: string;
    }
  }
};

export type JobStatus = 'draft' | 'published' | 'scheduled' | 'failed' | 'processing';

export type JobRecord = {
  id: string;
  createdAt: string; // ISO DateTime
  rawInput: string;
  inputType: 'url' | 'text';
  status: JobStatus;
  drafts: Draft[];
  selectedDraftId?: string;
  platformContent?: PlatformContent;
  platformStatus?: {
    linkedin: JobStatus;
    twitter: JobStatus;
    email: JobStatus;
  };
  scheduledFor?: string; // ISO DateTime if scheduled
};

export type ScheduledJob = JobRecord & {
  scheduledFor: string;
};

export type SubmitInputPayload = {
  input_type: 'url' | 'text';
  content: string;
};

export type JobResponse = {
  job_id: string;
  drafts: Draft[];
};

export type GeneratePostsPayload = {
  job_id: string;
  selected_draft: string;
};

export type PlatformContentResponse = PlatformContent;

export type PublishPostsPayload = {
  job_id: string;
  linkedin: string;
  twitter: string;
  email: string;
  scheduled_for?: string;
};

export type PublishResultResponse = {
  success: boolean;
  status: {
    linkedin: JobStatus;
    twitter: JobStatus;
    email: JobStatus;
  };
};

export type DraftEditedPayload = {
  job_id: string;
  draft_id: string;
  edited_content: string;
};
