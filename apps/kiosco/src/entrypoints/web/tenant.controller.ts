import { Controller, Get, Post, Body, UsePipes } from '@nestjs/common';
import { CreateTenantRequest } from '@kiosco/shared-kernel';
import { ZodValidationPipe } from './zod-validation.pipe';
import { CreateTenantService } from '../../tenant/application/create-tenant.service';
import { GetAllTenantsService } from '../../tenant/application/get-all-tenants.service';

@Controller('tenants')
export class TenantController {
  constructor(
    private readonly createTenant: CreateTenantService,
    private readonly getAllTenants: GetAllTenantsService,
  ) {}

  @Post()
  // TODO: Se puede usar ZodValidationPipe globalmente en todos los controllers 
  @UsePipes(new ZodValidationPipe(CreateTenantRequest)) 
  create(@Body() body: CreateTenantRequest) {
    return this.createTenant.execute(body);
  }

  @Get()
  findAll() {
    return this.getAllTenants.execute();
  }
}
