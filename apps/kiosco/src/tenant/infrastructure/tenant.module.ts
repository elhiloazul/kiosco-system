import { Module } from '@nestjs/common';
import { TENANT_REPOSITORY } from '../domain/tenant.repository';
import { TenantPrismaRepository } from './tenant-prisma.repository';
import { CreateTenantService } from '../application/create-tenant.service';
import { GetAllTenantsService } from '../application/get-all-tenants.service';
import { PrismaService } from '../../shared/infrastructure/prisma.service';
import { TenantController } from '../../entrypoints/web/tenant/tenant.controller';

@Module({
  controllers: [TenantController],
  providers: [
    PrismaService,
    {
      provide: TENANT_REPOSITORY,
      useClass: TenantPrismaRepository,
    },
    CreateTenantService,
    GetAllTenantsService,
  ],
})
export class TenantModule {}
