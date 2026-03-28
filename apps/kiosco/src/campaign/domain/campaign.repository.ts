import { Campaign } from './campaign';

export interface ICampaignRepository {
  save(campaign: Campaign): Promise<void>;
  findById(id: string): Promise<Campaign | null>;
  findByTenantId(tenantId: string): Promise<Campaign[]>;
}

export const CAMPAIGN_REPOSITORY = Symbol('ICampaignRepository');
