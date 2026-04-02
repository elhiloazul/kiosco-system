import { Admin } from './admin.aggregate';

export interface IAdminRepository {
  save(admin: Admin): Promise<void>;
  findByEmail(email: string): Promise<Admin | null>;
  findById(id: string): Promise<Admin | null>;
}

export const ADMIN_REPOSITORY = Symbol('IAdminRepository');
