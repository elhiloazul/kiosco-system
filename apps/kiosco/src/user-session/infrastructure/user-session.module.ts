import { Module } from '@nestjs/common';
import { PrismaService } from '../../shared/infrastructure/prisma.service';
import { USER_SESSION_REPOSITORY } from '../domain/user-session.repository';
import { UserSessionPrismaRepository } from './user-session-prisma.repository';
import { UpsertSessionService } from '../application/upsert-session.service';
import { GetSessionsService } from '../application/get-sessions.service';
import { KioskUserSessionController } from '../../entrypoints/web/user-session/kiosk/user-session.controller';
import { BackofficeUserSessionController } from '../../entrypoints/web/user-session/backoffice/user-session.controller';

@Module({
  controllers: [BackofficeUserSessionController],
  providers: [
    PrismaService,
    {
      provide: USER_SESSION_REPOSITORY,
      useClass: UserSessionPrismaRepository,
    },
    UpsertSessionService,
    GetSessionsService,
  ],
  exports: [UpsertSessionService, GetSessionsService, USER_SESSION_REPOSITORY, PrismaService],
})
export class UserSessionModule {}
