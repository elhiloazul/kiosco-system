import { Module } from '@nestjs/common';
import { TenantModule } from './tenant/infrastructure/tenant.module';

@Module({
  imports: [TenantModule],
})
export class AppModule {}
