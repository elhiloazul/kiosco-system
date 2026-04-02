import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../shared/infrastructure/prisma.service';
import { Campaign } from '../domain/campaign';
import { ICampaignRepository } from '../domain/campaign.repository';

@Injectable()
export class CampaignPrismaRepository implements ICampaignRepository {
  constructor(private readonly prisma: PrismaService) {}

  async save(campaign: Campaign): Promise<void> {
    await this.prisma.campaign.upsert({
      where: { id: campaign.id },
      create: {
        id: campaign.id,
        tenantId: campaign.tenantId,
        name: campaign.name,
        description: campaign.description,
        isActive: campaign.isActive,
        startsAt: campaign.startsAt,
        endsAt: campaign.endsAt,
        createdAt: campaign.createdAt,
        updatedAt: campaign.updatedAt,
      },
      update: {
        name: campaign.name,
        description: campaign.description,
        isActive: campaign.isActive,
        startsAt: campaign.startsAt,
        endsAt: campaign.endsAt,
        updatedAt: campaign.updatedAt,
      },
    });
  }

  async findById(id: string): Promise<Campaign | null> {
    const row = await this.prisma.campaign.findUnique({ where: { id } });
    if (!row) return null;
    return Campaign.reconstitute(row);
  }

  async findByTenantId(tenantId: string): Promise<Campaign[]> {
    const rows = await this.prisma.campaign.findMany({
      where: { tenantId },
      orderBy: { createdAt: 'desc' },
    });
    return rows.map((row) => Campaign.reconstitute(row));
  }
}
