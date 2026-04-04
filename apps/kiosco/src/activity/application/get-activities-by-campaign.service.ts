import { Inject, Injectable } from '@nestjs/common';
import { IActivityRepository, ACTIVITY_REPOSITORY } from '../domain/activity.repository';
import { ActivityOutputDto } from './activity.dto';

@Injectable()
export class GetActivitiesByCampaignService {
  constructor(
    @Inject(ACTIVITY_REPOSITORY)
    private readonly activityRepository: IActivityRepository,
  ) {}

  async execute(campaignId: string): Promise<ActivityOutputDto[]> {
    const activities = await this.activityRepository.findByCampaignId(campaignId);

    return activities.map((activity) => ({
      id: activity.id,
      campaignId: activity.campaignId,
      name: activity.name,
      order: activity.order,
      isActive: activity.isActive,
      showInMenu: activity.showInMenu,
      menuOrder: activity.menuOrder,
      menuConfig: activity.menuConfig,
      createdAt: activity.createdAt,
      updatedAt: activity.updatedAt,
    }));
  }
}
