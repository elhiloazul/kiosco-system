import { Module } from '@nestjs/common';
import { ACTIVITY_REPOSITORY } from '../domain/activity.repository';
import { ActivityPrismaRepository } from './activity-prisma.repository';
import { CreateActivityService } from '../application/create-activity.service';
import { GetActivitiesByCampaignService } from '../application/get-activities-by-campaign.service';
import { UpdateActivityService } from '../application/update-activity.service';
import { PrismaService } from '../../shared/infrastructure/prisma.service';
import { ActivityController } from '../../entrypoints/web/activity/activity.controller';

@Module({
  controllers: [ActivityController],
  providers: [
    PrismaService,
    {
      provide: ACTIVITY_REPOSITORY,
      useClass: ActivityPrismaRepository,
    },
    CreateActivityService,
    GetActivitiesByCampaignService,
    UpdateActivityService,
  ],
})
export class ActivityModule {}
