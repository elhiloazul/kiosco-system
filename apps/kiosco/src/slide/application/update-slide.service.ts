import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ISlideRepository, SLIDE_REPOSITORY } from '../domain/slide.repository';
import { UpdateSlideInputDto, SlideOutputDto } from './slide.dto';

@Injectable()
export class UpdateSlideService {
  constructor(
    @Inject(SLIDE_REPOSITORY)
    private readonly slideRepository: ISlideRepository,
  ) {}

  async execute(input: UpdateSlideInputDto): Promise<SlideOutputDto> {
    const slide = await this.slideRepository.findById(input.id);
    if (!slide) {
      throw new NotFoundException(`Slide with ID ${input.id} not found`);
    }

    slide.update(input);
    await this.slideRepository.save(slide);

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
