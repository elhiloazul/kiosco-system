import { Module } from '@nestjs/common';
import { TenantModule } from './tenant/infrastructure/tenant.module';
import { CampaignModule } from './campaign/infrastructure/campaign.module';

@Module({
  imports: [TenantModule, CampaignModule],
})
export class AppModule {}
