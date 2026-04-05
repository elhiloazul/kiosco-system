import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { KioskPayload } from './kiosk-api-key.guard';

export const CurrentKiosk = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): KioskPayload => {
    const request = ctx.switchToHttp().getRequest();
    return request.kiosk as KioskPayload;
  },
);
