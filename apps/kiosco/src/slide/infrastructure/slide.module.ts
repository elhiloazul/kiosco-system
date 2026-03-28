import { Module } from '@nestjs/common';
import { SLIDE_REPOSITORY } from '../domain/slide.repository';
import { SlidePrismaRepository } from './slide-prisma.repository';
import { CreateSlideService } from '../application/create-slide.service';
import { GetSlidesByActivityService } from '../application/get-slides-by-activity.service';
import { GetSlideByIdService } from '../application/get-slide-by-id.service';
import { UpdateSlideService } from '../application/update-slide.service';
import { PrismaService } from '../../infrastructure/prisma.service';
import { SlideController } from '../../entrypoints/web/slide/slide.controller';

@Module({
  controllers: [SlideController],
  providers: [
    PrismaService,
    {
      provide: SLIDE_REPOSITORY,
      useClass: SlidePrismaRepository,
    },
    CreateSlideService,
    GetSlidesByActivityService,
    GetSlideByIdService,
    UpdateSlideService,
  ],
})
export class SlideModule {}
