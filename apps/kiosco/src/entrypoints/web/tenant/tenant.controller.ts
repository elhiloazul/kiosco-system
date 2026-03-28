import { Controller, Get, Post, Body } from '@nestjs/common';
import { CreateTenantInputDto } from '../../../tenant/application/tenant.dto';
import { CreateTenantService } from '../../../tenant/application/create-tenant.service';
import { GetAllTenantsService } from '../../../tenant/application/get-all-tenants.service';

@Controller('tenants')
export class TenantController {
  constructor(
    private readonly createTenant: CreateTenantService,
    private readonly getAllTenants: GetAllTenantsService,
  ) {}

  @Post()
  create(@Body() body: unknown) {
    const input = CreateTenantInputDto.parse(body);
    return this.createTenant.execute(input);
  }

  @Get()
  findAll() {
    return this.getAllTenants.execute();
  }
}
