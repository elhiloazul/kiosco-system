import { Inject, Injectable } from '@nestjs/common';
import { createId } from '@paralleldrive/cuid2';
import { Slide } from '../domain/slide';
import { ISlideRepository, SLIDE_REPOSITORY } from '../domain/slide.repository';
import { CreateSlideInputDto, SlideOutputDto } from './slide.dto';

@Injectable()
export class CreateSlideService {
  constructor(
    @Inject(SLIDE_REPOSITORY)
    private readonly slideRepository: ISlideRepository,
  ) {}

  async execute(input: CreateSlideInputDto): Promise<SlideOutputDto> {
    const slide = Slide.create({
      id: createId(),
      activityId: input.activityId,
      type: input.type,
      order: input.order,
      content: input.content,
    });

    await this.slideRepository.save(slide);

    return {
      id: slide.id,
      activityId: slide.activityId,
      type: slide.type,
      order: slide.order,
      content: slide.content,
      createdAt: slide.createdAt,
      updatedAt: slide.updatedAt,
    };
  }
}
