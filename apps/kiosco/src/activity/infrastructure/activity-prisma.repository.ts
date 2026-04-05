import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../shared/infrastructure/prisma.service';
import { Activity, MenuConfig } from '../domain/activity';
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
        showInMenu: activity.showInMenu,
        menuOrder: activity.menuOrder,
        menuConfig: activity.menuConfig ?? undefined,
        createdAt: activity.createdAt,
        updatedAt: activity.updatedAt,
      },
      update: {
        name: activity.name,
        order: activity.order,
        isActive: activity.isActive,
        showInMenu: activity.showInMenu,
        menuOrder: activity.menuOrder,
        menuConfig: activity.menuConfig ?? undefined,
        updatedAt: activity.updatedAt,
      },
    });
  }

  async findById(id: string): Promise<Activity | null> {
    const row = await this.prisma.activity.findUnique({ where: { id } });
    if (!row) return null;
    return Activity.reconstitute({ ...row, menuConfig: row.menuConfig as MenuConfig | null });
  }

  async findByCampaignId(campaignId: string): Promise<Activity[]> {
    const rows = await this.prisma.activity.findMany({
      where: { campaignId },
      orderBy: [{ menuOrder: 'asc' }, { createdAt: 'asc' }],
    });
    return rows.map((row) =>
      Activity.reconstitute({ ...row, menuConfig: row.menuConfig as MenuConfig | null }),
    );
  }

  async findMenuByCampaignId(campaignId: string): Promise<Activity[]> {
    const rows = await this.prisma.activity.findMany({
      where: { campaignId, showInMenu: true, isActive: true },
      orderBy: { menuOrder: 'asc' },
    });
    return rows.map((row) =>
      Activity.reconstitute({ ...row, menuConfig: row.menuConfig as MenuConfig | null }),
    );
  }
}
