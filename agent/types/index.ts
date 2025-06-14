import { z } from "zod";

// Tipos compartidos entre módulos 

export interface RepoAnalysisResult {
  repoName: string;
  primaryLanguage: string;
  topics: string[];
  activeContributors: number;
  recentCommits: string[];
}

export interface Campaign {
  subject: string;
  body: string;
  targetEmails: string[];
  repoReference: string;
}

// 🔷 SCHEMAS Y TIPOS

export const RepoInputSchema = z.object({
  repoUrl: z.string().url(),
  tenantId: z.string().min(3),
  authToken: z.string().optional(),
});

export type RepoInput = z.infer<typeof RepoInputSchema>;

export const AnalyzerResultSchema = z.object({
  techStack: z.array(z.string()),
  description: z.string(),
  opportunities: z.array(z.string()),
});

export type AnalyzerResult = z.infer<typeof AnalyzerResultSchema>;

export const CampaignOutputSchema = z.object({
  subject: z.string(),
  body: z.string(),
  cta: z.string(),
  segment: z.string(),
});

export type CampaignOutput = z.infer<typeof CampaignOutputSchema>;

export const DispatchPayloadSchema = z.object({
  tenantId: z.string(),
  campaign: CampaignOutputSchema,
});

export type DispatchPayload = z.infer<typeof DispatchPayloadSchema>; 