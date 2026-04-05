import { Controller, Get, NotFoundException } from '@nestjs/common';
import { GetMenuByCampaignService } from '@activity/application/get-menu-by-campaign.service';
import { CurrentKiosk } from '@security/guards/current-kiosk.decorator';
import { KioskPayload } from '@security/guards/kiosk-api-key.guard';

@Controller()
export class KioskActivityController {
  constructor(private readonly getMenuByCampaign: GetMenuByCampaignService) {}

  @Get('menu')
  getMenu(@CurrentKiosk() kiosk: KioskPayload) {
    if (!kiosk.campaignId) {
      throw new NotFoundException('Este kiosco no tiene una campaña asignada');
    }
    return this.getMenuByCampaign.execute(kiosk.campaignId);
  }
}
