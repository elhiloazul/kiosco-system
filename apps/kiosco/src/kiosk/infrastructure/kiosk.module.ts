import { Module } from '@nestjs/common';
import { KIOSK_REPOSITORY } from '../domain/kiosk.repository';
import { KioskPrismaRepository } from './kiosk-prisma.repository';
import { CreateKioskService } from '../application/create-kiosk.service';
import { GetKiosksByTenantService } from '../application/get-kiosks-by-tenant.service';
import { UpdateKioskService } from '../application/update-kiosk.service';
import { FindKioskByApiKeyService } from '../application/find-kiosk-by-api-key.service';
import { PrismaService } from '../../shared/infrastructure/prisma.service';
import { KioskController } from '../../entrypoints/web/kiosk/backoffice/kiosk.controller';

@Module({
  controllers: [KioskController],
  providers: [
    PrismaService,
    {
      provide: KIOSK_REPOSITORY,
      useClass: KioskPrismaRepository,
    },
    CreateKioskService,
    GetKiosksByTenantService,
    UpdateKioskService,
    FindKioskByApiKeyService,
  ],
  exports: [FindKioskByApiKeyService],
})
export class KioskModule {}
