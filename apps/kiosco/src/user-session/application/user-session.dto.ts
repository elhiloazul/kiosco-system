import { z } from 'zod';

const ActivityProgressDto = z.object({
  name: z.string().default(''),
  lastSlideIndex: z.number().int().min(0),
  completed: z.boolean(),
  completedAt: z.string().optional(),
});

export const UpsertSessionInputDto = z.object({
  id: z.string().uuid(),
  name: z.string().min(1),
  age: z.string().min(1),
  neighborhood: z.string().min(1),
  activities: z.record(ActivityProgressDto).default({}),
  startedAt: z.string().datetime(),
  endedAt: z.string().datetime().optional(),
});

export const SessionOutputDto = z.object({
  id: z.string(),
  kioskId: z.string(),
  name: z.string(),
  age: z.string(),
  neighborhood: z.string(),
  activities: z.record(ActivityProgressDto),
  startedAt: z.date(),
  endedAt: z.date().nullable(),
  createdAt: z.date(),
});

export type UpsertSessionInputDto = z.infer<typeof UpsertSessionInputDto>;
export type SessionOutputDto = z.infer<typeof SessionOutputDto>;
