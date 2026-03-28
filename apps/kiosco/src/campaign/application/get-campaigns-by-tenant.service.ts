import { Inject, Injectable } from '@nestjs/common';
import { ICampaignRepository, CAMPAIGN_REPOSITORY } from '../domain/campaign.repository';
import { CampaignOutputDto } from './campaign.dto';

@Injectable()
export class GetCampaignsByTenantService {
  constructor(
    @Inject(CAMPAIGN_REPOSITORY)
    private readonly campaignRepository: ICampaignRepository,
  ) {}

  async execute(tenantId: string): Promise<CampaignOutputDto[]> {
    const campaigns = await this.campaignRepository.findByTenantId(tenantId);

    return campaigns.map((campaign) => ({
      id: campaign.id,
      tenantId: campaign.tenantId,
      name: campaign.name,
      description: campaign.description,
      isActive: campaign.isActive,
      startsAt: campaign.startsAt,
      endsAt: campaign.endsAt,
      createdAt: campaign.createdAt,
      updatedAt: campaign.updatedAt,
    }));
  }
}
