import { Module } from '@nestjs/common';
import { UserSessionModule } from './user-session.module';
import { KioskUserSessionController } from '../../entrypoints/web/user-session/kiosk/user-session.controller';

@Module({
  imports: [UserSessionModule],
  controllers: [KioskUserSessionController],
})
export class UserSessionKioskModule {}
