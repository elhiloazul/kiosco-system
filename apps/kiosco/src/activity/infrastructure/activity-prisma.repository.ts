import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../shared/infrastructure/prisma.service';
import { Activity } from '../domain/activity';
import { IActivityRepository } from '../domain/activity.repository';

@Injectable()
export class ActivityPrismaRepository implements IActivityRepository {
  constructor(private readonly prisma: PrismaService) {}

  async save(activity: Activity): Promise<void> {
    await this.prisma.activity.upsert({
      where: { id: activity.id },
      create: {
        id: activity.id,
        campaignId: activity.campaignId,
        name: activity.name,
        order: activity.order,
        isActive: activity.isActive,
        createdAt: activity.createdAt,
        updatedAt: activity.updatedAt,
      },
      update: {
        name: activity.name,
        order: activity.order,
        isActive: activity.isActive,
        updatedAt: activity.updatedAt,
      },
    });
  }

  async findById(id: string): Promise<Activity | null> {
    const row = await this.prisma.activity.findUnique({ where: { id } });
    if (!row) return null;
    return Activity.reconstitute(row);
  }

  async findByCampaignId(campaignId: string): Promise<Activity[]> {
    const rows = await this.prisma.activity.findMany({
      where: { campaignId },
      orderBy: { order: 'asc' },
    });
    return rows.map((row) => Activity.reconstitute(row));
  }
}
