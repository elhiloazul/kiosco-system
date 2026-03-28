import { Controller, Get, Post, Patch, Body, Param } from '@nestjs/common';
import { CreateSlideService } from '../../../slide/application/create-slide.service';
import { GetSlidesByActivityService } from '../../../slide/application/get-slides-by-activity.service';
import { GetSlideByIdService } from '../../../slide/application/get-slide-by-id.service';
import { UpdateSlideService } from '../../../slide/application/update-slide.service';
import { CreateSlideInputDto, UpdateSlideInputDto } from '../../../slide/application/slide.dto';

@Controller()
export class SlideController {
  constructor(
    private readonly createSlide: CreateSlideService,
    private readonly getSlidesByActivity: GetSlidesByActivityService,
    private readonly getSlideById: GetSlideByIdService,
    private readonly updateSlide: UpdateSlideService,
  ) {}

  @Post('activities/:activityId/slides')
  create(@Param('activityId') activityId: string, @Body() body: unknown) {
    const input = CreateSlideInputDto.parse({ activityId, ...(body as object) });
    return this.createSlide.execute(input);
  }

  @Get('activities/:activityId/slides')
  findByActivity(@Param('activityId') activityId: string) {
    return this.getSlidesByActivity.execute(activityId);
  }

  @Get('slides/:id')
  findById(@Param('id') id: string) {
    return this.getSlideById.execute(id);
  }

  @Patch('slides/:id')
  update(@Param('id') id: string, @Body() body: unknown) {
    const input = UpdateSlideInputDto.parse({ id, ...(body as object) });
    return this.updateSlide.execute(input);
  }
}
