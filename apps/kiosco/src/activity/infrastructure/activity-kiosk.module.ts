import { Module } from '@nestjs/common';
import { ActivityModule } from './activity.module';
import { KioskActivityController } from '../../entrypoints/web/activity/kiosk/activity.controller';
import { GetMenuByCampaignService } from '../application/get-menu-by-campaign.service';

@Module({
  imports: [ActivityModule],
  controllers: [KioskActivityController],
  providers: [GetMenuByCampaignService],
})
export class ActivityKioskModule {}
