import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ITenantRepository, TENANT_REPOSITORY } from '../domain/tenant.repository';
import { TenantOutputDto } from './tenant.dto';

@Injectable()
export class GetTenantByIdService {
  constructor(
    @Inject(TENANT_REPOSITORY)
    private readonly tenantRepository: ITenantRepository,
  ) {}

  async execute(id: string): Promise<TenantOutputDto> {
    const tenant = await this.tenantRepository.findById(id);
    if (!tenant) {
      throw new NotFoundException('Tenant no encontrado');
    }

    return {
      id: tenant.id,
      name: tenant.name,
      logoUrl: tenant.logoUrl,
      isActive: tenant.isActive,
      createdAt: tenant.createdAt,
      updatedAt: tenant.updatedAt,
    };
  }
}
