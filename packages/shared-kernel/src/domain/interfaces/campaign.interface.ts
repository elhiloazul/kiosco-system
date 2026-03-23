export interface ICampaign {
  id: string;
  tenantId: string;
  name: string;
  description: string | null;
  isActive: boolean;
  startsAt: Date | null;
  endsAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}
