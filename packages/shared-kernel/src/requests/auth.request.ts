import { z } from "zod";

export const LoginRequest = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const RefreshTokenRequest = z.object({
  refreshToken: z.string().min(1),
});

export const LogoutRequest = z.object({
  refreshToken: z.string().min(1),
});

export const UpdateProfileRequest = z.object({
  name: z.string().min(1).max(100).optional(),
  password: z.string().min(8).optional(),
});

export type LoginRequest = z.infer<typeof LoginRequest>;
export type RefreshTokenRequest = z.infer<typeof RefreshTokenRequest>;
export type LogoutRequest = z.infer<typeof LogoutRequest>;
export type UpdateProfileRequest = z.infer<typeof UpdateProfileRequest>;
