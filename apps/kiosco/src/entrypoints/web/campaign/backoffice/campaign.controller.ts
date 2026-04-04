import { Controller, Get, Post, Patch, Body, Param } from '@nestjs/common';
import { CreateCampaignService } from '@campaign/application/create-campaign.service';
import { GetCampaignsByTenantService } from '@campaign/application/get-campaigns-by-tenant.service';
import { UpdateCampaignService } from '@campaign/application/update-campaign.service';
import { CreateCampaignInputDto, UpdateCampaignInputDto } from '@campaign/application/campaign.dto';

@Controller()
export class CampaignController {
  constructor(
    private readonly createCampaign: CreateCampaignService,
    private readonly getCampaignsByTenant: GetCampaignsByTenantService,
    private readonly updateCampaign: UpdateCampaignService,
  ) {}

  @Post('tenants/:tenantId/campaigns')
  create(@Param('tenantId') tenantId: string, @Body() body: unknown) {
    const input = CreateCampaignInputDto.parse({ tenantId, ...(body as object) });
    return this.createCampaign.execute(input);
  }

  @Get('tenants/:tenantId/campaigns')
  findByTenant(@Param('tenantId') tenantId: string) {
    return this.getCampaignsByTenant.execute(tenantId);
  }

  @Patch('campaigns/:id')
  update(@Param('id') id: string, @Body() body: unknown) {
    const input = UpdateCampaignInputDto.parse({ id, ...(body as object) });
    return this.updateCampaign.execute(input);
  }
}
