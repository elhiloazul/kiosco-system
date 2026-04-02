export interface IRefreshTokenRepository {
  save(token: string, adminId: string, expiresAt: Date): Promise<void>;
  findByToken(token: string): Promise<{ adminId: string; expiresAt: Date } | null>;
  deleteByToken(token: string): Promise<void>;
  deleteExpiredByAdminId(adminId: string): Promise<void>;
}

export const REFRESH_TOKEN_REPOSITORY = Symbol('IRefreshTokenRepository');
