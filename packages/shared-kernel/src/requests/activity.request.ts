import { z } from "zod";

export const CreateActivityRequest = z.object({
  name: z.string().min(1).max(150),
  order: z.number().int().min(0).optional(),
});

export const UpdateActivityRequest = CreateActivityRequest.partial().extend({
  isActive: z.boolean().optional(),
});

export type CreateActivityRequest = z.infer<typeof CreateActivityRequest>;
export type UpdateActivityRequest = z.infer<typeof UpdateActivityRequest>;
