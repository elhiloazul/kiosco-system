import { Module } from '@nestjs/common';
import { ActivityModule } from './activity.module';
import { SlideModule } from '../../slide/infrastructure/slide.module';
import { KioskActivityController } from '../../entrypoints/web/activity/kiosk/activity.controller';
import { GetMenuByCampaignService } from '../application/get-menu-by-campaign.service';
import { GetActivityWithSlidesService } from '../application/cross-context/get-activity-with-slides.service';

@Module({
  imports: [ActivityModule, SlideModule],
  controllers: [KioskActivityController],
  providers: [GetMenuByCampaignService, GetActivityWithSlidesService],
})
export class ActivityKioskModule {}
