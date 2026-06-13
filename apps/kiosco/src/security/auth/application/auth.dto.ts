import { z } from 'zod';

// ─── Input DTOs ───────────────────────────────────────────────────────────────

export const LoginInputDto = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const RefreshTokenInputDto = z.object({
  refreshToken: z.string().min(1),
});

export const LogoutInputDto = z.object({
  refreshToken: z.string().min(1),
});

export const UpdateProfileInputDto = z.object({
  name: z.string().min(1).max(100).optional(),
  password: z.string().min(8).optional(),
});

export const CreateAdminInputDto = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email(),
  password: z.string().min(8),
});

export const UpdateAdminInputDto = z.object({
  id: z.string().min(1),
  status: z.enum(['ENABLED', 'DISABLED']).optional(),
});

// ─── Output DTOs ─────────────────────────────────────────────────────────────

export const AdminOutputDto = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string(),
  status: z.enum(['ENABLED', 'DISABLED']),
  isPrincipal: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const AdminListItemOutputDto = AdminOutputDto.extend({
  isPrincipal: z.boolean(),
});

export const TokensOutputDto = z.object({
  accessToken: z.string(),
  refreshToken: z.string(),
});

export type LoginInputDto = z.infer<typeof LoginInputDto>;
export type RefreshTokenInputDto = z.infer<typeof RefreshTokenInputDto>;
export type LogoutInputDto = z.infer<typeof LogoutInputDto>;
export type UpdateProfileInputDto = z.infer<typeof UpdateProfileInputDto>;
export type CreateAdminInputDto = z.infer<typeof CreateAdminInputDto>;
export type UpdateAdminInputDto = z.infer<typeof UpdateAdminInputDto>;
export type AdminOutputDto = z.infer<typeof AdminOutputDto>;
export type AdminListItemOutputDto = z.infer<typeof AdminListItemOutputDto>;
export type TokensOutputDto = z.infer<typeof TokensOutputDto>;
