import { z } from 'zod';

export const urlInputSchema = z.object({
  url: z.string().min(1, "Must not be empty").url("Must be a valid URL").refine(val => {
    try {
      const parsed = new URL(val);
      // Must contain a dot in the hostname and not be localhost or an IP address
      const isLocalhost = parsed.hostname === 'localhost';
      const isIpAddress = /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(parsed.hostname);
      const missingDot = !parsed.hostname.includes('.');
      
      if (isLocalhost || isIpAddress || missingDot) {
        return false;
      }
      return true;
    } catch {
      return false;
    }
  }, "Must include a recognisable domain and not be localhost/IP")
});

export const ideaInputSchema = z.object({
  idea: z.string()
    .min(100, "Please describe your idea in at least 100 characters")
    .max(2000, "Maximum length exceeded")
    .refine(val => val.trim().length > 0, "Must not be only whitespace")
    .refine(val => {
      // Must not be a URL
      try {
        new URL(val);
        return false;
      } catch {
        return true;
      }
    }, "This looks like a URL. Please use the URL tab instead.")
});
