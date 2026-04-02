import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { TenantModule } from './tenant/infrastructure/tenant.module';
import { CampaignModule } from './campaign/infrastructure/campaign.module';
import { ActivityModule } from './activity/infrastructure/activity.module';
import { SlideModule } from './slide/infrastructure/slide.module';
import { KioskModule } from './kiosk/infrastructure/kiosk.module';
import { AuthModule } from './security/auth/infrastructure/auth.module';
import { JwtAuthGuard } from './security/guards/jwt-auth.guard';

@Module({
  imports: [AuthModule, TenantModule, CampaignModule, ActivityModule, SlideModule, KioskModule],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
