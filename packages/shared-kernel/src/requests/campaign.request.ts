import { z } from "zod";

export const CreateCampaignRequest = z.object({
  name: z.string().min(1).max(150),
  description: z.string().optional(),
  startsAt: z.coerce.date().optional(),
  endsAt: z.coerce.date().optional(),
});

export const UpdateCampaignRequest = CreateCampaignRequest.partial().extend({
  isActive: z.boolean().optional(),
});

export type CreateCampaignRequest = z.infer<typeof CreateCampaignRequest>;
export type UpdateCampaignRequest = z.infer<typeof UpdateCampaignRequest>;
