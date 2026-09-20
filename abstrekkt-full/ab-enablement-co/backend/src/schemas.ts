import { z } from 'zod';

export const leadIntakeSchema = z.object({
  name: z.string().min(1).max(120),
  email: z.string().email(),
  organizationName: z.string().min(1).max(160),
  role: z.string().max(120).optional(),
  primaryPain: z.string().min(10).max(2000),
  budgetRange: z.enum(['unknown', 'under_4500', '4500_10000', '10000_25000', '25000_plus']),
  urgency: z.enum(['low', 'medium', 'high']),
  consentToContact: z.literal(true),
});

export type LeadIntake = z.infer<typeof leadIntakeSchema>;

export const agentRunSchema = z.object({
  organizationId: z.string().uuid(),
  taskType: z.enum(['strategy', 'architecture', 'security', 'product', 'revenue', 'delivery', 'research']),
  prompt: z.string().min(20).max(20000),
  contextSourceIds: z.array(z.string().uuid()).max(50),
  requiresHumanReview: z.boolean().default(true),
});

export type AgentRunRequest = z.infer<typeof agentRunSchema>;
