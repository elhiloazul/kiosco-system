import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ISlideRepository, SLIDE_REPOSITORY } from '../domain/slide.repository';

@Injectable()
export class DeleteSlideService {
  constructor(
    @Inject(SLIDE_REPOSITORY)
    private readonly slideRepository: ISlideRepository,
  ) {}

  async execute(id: string): Promise<void> {
    const slide = await this.slideRepository.findById(id);
    if (!slide) {
      throw new NotFoundException(`Slide with ID ${id} not found`);
    }
    await this.slideRepository.delete(id);
  }
}
