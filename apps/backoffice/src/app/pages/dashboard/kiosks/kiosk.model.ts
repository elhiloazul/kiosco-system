export interface CreateKioskRequest {
  name: string;
  location?: string;
}

export interface UpdateKioskRequest {
  name?: string;
  location?: string | null;
  campaignId?: string | null;
  isActive?: boolean;
}

export interface Kiosk {
  id: string;
  tenantId: string;
  name: string;
  identifier: string;
  apiKey: string;
  location: string | null;
  campaignId: string | null;
  isActive: boolean;
  lastSeenAt: string | null;
  createdAt: string;
  updatedAt: string;
}
