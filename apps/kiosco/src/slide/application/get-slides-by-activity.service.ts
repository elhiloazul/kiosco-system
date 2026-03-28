import { Inject, Injectable } from '@nestjs/common';
import { ISlideRepository, SLIDE_REPOSITORY } from '../domain/slide.repository';
import { SlideOutputDto } from './slide.dto';

@Injectable()
export class GetSlidesByActivityService {
  constructor(
    @Inject(SLIDE_REPOSITORY)
    private readonly slideRepository: ISlideRepository,
  ) {}

  async execute(activityId: string): Promise<SlideOutputDto[]> {
    const slides = await this.slideRepository.findByActivityId(activityId);

    return slides.map((slide) => ({
      id: slide.id,
      activityId: slide.activityId,
      type: slide.type,
      order: slide.order,
      content: slide.content,
      createdAt: slide.createdAt,
      updatedAt: slide.updatedAt,
    }));
  }
}
