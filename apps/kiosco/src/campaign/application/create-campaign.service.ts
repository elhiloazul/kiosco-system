import { Inject, Injectable } from '@nestjs/common';
import { createId } from '@paralleldrive/cuid2';
import { Campaign } from '../domain/campaign';
import { ICampaignRepository, CAMPAIGN_REPOSITORY } from '../domain/campaign.repository';
import { CreateCampaignInputDto, CampaignOutputDto } from './campaign.dto';

@Injectable()
export class CreateCampaignService {
  constructor(
    @Inject(CAMPAIGN_REPOSITORY)
    private readonly campaignRepository: ICampaignRepository,
  ) {}

  async execute(input: CreateCampaignInputDto): Promise<CampaignOutputDto> {
    const campaign = Campaign.create({
      id: createId(),
      tenantId: input.tenantId,
      name: input.name,
      description: input.description,
      startsAt: input.startsAt,
      endsAt: input.endsAt,
    });

    await this.campaignRepository.save(campaign);

    return {
      id: campaign.id,
      tenantId: campaign.tenantId,
      name: campaign.name,
      description: campaign.description,
      isActive: campaign.isActive,
      startsAt: campaign.startsAt,
      endsAt: campaign.endsAt,
      createdAt: campaign.createdAt,
      updatedAt: campaign.updatedAt,
    };
  }
}