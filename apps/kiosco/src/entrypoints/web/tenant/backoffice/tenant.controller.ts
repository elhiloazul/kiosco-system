import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { CreateTenantInputDto } from '@tenant/application/tenant.dto';
import { CreateTenantService } from '@tenant/application/create-tenant.service';
import { GetAllTenantsService } from '@tenant/application/get-all-tenants.service';
import { GetTenantByIdService } from '@tenant/application/get-tenant-by-id.service';

@Controller('tenants')
export class TenantController {
  constructor(
    private readonly createTenant: CreateTenantService,
    private readonly getAllTenants: GetAllTenantsService,
    private readonly getTenantById: GetTenantByIdService,
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

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.getTenantById.execute(id);
  }
}
