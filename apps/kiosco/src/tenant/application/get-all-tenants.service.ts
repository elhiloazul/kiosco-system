import { Inject, Injectable } from '@nestjs/common';
import { ITenantRepository, TENANT_REPOSITORY } from '../domain/tenant.repository';
import { TenantOutputDto } from './tenant.dto';

@Injectable()
export class GetAllTenantsService {
  constructor(
    @Inject(TENANT_REPOSITORY)
    private readonly tenantRepository: ITenantRepository,
  ) {}

  async execute(): Promise<TenantOutputDto[]> {
    const tenants = await this.tenantRepository.findAll();

    return tenants.map((tenant) => ({
      id: tenant.id,
      name: tenant.name,
      logoUrl: tenant.logoUrl,
      isActive: tenant.isActive,
      createdAt: tenant.createdAt,
      updatedAt: tenant.updatedAt,
    }));
  }
}
