import { Controller, Patch, Body } from '@nestjs/common';
import { UpsertSessionService } from '@user-session/application/upsert-session.service';
import { UpsertSessionInputDto } from '@user-session/application/user-session.dto';
import { CurrentKiosk } from '@security/guards/current-kiosk.decorator';
import { KioskPayload } from '@security/guards/kiosk-api-key.guard';

@Controller('sessions')
export class KioskUserSessionController {
  constructor(private readonly upsertSession: UpsertSessionService) {}

  @Patch()
  upsert(@CurrentKiosk() kiosk: KioskPayload, @Body() body: unknown) {
    const input = UpsertSessionInputDto.parse(body);
    return this.upsertSession.execute(kiosk.id, input);
  }
}
