import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { FindKioskByApiKeyService } from '@kiosk/application/find-kiosk-by-api-key.service';
import { KioskOutputDto } from '@kiosk/application/kiosk.dto';

export interface KioskPayload {
  id: string;
  tenantId: string;
  name: string;
}

@Injectable()
export class KioskApiKeyGuard implements CanActivate {
  constructor(private readonly findKioskByApiKey: FindKioskByApiKeyService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();

    if (!request.path.startsWith('/kiosk/')) return true;

    const apiKey = request.headers['x-api-key'];

    if (!apiKey || typeof apiKey !== 'string') {
      throw new UnauthorizedException('API Key requerida');
    }

    const kiosk: KioskOutputDto | null = await this.findKioskByApiKey.execute(apiKey);

    if (!kiosk || !kiosk.isActive) {
      throw new UnauthorizedException('API Key inválida');
    }

    (request as Request & { kiosk: KioskPayload }).kiosk = {
      id: kiosk.id,
      tenantId: kiosk.tenantId,
      name: kiosk.name,
    };

    return true;
  }
}
