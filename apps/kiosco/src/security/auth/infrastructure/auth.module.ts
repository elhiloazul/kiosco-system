import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ADMIN_REPOSITORY } from '../domain/admin.repository';
import { REFRESH_TOKEN_REPOSITORY } from '../domain/refresh-token.repository';
import { AdminPrismaRepository } from './admin-prisma.repository';
import { RefreshTokenPrismaRepository } from './refresh-token-prisma.repository';
import { LoginService } from '../application/login.service';
import { RefreshTokenService } from '../application/refresh-token.service';
import { LogoutService } from '../application/logout.service';
import { GetMeService } from '../application/get-me.service';
import { UpdateProfileService } from '../application/update-profile.service';
import { PrismaService } from '../../../shared/infrastructure/prisma.service';
import { AuthController } from '../../../entrypoints/web/auth/backoffice/auth.controller';
import type { StringValue } from 'ms';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET ?? 'change_me_in_production',
      signOptions: { expiresIn: (process.env.JWT_EXPIRES_IN ?? '15m') as StringValue },
    }),
  ],
  controllers: [AuthController],
  providers: [
    PrismaService,
    { provide: ADMIN_REPOSITORY, useClass: AdminPrismaRepository },
    { provide: REFRESH_TOKEN_REPOSITORY, useClass: RefreshTokenPrismaRepository },
    LoginService,
    RefreshTokenService,
    LogoutService,
    GetMeService,
    UpdateProfileService,
  ],
  exports: [JwtModule],
})
export class AuthModule {}
