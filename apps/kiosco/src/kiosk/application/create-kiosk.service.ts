import { Inject, Injectable } from '@nestjs/common';
import { createId } from '@paralleldrive/cuid2';
import { Kiosk } from '../domain/kiosk';
import { ApiKey, ApiKeyEnv } from '../domain/api-key.value-object';
import { KioskIdentifier } from '../domain/kiosk-identifier.value-object';
import { IKioskRepository, KIOSK_REPOSITORY } from '../domain/kiosk.repository';
import { CreateKioskInputDto, KioskOutputDto } from './kiosk.dto';

@Injectable()
export class CreateKioskService {
  private readonly env: ApiKeyEnv;

  constructor(
    @Inject(KIOSK_REPOSITORY)
    private readonly kioskRepository: IKioskRepository,
  ) {
    this.env = process.env.APP_ENV === "prod" ? "prod": "test" as ApiKeyEnv;
  }

  async execute(input: CreateKioskInputDto): Promise<KioskOutputDto> {
    const kiosk = Kiosk.create({
      id: createId(),
      tenantId: input.tenantId,
      name: input.name,
      identifier: KioskIdentifier.generate(input.name, createId().slice(0, 6)),
      apiKey: ApiKey.generate(this.env),
      location: input.location,
    });

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
