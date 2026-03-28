import { z } from 'zod';

// ─── Input DTOs ───────────────────────────────────────────────────────────────

export const CreateCampaignInputDto = z.object({
  tenantId: z.string().min(1),
  name: z.string().min(1).max(100),
  description: z.string().optional(),
  startsAt: z.coerce.date().optional(),
  endsAt: z.coerce.date().optional(),
});

export const UpdateCampaignInputDto = z.object({
  id: z.string().min(1),
  name: z.string().min(1).max(100).optional(),
  description: z.string().nullable().optional(),
  isActive: z.boolean().optional(),
  startsAt: z.coerce.date().nullable().optional(),
  endsAt: z.coerce.date().nullable().optional(),
});

// ─── Output DTO ───────────────────────────────────────────────────────────────

export const CampaignOutputDto = z.object({
  id: z.string(),
  tenantId: z.string(),
  name: z.string(),
  description: z.string().nullable(),
  isActive: z.boolean(),
  startsAt: z.date().nullable(),
  endsAt: z.date().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type CreateCampaignInputDto = z.infer<typeof CreateCampaignInputDto>;
export type UpdateCampaignInputDto = z.infer<typeof UpdateCampaignInputDto>;
export type CampaignOutputDto = z.infer<typeof CampaignOutputDto>;
