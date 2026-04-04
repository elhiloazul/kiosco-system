import { z } from 'zod';
import { SlideType } from '@kiosco/shared-kernel';

// ─── Input DTOs ───────────────────────────────────────────────────────────────

export const CreateSlideInputDto = z.object({
  activityId: z.string().min(1),
  type: z.nativeEnum(SlideType),
  name: z.string().min(1).max(100),
  order: z.number().int().min(0).optional(),
  content: z.record(z.unknown()).optional(),
});

export const UpdateSlideInputDto = z.object({
  id: z.string().min(1),
  type: z.nativeEnum(SlideType).optional(),
  name: z.string().min(1).max(100).optional(),
  order: z.number().int().min(0).optional(),
  content: z.record(z.unknown()).optional(),
});

// ─── Output DTO ───────────────────────────────────────────────────────────────

export const SlideOutputDto = z.object({
  id: z.string(),
  activityId: z.string(),
  type: z.nativeEnum(SlideType),
  name: z.string(),
  order: z.number(),
  content: z.record(z.unknown()),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type CreateSlideInputDto = z.infer<typeof CreateSlideInputDto>;
export type UpdateSlideInputDto = z.infer<typeof UpdateSlideInputDto>;
export type SlideOutputDto = z.infer<typeof SlideOutputDto>;
