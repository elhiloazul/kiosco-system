import { Controller, Get, Post, Patch, Body, Param } from '@nestjs/common';
import { CreateKioskService } from '../../../kiosk/application/create-kiosk.service';
import { GetKiosksByTenantService } from '../../../kiosk/application/get-kiosks-by-tenant.service';
import { UpdateKioskService } from '../../../kiosk/application/update-kiosk.service';
import { CreateKioskInputDto, UpdateKioskInputDto } from '../../../kiosk/application/kiosk.dto';

@Controller()
export class KioskController {
  constructor(
    private readonly createKiosk: CreateKioskService,
    private readonly getKiosksByTenant: GetKiosksByTenantService,
    private readonly updateKiosk: UpdateKioskService,
  ) {}

  @Post('tenants/:tenantId/kiosks')
  create(@Param('tenantId') tenantId: string, @Body() body: unknown) {
    const input = CreateKioskInputDto.parse({ tenantId, ...(body as object) });
    return this.createKiosk.execute(input);
  }

  @Get('tenants/:tenantId/kiosks')
  findByTenant(@Param('tenantId') tenantId: string) {
    return this.getKiosksByTenant.execute(tenantId);
  }

  @Patch('kiosks/:id')
  update(@Param('id') id: string, @Body() body: unknown) {
    const input = UpdateKioskInputDto.parse({ id, ...(body as object) });
    return this.updateKiosk.execute(input);
  }
}
