import { Controller, Get, Param } from '@nestjs/common';
import { GetSessionsService } from '@user-session/application/get-sessions.service';

@Controller('kiosks/:kioskId/sessions')
export class BackofficeUserSessionController {
  constructor(private readonly getSessions: GetSessionsService) {}

  @Get()
  findByKiosk(@Param('kioskId') kioskId: string) {
    return this.getSessions.execute(kioskId);
  }
}
