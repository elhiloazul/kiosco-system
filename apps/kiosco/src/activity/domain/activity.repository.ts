import { Activity } from './activity';

export interface IActivityRepository {
  save(activity: Activity): Promise<void>;
  findById(id: string): Promise<Activity | null>;
  findByCampaignId(campaignId: string): Promise<Activity[]>;
  findMenuByCampaignId(campaignId: string): Promise<Activity[]>;
}

export const ACTIVITY_REPOSITORY = Symbol('IActivityRepository');
