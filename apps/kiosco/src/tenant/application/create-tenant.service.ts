import { Inject, Injectable } from '@nestjs/common';
import { createId } from '@paralleldrive/cuid2';
import { Tenant } from '../domain/tenant';
import { ITenantRepository, TENANT_REPOSITORY } from '../domain/tenant.repository';
import { CreateTenantInputDto, TenantOutputDto } from './tenant.dto';

@Injectable()
export class CreateTenantService {
  constructor(
    @Inject(TENANT_REPOSITORY)
    private readonly tenantRepository: ITenantRepository,
  ) {}

  async execute(input: CreateTenantInputDto): Promise<TenantOutputDto> {
    const parsed = CreateTenantInputDto.parse(input);

    const tenant = Tenant.create({
      id: createId(),
      name: parsed.name,
      logoUrl: parsed.logoUrl,
    });

    await this.tenantRepository.save(tenant);

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
