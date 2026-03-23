import { z } from "zod";

export const CreateTenantRequest = z.object({
  name: z.string().min(1).max(100),
  logoUrl: z.string().url().optional(),
});

export const UpdateTenantRequest = CreateTenantRequest.partial();

export type CreateTenantRequest = z.infer<typeof CreateTenantRequest>;
export type UpdateTenantRequest = z.infer<typeof UpdateTenantRequest>;
