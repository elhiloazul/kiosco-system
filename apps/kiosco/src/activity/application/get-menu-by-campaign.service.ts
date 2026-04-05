import { Inject, Injectable } from '@nestjs/common';
import { IActivityRepository, ACTIVITY_REPOSITORY } from '../domain/activity.repository';

export interface MenuActivityOutputDto {
  id: string;
  name: string;
  menuOrder: number;
  menuConfig: {
    audio?: string;
    popoverDescription?: string;
  };
}

@Injectable()
export class GetMenuByCampaignService {
  constructor(
    @Inject(ACTIVITY_REPOSITORY)
    private readonly activityRepository: IActivityRepository,
  ) {}

  async execute(campaignId: string): Promise<MenuActivityOutputDto[]> {
    const activities = await this.activityRepository.findMenuByCampaignId(campaignId);

    return activities.map((activity) => ({
      id: activity.id,
      name: activity.name,
      menuOrder: activity.menuOrder!,
      menuConfig: {
        audio: activity.menuConfig?.audio,
        popoverDescription: activity.menuConfig?.popoverDescription,
      },
    }));
  }
}
