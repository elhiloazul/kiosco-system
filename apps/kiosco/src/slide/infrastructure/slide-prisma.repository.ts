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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const prismaSlide = this.prisma.slide as any;
    await prismaSlide.upsert({
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const row = await (this.prisma.slide as any).findUnique({ where: { id } });
    if (!row) return null;
    return Slide.reconstitute({
      id: row.id,
      activityId: row.activityId,
      type: row.type as SlideType,
      name: row.name ?? '',
      order: row.order,
      content: row.content as Record<string, unknown>,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    });
  }

  async findByActivityId(activityId: string): Promise<Slide[]> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const rows = await (this.prisma.slide as any).findMany({
      where: { activityId },
      orderBy: { order: 'asc' },
    });
    return rows.map((row: any) =>
      Slide.reconstitute({
        id: row.id,
        activityId: row.activityId,
        type: row.type as SlideType,
        name: row.name ?? '',
        order: row.order,
        content: row.content as Record<string, unknown>,
        createdAt: row.createdAt,
        updatedAt: row.updatedAt,
      }),
    );
  }
}
