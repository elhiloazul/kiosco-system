import { Module } from '@nestjs/common';
import { APP_GUARD, RouterModule } from '@nestjs/core';
import { TenantModule } from './tenant/infrastructure/tenant.module';
import { CampaignModule } from './campaign/infrastructure/campaign.module';
import { ActivityModule } from './activity/infrastructure/activity.module';
import { SlideModule } from './slide/infrastructure/slide.module';
import { KioskModule } from './kiosk/infrastructure/kiosk.module';
import { AuthModule } from './security/auth/infrastructure/auth.module';
import { JwtAuthGuard } from './security/guards/jwt-auth.guard';

@Module({
  imports: [
    AuthModule,
    TenantModule,
    CampaignModule,
    ActivityModule,
    SlideModule,
    KioskModule,
    RouterModule.register([
      { path: 'backoffice/v1', module: AuthModule },
      { path: 'backoffice/v1', module: TenantModule },
      { path: 'backoffice/v1', module: CampaignModule },
      { path: 'backoffice/v1', module: ActivityModule },
      { path: 'backoffice/v1', module: SlideModule },
      { path: 'backoffice/v1', module: KioskModule },
    ]),
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
