import { UserSession } from './user-session';

export interface IUserSessionRepository {
  upsert(session: UserSession): Promise<void>;
  findByKioskId(kioskId: string, limit?: number): Promise<UserSession[]>;
}

export const USER_SESSION_REPOSITORY = Symbol('IUserSessionRepository');
