// ─── Request interfaces ───────────────────────────────────────────────────────

export interface CreateTenantRequest {
  name: string;
  logoUrl?: string;
}

// ─── Domain models ────────────────────────────────────────────────────────────

export interface Tenant {
  id: string;
  name: string;
  logoUrl: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
