import { Inject, Injectable } from '@nestjs/common';
import { UserSession } from '../domain/user-session';
import { IUserSessionRepository, USER_SESSION_REPOSITORY } from '../domain/user-session.repository';
import { UpsertSessionInputDto, SessionOutputDto } from './user-session.dto';

@Injectable()
export class UpsertSessionService {
  constructor(
    @Inject(USER_SESSION_REPOSITORY)
    private readonly repository: IUserSessionRepository,
  ) {}

  async execute(kioskId: string, input: UpsertSessionInputDto): Promise<SessionOutputDto> {
    const session = UserSession.create({
      id: input.id,
      kioskId,
      name: input.name,
      age: input.age,
      neighborhood: input.neighborhood,
      activities: input.activities,
      startedAt: new Date(input.startedAt),
      endedAt: input.endedAt ? new Date(input.endedAt) : undefined,
    });

    await this.repository.upsert(session);

    return {
      id: session.id,
      kioskId: session.kioskId,
      name: session.name,
      age: session.age,
      neighborhood: session.neighborhood,
      activities: session.activities,
      startedAt: session.startedAt,
      endedAt: session.endedAt,
      createdAt: session.createdAt,
    };
  }
}
