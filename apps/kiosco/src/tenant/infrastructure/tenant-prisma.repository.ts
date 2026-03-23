import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/prisma.service';
import { Tenant } from '../domain/tenant';
import { ITenantRepository } from '../domain/tenant.repository';

@Injectable()
export class TenantPrismaRepository implements ITenantRepository {
  constructor(private readonly prisma: PrismaService) {}

  async save(tenant: Tenant): Promise<void> {
    await this.prisma.tenant.upsert({
      where: { id: tenant.id },
      create: {
        id: tenant.id,
        name: tenant.name,
        logoUrl: tenant.logoUrl,
        isActive: tenant.isActive,
        createdAt: tenant.createdAt,
        updatedAt: tenant.updatedAt,
      },
      update: {
        name: tenant.name,
        logoUrl: tenant.logoUrl,
        isActive: tenant.isActive,
        updatedAt: tenant.updatedAt,
      },
    });
  }

  async findById(id: string): Promise<Tenant | null> {
    const row = await this.prisma.tenant.findUnique({ where: { id } });
    if (!row) return null;
    return Tenant.reconstitute(row);
  }

  async findAll(): Promise<Tenant[]> {
    const rows = await this.prisma.tenant.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return rows.map((row) => Tenant.reconstitute(row));
  }
}
