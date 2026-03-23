import { z } from "zod";

export const CreateKioskRequest = z.object({
  name: z.string().min(1).max(150),
  identifier: z.string().min(1).max(100),
  location: z.string().optional(),
});

export const UpdateKioskRequest = z.object({
  name: z.string().min(1).max(150).optional(),
  location: z.string().optional(),
  campaignId: z.string().nullable().optional(),
  isActive: z.boolean().optional(),
});

export type CreateKioskRequest = z.infer<typeof CreateKioskRequest>;
export type UpdateKioskRequest = z.infer<typeof UpdateKioskRequest>;
