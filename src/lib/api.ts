"use server";

import { 
  SubmitInputPayload, JobResponse, GeneratePostsPayload, 
  PlatformContentResponse, PublishPostsPayload, PublishResultResponse, 
  DraftEditedPayload 
} from '@/types';

const getWebhookUrl = () => {
  const url = process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL;
  if (!url) {
    console.warn("NEXT_PUBLIC_N8N_WEBHOOK_URL is not defined in environment.");
    return "";
  }
  return url;
};

async function fetchN8n<T>(payload: any): Promise<T> {
  const url = getWebhookUrl();
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  
  if (!res.ok) {
    let errorMessage = `Server responded with status: ${res.status}`;
    try {
      const errorData = await res.json();
      if (errorData.message) errorMessage = errorData.message;
      else if (errorData.error) errorMessage = errorData.error;
    } catch(e) {}
    throw new Error(errorMessage);
  }
  
  return res.json() as Promise<T>;
}

export async function submitInput(payload: SubmitInputPayload) {
  return fetchN8n<JobResponse>({ action: 'submit_input', ...payload });
}
  
export async function generatePosts(payload: GeneratePostsPayload) {
  return fetchN8n<PlatformContentResponse>({ action: 'generate_posts', ...payload });
}
  
export async function publishPosts(payload: PublishPostsPayload) {
  return fetchN8n<PublishResultResponse>({ action: 'publish_posts', ...payload });
}
  
export async function notifyDraftEdited(payload: DraftEditedPayload) {
  fetchN8n<void>({ action: 'draft_edited', ...payload }).catch(console.error);
}
