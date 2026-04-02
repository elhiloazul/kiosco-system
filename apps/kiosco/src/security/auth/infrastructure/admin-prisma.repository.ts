import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../shared/infrastructure/prisma.service';
import { Admin } from '../domain/admin.aggregate';
import { IAdminRepository } from '../domain/admin.repository';

@Injectable()
export class AdminPrismaRepository implements IAdminRepository {
  constructor(private readonly prisma: PrismaService) {}

  async save(admin: Admin): Promise<void> {
    await this.prisma.admin.upsert({
      where: { id: admin.id },
      create: {
        id: admin.id,
        name: admin.name,
        email: admin.email.toString(),
        passwordHash: admin.passwordHash,
        createdAt: admin.createdAt,
        updatedAt: admin.updatedAt,
      },
      update: {
        name: admin.name,
        passwordHash: admin.passwordHash,
        updatedAt: admin.updatedAt,
      },
    });
  }

  async findByEmail(email: string): Promise<Admin | null> {
    const row = await this.prisma.admin.findUnique({ where: { email } });
    if (!row) return null;
    return Admin.reconstitute(row);
  }

  async findById(id: string): Promise<Admin | null> {
    const row = await this.prisma.admin.findUnique({ where: { id } });
    if (!row) return null;
    return Admin.reconstitute(row);
  }
}
