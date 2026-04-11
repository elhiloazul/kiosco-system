import { Inject, Injectable } from '@nestjs/common';
import { IUserSessionRepository, USER_SESSION_REPOSITORY } from '../domain/user-session.repository';
import { SessionOutputDto } from './user-session.dto';

@Injectable()
export class GetSessionsService {
  constructor(
    @Inject(USER_SESSION_REPOSITORY)
    private readonly repository: IUserSessionRepository,
  ) {}

  async execute(kioskId: string): Promise<SessionOutputDto[]> {
    const sessions = await this.repository.findByKioskId(kioskId);

    return sessions.map((s) => ({
      id: s.id,
      kioskId: s.kioskId,
      name: s.name,
      age: s.age,
      neighborhood: s.neighborhood,
      activities: s.activities,
      startedAt: s.startedAt,
      endedAt: s.endedAt,
      createdAt: s.createdAt,
    }));
  }
}
