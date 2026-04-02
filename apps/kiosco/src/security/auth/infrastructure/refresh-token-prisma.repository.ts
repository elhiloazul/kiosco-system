import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../shared/infrastructure/prisma.service';
import { IRefreshTokenRepository } from '../domain/refresh-token.repository';

@Injectable()
export class RefreshTokenPrismaRepository implements IRefreshTokenRepository {
  constructor(private readonly prisma: PrismaService) {}

  async save(token: string, adminId: string, expiresAt: Date): Promise<void> {
    await this.prisma.refreshToken.create({
      data: { token, adminId, expiresAt },
    });
  }

  async findByToken(token: string): Promise<{ adminId: string; expiresAt: Date } | null> {
    const row = await this.prisma.refreshToken.findUnique({ where: { token } });
    if (!row) return null;
    return { adminId: row.adminId, expiresAt: row.expiresAt };
  }

  async deleteByToken(token: string): Promise<void> {
    await this.prisma.refreshToken.deleteMany({ where: { token } });
  }

  async deleteExpiredByAdminId(adminId: string): Promise<void> {
    await this.prisma.refreshToken.deleteMany({
      where: { adminId, expiresAt: { lt: new Date() } },
    });
  }
}
