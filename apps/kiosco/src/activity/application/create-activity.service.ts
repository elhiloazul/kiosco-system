import { Inject, Injectable } from '@nestjs/common';
import { createId } from '@paralleldrive/cuid2';
import { Activity } from '../domain/activity';
import { IActivityRepository, ACTIVITY_REPOSITORY } from '../domain/activity.repository';
import { CreateActivityInputDto, ActivityOutputDto } from './activity.dto';

@Injectable()
export class CreateActivityService {
  constructor(
    @Inject(ACTIVITY_REPOSITORY)
    private readonly activityRepository: IActivityRepository,
  ) {}

  async execute(input: CreateActivityInputDto): Promise<ActivityOutputDto> {
    const activity = Activity.create({
      id: createId(),
      campaignId: input.campaignId,
      name: input.name,
      order: input.order,
    });

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
