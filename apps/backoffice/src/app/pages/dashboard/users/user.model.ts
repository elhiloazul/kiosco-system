// ─── Request interfaces ───────────────────────────────────────────────────────

export interface CreateUserRequest {
  name: string;
  email: string;
  password: string;
}

export interface UpdateUserRequest {
  status?: 'ENABLED' | 'DISABLED';
}

// ─── Domain models ────────────────────────────────────────────────────────────

export interface User {
  id: string;
  name: string;
  email: string;
  status: 'ENABLED' | 'DISABLED';
  isPrincipal: boolean;
  createdAt: string;
  updatedAt: string;
}
