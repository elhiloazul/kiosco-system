import { Tenant } from './tenant';

export interface ITenantRepository {
  save(tenant: Tenant): Promise<void>;
  findById(id: string): Promise<Tenant | null>;
  findAll(): Promise<Tenant[]>;
}

export const TENANT_REPOSITORY = Symbol('ITenantRepository');
