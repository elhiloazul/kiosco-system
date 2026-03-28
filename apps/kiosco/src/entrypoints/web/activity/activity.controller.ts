import { Controller, Get, Post, Patch, Body, Param } from '@nestjs/common';
import { CreateActivityService } from '../../../activity/application/create-activity.service';
import { GetActivitiesByCampaignService } from '../../../activity/application/get-activities-by-campaign.service';
import { UpdateActivityService } from '../../../activity/application/update-activity.service';
import { CreateActivityInputDto, UpdateActivityInputDto } from '../../../activity/application/activity.dto';

@Controller()
export class ActivityController {
  constructor(
    private readonly createActivity: CreateActivityService,
    private readonly getActivitiesByCampaign: GetActivitiesByCampaignService,
    private readonly updateActivity: UpdateActivityService,
  ) {}

  @Post('campaigns/:campaignId/activities')
  create(@Param('campaignId') campaignId: string, @Body() body: unknown) {
    const input = CreateActivityInputDto.parse({ campaignId, ...(body as object) });
    return this.createActivity.execute(input);
  }

  @Get('campaigns/:campaignId/activities')
  findByCampaign(@Param('campaignId') campaignId: string) {
    return this.getActivitiesByCampaign.execute(campaignId);
  }

  @Patch('activities/:id')
  update(@Param('id') id: string, @Body() body: unknown) {
    const input = UpdateActivityInputDto.parse({ id, ...(body as object) });
    return this.updateActivity.execute(input);
  }
}
