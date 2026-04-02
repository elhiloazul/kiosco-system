import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/prisma.service';
import { Kiosk } from '../domain/kiosk';
import { IKioskRepository } from '../domain/kiosk.repository';

@Injectable()
export class KioskPrismaRepository implements IKioskRepository {
  constructor(private readonly prisma: PrismaService) {}

  async save(kiosk: Kiosk): Promise<void> {
    await this.prisma.kiosk.upsert({
      where: { id: kiosk.id },
      create: {
        id: kiosk.id,
        tenantId: kiosk.tenantId,
        name: kiosk.name,
        identifier: kiosk.identifier.toString(),
        apiKey: kiosk.apiKey.toString(),
        location: kiosk.location,
        campaignId: kiosk.campaignId,
        isActive: kiosk.isActive,
        lastSeenAt: kiosk.lastSeenAt,
        createdAt: kiosk.createdAt,
        updatedAt: kiosk.updatedAt,
      },
      update: {
        name: kiosk.name,
        location: kiosk.location,
        campaignId: kiosk.campaignId,
        isActive: kiosk.isActive,
        lastSeenAt: kiosk.lastSeenAt,
        updatedAt: kiosk.updatedAt,
      },
    });
  }

  async findById(id: string): Promise<Kiosk | null> {
    const row = await this.prisma.kiosk.findUnique({ where: { id } });
    if (!row) return null;
    return Kiosk.reconstitute(row);
  }

  async findByTenantId(tenantId: string): Promise<Kiosk[]> {
    const rows = await this.prisma.kiosk.findMany({
      where: { tenantId },
      orderBy: { createdAt: 'desc' },
    });
    return rows.map((row) => Kiosk.reconstitute(row));
  }
}
