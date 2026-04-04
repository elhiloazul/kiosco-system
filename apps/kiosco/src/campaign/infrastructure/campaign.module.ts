import { Module } from '@nestjs/common';
import { CAMPAIGN_REPOSITORY } from '../domain/campaign.repository';
import { CampaignPrismaRepository } from './campaign-prisma.repository';
import { CreateCampaignService } from '../application/create-campaign.service';
import { GetCampaignsByTenantService } from '../application/get-campaigns-by-tenant.service';
import { UpdateCampaignService } from '../application/update-campaign.service';
import { PrismaService } from '../../shared/infrastructure/prisma.service';
import { CampaignController } from '../../entrypoints/web/campaign/backoffice/campaign.controller';

@Module({
  controllers: [CampaignController],
  providers: [
    PrismaService,
    {
      provide: CAMPAIGN_REPOSITORY,
      useClass: CampaignPrismaRepository,
    },
    CreateCampaignService,
    GetCampaignsByTenantService,
    UpdateCampaignService,
  ],
})
export class CampaignModule {}
