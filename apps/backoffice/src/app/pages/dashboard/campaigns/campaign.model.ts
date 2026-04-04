// ─── Request interfaces ───────────────────────────────────────────────────────

export interface CreateCampaignRequest {
  name: string;
  description?: string;
  startsAt?: string;
  endsAt?: string;
}

export interface UpdateCampaignRequest {
  name?: string;
  description?: string | null;
  isActive?: boolean;
  startsAt?: string | null;
  endsAt?: string | null;
}

// ─── Domain models ────────────────────────────────────────────────────────────

export interface Campaign {
  id: string;
  tenantId: string;
  name: string;
  description: string | null;
  isActive: boolean;
  startsAt: string | null;
  endsAt: string | null;
  createdAt: string;
  updatedAt: string;
}
