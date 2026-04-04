// ─── Request interfaces ───────────────────────────────────────────────────────

export interface CreateActivityRequest {
  name: string;
}

export interface UpdateActivityRequest {
  name?: string;
  isActive?: boolean;
}

// ─── Domain models ────────────────────────────────────────────────────────────

export interface Activity {
  id: string;
  campaignId: string;
  name: string;
  order: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
