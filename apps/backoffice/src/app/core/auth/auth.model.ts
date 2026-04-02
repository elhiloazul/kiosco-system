// ─── Request interfaces ───────────────────────────────────────────────────────

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface LogoutRequest {
  refreshToken: string;
}

// ─── Response / Domain models ─────────────────────────────────────────────────

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AdminProfile {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}
