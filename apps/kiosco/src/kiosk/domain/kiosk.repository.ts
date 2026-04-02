import { Kiosk } from './kiosk';

export interface IKioskRepository {
  save(kiosk: Kiosk): Promise<void>;
  findById(id: string): Promise<Kiosk | null>;
  findByTenantId(tenantId: string): Promise<Kiosk[]>;
}

export const KIOSK_REPOSITORY = Symbol('IKioskRepository');
