import { Controller, Get, NotFoundException, Param } from '@nestjs/common';
import { GetMenuByCampaignService } from '@activity/application/get-menu-by-campaign.service';
import { GetActivityWithSlidesService } from '@activity/application/cross-context/get-activity-with-slides.service';
import { CurrentKiosk } from '@security/guards/current-kiosk.decorator';
import { KioskPayload } from '@security/guards/kiosk-api-key.guard';

@Controller()
export class KioskActivityController {
  constructor(
    private readonly getMenuByCampaign: GetMenuByCampaignService,
    private readonly getActivityWithSlides: GetActivityWithSlidesService,
  ) {}

  @Get('menu')
  getMenu(@CurrentKiosk() kiosk: KioskPayload) {
    if (!kiosk.campaignId) {
      throw new NotFoundException('Este kiosco no tiene una campaña asignada');
    }
    return this.getMenuByCampaign.execute(kiosk.campaignId);
  }

  @Get('activities/:id')
  getActivity(@Param('id') id: string) {
    return this.getActivityWithSlides.execute(id);
  }
}
