import { Controller, Get, Param } from '@nestjs/common';
import { GetMenuByCampaignService } from '@activity/application/get-menu-by-campaign.service';
import { CurrentKiosk } from '@security/guards/current-kiosk.decorator';
import { KioskPayload } from '@security/guards/kiosk-api-key.guard';

@Controller()
export class KioskActivityController {
  constructor(private readonly getMenuByCampaign: GetMenuByCampaignService) {}

  @Get('campaigns/:campaignId/menu')
  getMenu(
    @Param('campaignId') campaignId: string,
    @CurrentKiosk() _kiosk: KioskPayload,
  ) {
    return this.getMenuByCampaign.execute(campaignId);
  }
}
