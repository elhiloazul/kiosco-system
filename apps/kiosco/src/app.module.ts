import { Module } from '@nestjs/common';
import { APP_GUARD, RouterModule } from '@nestjs/core';
import { TenantModule } from './tenant/infrastructure/tenant.module';
import { CampaignModule } from './campaign/infrastructure/campaign.module';
import { ActivityModule } from './activity/infrastructure/activity.module';
import { ActivityKioskModule } from './activity/infrastructure/activity-kiosk.module';
import { SlideModule } from './slide/infrastructure/slide.module';
import { KioskModule } from './kiosk/infrastructure/kiosk.module';
import { AuthModule } from './security/auth/infrastructure/auth.module';
import { JwtAuthGuard } from './security/guards/jwt-auth.guard';
import { KioskApiKeyGuard } from './security/guards/kiosk-api-key.guard';

@Module({
  imports: [
    AuthModule,
    TenantModule,
    CampaignModule,
    ActivityModule,
    ActivityKioskModule,
    SlideModule,
    KioskModule,
    RouterModule.register([
      { path: 'backoffice/v1', module: AuthModule },
      { path: 'backoffice/v1', module: TenantModule },
      { path: 'backoffice/v1', module: CampaignModule },
      { path: 'backoffice/v1', module: ActivityModule },
      { path: 'backoffice/v1', module: SlideModule },
      { path: 'backoffice/v1', module: KioskModule },
      { path: 'kiosk/v1', module: ActivityKioskModule },
    ]),
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: KioskApiKeyGuard,
    },
    KioskApiKeyGuard,
  ],
})
export class AppModule {}
