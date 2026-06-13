import { z } from 'zod';

export const SaveAssetInputDto = z.object({
  tenantId: z.string().min(1),
  name: z.string().min(1),
  url: z.string().url(),
  mimeType: z.string().min(1),
  size: z.number().int().positive(),
});

export const GetTenantAssetsInputDto = z.object({
  tenantId: z.string().min(1),
  type: z.enum(['image', 'video', 'document']).optional(),
});

export const MediaAssetOutputDto = z.object({
  id: z.string(),
  tenantId: z.string(),
  name: z.string(),
  url: z.string(),
  mimeType: z.string(),
  size: z.number(),
  createdAt: z.date(),
});

export type SaveAssetInputDto = z.infer<typeof SaveAssetInputDto>;
export type GetTenantAssetsInputDto = z.infer<typeof GetTenantAssetsInputDto>;
export type MediaAssetOutputDto = z.infer<typeof MediaAssetOutputDto>;
