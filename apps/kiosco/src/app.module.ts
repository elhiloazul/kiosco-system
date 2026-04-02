import { Module } from '@nestjs/common';
import { TenantModule } from './tenant/infrastructure/tenant.module';
import { CampaignModule } from './campaign/infrastructure/campaign.module';
import { ActivityModule } from './activity/infrastructure/activity.module';
import { SlideModule } from './slide/infrastructure/slide.module';
import { KioskModule } from './kiosk/infrastructure/kiosk.module';

@Module({
  imports: [TenantModule, CampaignModule, ActivityModule, SlideModule, KioskModule],
})
export class AppModule {}
