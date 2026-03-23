import { z } from 'zod';

// ─── Input DTOs ───────────────────────────────────────────────────────────────

export const CreateTenantInputDto = z.object({
  name: z.string().min(1).max(100),
  logoUrl: z.string().url().optional(),
});

// ─── Output DTO ───────────────────────────────────────────────────────────────

export const TenantOutputDto = z.object({
  id: z.string(),
  name: z.string(),
  logoUrl: z.string().nullable(),
  isActive: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type CreateTenantInputDto = z.infer<typeof CreateTenantInputDto>;
export type TenantOutputDto = z.infer<typeof TenantOutputDto>;
