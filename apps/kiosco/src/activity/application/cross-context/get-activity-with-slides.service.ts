import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ACTIVITY_REPOSITORY, IActivityRepository } from '@activity/domain/activity.repository';
import { SLIDE_REPOSITORY, ISlideRepository } from '@slide/domain/slide.repository';

export interface KioskSlideOutputDto {
  id: string;
  type: string;
  order: number;
  [key: string]: unknown;
}

export interface KioskActivityOutputDto {
  id: string;
  name: string;
  slides: KioskSlideOutputDto[];
}

@Injectable()
export class GetActivityWithSlidesService {
  constructor(
    @Inject(ACTIVITY_REPOSITORY)
    private readonly activityRepository: IActivityRepository,
    @Inject(SLIDE_REPOSITORY)
    private readonly slideRepository: ISlideRepository,
  ) {}

  async execute(activityId: string): Promise<KioskActivityOutputDto> {
    const activity = await this.activityRepository.findById(activityId);
    if (!activity) throw new NotFoundException('Actividad no encontrada');

    const slides = await this.slideRepository.findByActivityId(activityId);
    const sorted = [...slides].sort((a, b) => a.order - b.order);

    return {
      id: activity.id,
      name: activity.name,
      slides: sorted.map((slide) => ({
        id: slide.id,
        type: slide.type,
        order: slide.order,
        ...slide.content,
      })),
    };
  }
}
