import { z } from 'zod';

// ─── Input DTOs ───────────────────────────────────────────────────────────────

export const CreateKioskInputDto = z.object({
  tenantId: z.string().min(1),
  name: z.string().min(1).max(150),
  location: z.string().optional(),
});

export const UpdateKioskInputDto = z.object({
  id: z.string().min(1),
  name: z.string().min(1).max(150).optional(),
  location: z.string().nullable().optional(),
  campaignId: z.string().nullable().optional(),
  isActive: z.boolean().optional(),
});

// ─── Output DTO ───────────────────────────────────────────────────────────────

export const KioskOutputDto = z.object({
  id: z.string(),
  tenantId: z.string(),
  name: z.string(),
  identifier: z.string(),
  apiKey: z.string(),
  location: z.string().nullable(),
  campaignId: z.string().nullable(),
  isActive: z.boolean(),
  lastSeenAt: z.date().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type CreateKioskInputDto = z.infer<typeof CreateKioskInputDto>;
export type UpdateKioskInputDto = z.infer<typeof UpdateKioskInputDto>;
export type KioskOutputDto = z.infer<typeof KioskOutputDto>;
