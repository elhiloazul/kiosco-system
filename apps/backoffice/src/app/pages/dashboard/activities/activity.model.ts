// ─── Shared ───────────────────────────────────────────────────────────────────

export interface MenuConfig {
  audio?: string;
  popoverDescription?: string;
}

// ─── Request interfaces ───────────────────────────────────────────────────────

export interface CreateActivityRequest {
  name: string;
}

export interface UpdateActivityRequest {
  name?: string;
  isActive?: boolean;
  showInMenu?: boolean;
  menuOrder?: number | null;
  menuConfig?: MenuConfig | null;
}

// ─── Domain models ────────────────────────────────────────────────────────────

export interface Activity {
  id: string;
  campaignId: string;
  name: string;
  order: number;
  isActive: boolean;
  showInMenu: boolean;
  menuOrder: number | null;
  menuConfig: MenuConfig | null;
  createdAt: string;
  updatedAt: string;
}
