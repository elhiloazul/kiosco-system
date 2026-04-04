import { Injectable } from '@nestjs/common';
import { Prisma } from '@kiosco/database';
import { PrismaService } from '../../shared/infrastructure/prisma.service';
import { Slide } from '../domain/slide';
import { ISlideRepository } from '../domain/slide.repository';
import { SlideType } from '@kiosco/shared-kernel';

@Injectable()
export class SlidePrismaRepository implements ISlideRepository {
  constructor(private readonly prisma: PrismaService) {}

  async save(slide: Slide): Promise<void> {
    await this.prisma.slide.upsert({
      where: { id: slide.id },
      create: {
        id: slide.id,
        activityId: slide.activityId,
        type: slide.type,
        name: slide.name,
        order: slide.order,
        content: slide.content as Prisma.InputJsonValue,
        createdAt: slide.createdAt,
        updatedAt: slide.updatedAt,
      },
      update: {
        type: slide.type,
        name: slide.name,
        order: slide.order,
        content: slide.content as Prisma.InputJsonValue,
        updatedAt: slide.updatedAt,
      },
    });
  }

  async findById(id: string): Promise<Slide | null> {
    const row = await this.prisma.slide.findUnique({ where: { id } });
    if (!row) return null;
    return Slide.reconstitute({
      ...row,
      type: row.type as SlideType,
      content: row.content as Record<string, unknown>,
    });
  }

  async findByActivityId(activityId: string): Promise<Slide[]> {
    const rows = await this.prisma.slide.findMany({
      where: { activityId },
      orderBy: { order: 'asc' },
    });
    return rows.map((row) =>
      Slide.reconstitute({
        ...row,
        type: row.type as SlideType,
        content: row.content as Record<string, unknown>,
      }),
    );
  }
}
