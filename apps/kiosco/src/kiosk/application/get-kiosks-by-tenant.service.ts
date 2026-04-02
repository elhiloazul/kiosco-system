import { Inject, Injectable } from '@nestjs/common';
import { IKioskRepository, KIOSK_REPOSITORY } from '../domain/kiosk.repository';
import { KioskOutputDto } from './kiosk.dto';

@Injectable()
export class GetKiosksByTenantService {
  constructor(
    @Inject(KIOSK_REPOSITORY)
    private readonly kioskRepository: IKioskRepository,
  ) {}

  async execute(tenantId: string): Promise<KioskOutputDto[]> {
    const kiosks = await this.kioskRepository.findByTenantId(tenantId);

    return kiosks.map((kiosk) => ({
      id: kiosk.id,
      tenantId: kiosk.tenantId,
      name: kiosk.name,
      identifier: kiosk.identifier.toString(),
      apiKey: kiosk.apiKey.toString(),
      location: kiosk.location,
      campaignId: kiosk.campaignId,
      isActive: kiosk.isActive,
      lastSeenAt: kiosk.lastSeenAt,
      createdAt: kiosk.createdAt,
      updatedAt: kiosk.updatedAt,
    }));
  }
}
