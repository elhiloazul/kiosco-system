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

// ─── Output DTOs ─────────────────────────────────────────────────────────────

export const AdminOutputDto = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const TokensOutputDto = z.object({
  accessToken: z.string(),
  refreshToken: z.string(),
});

export type LoginInputDto = z.infer<typeof LoginInputDto>;
export type RefreshTokenInputDto = z.infer<typeof RefreshTokenInputDto>;
export type LogoutInputDto = z.infer<typeof LogoutInputDto>;
export type UpdateProfileInputDto = z.infer<typeof UpdateProfileInputDto>;
export type AdminOutputDto = z.infer<typeof AdminOutputDto>;
export type TokensOutputDto = z.infer<typeof TokensOutputDto>;
