import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ICampaignRepository, CAMPAIGN_REPOSITORY } from '../domain/campaign.repository';
import { UpdateCampaignInputDto, CampaignOutputDto } from './campaign.dto';

@Injectable()
export class UpdateCampaignService {
  constructor(
    @Inject(CAMPAIGN_REPOSITORY)
    private readonly campaignRepository: ICampaignRepository,
  ) {}

  async execute(input: UpdateCampaignInputDto): Promise<CampaignOutputDto> {
    const campaign = await this.campaignRepository.findById(input.id);
    if (!campaign) {
      throw new NotFoundException(`Campaign with ID ${input.id} not found`);
    }

    campaign.update(input);
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
