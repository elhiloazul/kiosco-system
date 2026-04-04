import { z } from 'zod';

// ─── Shared ───────────────────────────────────────────────────────────────────

const MenuConfigDto = z.object({
  audio: z.string().optional(),
  popoverDescription: z.string().optional(),
});

// ─── Input DTOs ───────────────────────────────────────────────────────────────

export const CreateActivityInputDto = z.object({
  campaignId: z.string().min(1),
  name: z.string().min(1).max(100),
  order: z.number().int().min(0).optional(),
});

export const UpdateActivityInputDto = z.object({
  id: z.string().min(1),
  name: z.string().min(1).max(100).optional(),
  order: z.number().int().min(0).optional(),
  isActive: z.boolean().optional(),
  showInMenu: z.boolean().optional(),
  menuOrder: z.number().int().min(0).nullable().optional(),
  menuConfig: MenuConfigDto.nullable().optional(),
});

// ─── Output DTO ───────────────────────────────────────────────────────────────

export const ActivityOutputDto = z.object({
  id: z.string(),
  campaignId: z.string(),
  name: z.string(),
  order: z.number(),
  isActive: z.boolean(),
  showInMenu: z.boolean(),
  menuOrder: z.number().nullable(),
  menuConfig: MenuConfigDto.nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type CreateActivityInputDto = z.infer<typeof CreateActivityInputDto>;
export type UpdateActivityInputDto = z.infer<typeof UpdateActivityInputDto>;
export type ActivityOutputDto = z.infer<typeof ActivityOutputDto>;
