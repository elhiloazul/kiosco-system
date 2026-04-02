import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { IKioskRepository, KIOSK_REPOSITORY } from '../domain/kiosk.repository';
import { UpdateKioskInputDto, KioskOutputDto } from './kiosk.dto';

@Injectable()
export class UpdateKioskService {
  constructor(
    @Inject(KIOSK_REPOSITORY)
    private readonly kioskRepository: IKioskRepository,
  ) {}

  async execute(input: UpdateKioskInputDto): Promise<KioskOutputDto> {
    const kiosk = await this.kioskRepository.findById(input.id);
    if (!kiosk) {
      throw new NotFoundException(`Kiosk with ID ${input.id} not found`);
    }

    kiosk.update(input);
    await this.kioskRepository.save(kiosk);

    return {
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
    };
  }
}
