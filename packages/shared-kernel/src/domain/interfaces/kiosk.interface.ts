export interface IKiosk {
  id: string;
  tenantId: string;
  name: string;
  identifier: string;
  apiKey: string;
  location: string | null;
  campaignId: string | null;
  isActive: boolean;
  lastSeenAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}
