import { Controller, Get, Post, Body, UsePipes } from '@nestjs/common';
import { CreateTenantRequest } from '@kiosco/shared-kernel';
import { CreateTenantService } from '../../../tenant/application/create-tenant.service';
import { GetAllTenantsService } from '../../../tenant/application/get-all-tenants.service';

@Controller('tenants')
export class TenantController {
  constructor(
    private readonly createTenant: CreateTenantService,
    private readonly getAllTenants: GetAllTenantsService,
  ) {}

  @Post()
  create(@Body() body: CreateTenantRequest) {
    return this.createTenant.execute(body);
  }

  @Get()
  findAll() {
    return this.getAllTenants.execute();
  }
}
