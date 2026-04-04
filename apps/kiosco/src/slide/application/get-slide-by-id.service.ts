import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ISlideRepository, SLIDE_REPOSITORY } from '../domain/slide.repository';
import { SlideOutputDto } from './slide.dto';

@Injectable()
export class GetSlideByIdService {
  constructor(
    @Inject(SLIDE_REPOSITORY)
    private readonly slideRepository: ISlideRepository,
  ) {}

  async execute(id: string): Promise<SlideOutputDto> {
    const slide = await this.slideRepository.findById(id);
    if (!slide) {
      throw new NotFoundException(`Slide with ID ${id} not found`);
    }

    return {
      id: slide.id,
      activityId: slide.activityId,
      type: slide.type,
      name: slide.name,
      order: slide.order,
      content: slide.content,
      createdAt: slide.createdAt,
      updatedAt: slide.updatedAt,
    };
  }
}
