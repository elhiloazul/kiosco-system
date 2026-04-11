import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../shared/infrastructure/prisma.service';
import { IUserSessionRepository } from '../domain/user-session.repository';
import { UserSession, ActivityProgress } from '../domain/user-session';

@Injectable()
export class UserSessionPrismaRepository implements IUserSessionRepository {
  constructor(private readonly prisma: PrismaService) {}

  async upsert(session: UserSession): Promise<void> {
    await this.prisma.userSession.upsert({
      where: { id: session.id },
      create: {
        id: session.id,
        kioskId: session.kioskId,
        name: session.name,
        age: session.age,
        neighborhood: session.neighborhood,
        activities: session.activities,
        startedAt: session.startedAt,
        endedAt: session.endedAt ?? undefined,
        createdAt: session.createdAt,
      },
      update: {
        name: session.name,
        age: session.age,
        neighborhood: session.neighborhood,
        activities: session.activities,
        endedAt: session.endedAt ?? undefined,
      },
    });
  }

  async findByKioskId(kioskId: string, limit = 100): Promise<UserSession[]> {
    const rows = await this.prisma.userSession.findMany({
      where: { kioskId },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });

    return rows.map((row) =>
      UserSession.reconstitute({
        id: row.id,
        kioskId: row.kioskId,
        name: row.name,
        age: row.age,
        neighborhood: row.neighborhood,
        activities: row.activities as Record<string, ActivityProgress>,
        startedAt: row.startedAt,
        endedAt: row.endedAt,
        createdAt: row.createdAt,
      }),
    );
  }
}
