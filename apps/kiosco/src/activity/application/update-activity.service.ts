import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { IActivityRepository, ACTIVITY_REPOSITORY } from '../domain/activity.repository';
import { UpdateActivityInputDto, ActivityOutputDto } from './activity.dto';

@Injectable()
export class UpdateActivityService {
  constructor(
    @Inject(ACTIVITY_REPOSITORY)
    private readonly activityRepository: IActivityRepository,
  ) {}

  async execute(input: UpdateActivityInputDto): Promise<ActivityOutputDto> {
    const activity = await this.activityRepository.findById(input.id);
    if (!activity) {
      throw new NotFoundException(`Activity with ID ${input.id} not found`);
    }

    activity.update(input);
    await this.activityRepository.save(activity);

    return {
      id: activity.id,
      campaignId: activity.campaignId,
      name: activity.name,
      order: activity.order,
      isActive: activity.isActive,
      createdAt: activity.createdAt,
      updatedAt: activity.updatedAt,
    };
  }
}
