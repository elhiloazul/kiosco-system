import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap, switchMap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  LoginRequest,
  RefreshTokenRequest,
  LogoutRequest,
  UpdateProfileRequest,
  AuthTokens,
  AdminProfile,
} from './auth.model';

const ACCESS_TOKEN_KEY = 'access_token';
const REFRESH_TOKEN_KEY = 'refresh_token';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);

  private readonly _accessToken = signal<string | null>(
    localStorage.getItem(ACCESS_TOKEN_KEY)
  );
  private readonly _profile = signal<AdminProfile | null>(null);

  readonly isAuthenticated = computed(() => !!this._accessToken());
  readonly profile = this._profile.asReadonly();
  readonly accessToken = this._accessToken.asReadonly();

  login(credentials: LoginRequest): Observable<AuthTokens> {
    return this.http
      .post<AuthTokens>(`${environment.apiUrl}/auth/login`, credentials)
      .pipe(tap((tokens) => this.storeTokens(tokens)));
  }

  logout(): void {
    const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
    if (refreshToken) {
      const body: LogoutRequest = { refreshToken };
      this.http
        .post(`${environment.apiUrl}/auth/logout`, body)
        .subscribe({ error: () => {} });
    }
    this.clearSession();
    this.router.navigate(['/login']);
  }

  refreshTokens(): Observable<AuthTokens> {
    const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY) ?? '';
    const body: RefreshTokenRequest = { refreshToken };
    return this.http
      .post<AuthTokens>(`${environment.apiUrl}/auth/refresh`, body)
      .pipe(tap((tokens) => this.storeTokens(tokens)));
  }

  loadProfile(): Observable<AdminProfile> {
    return this.http
      .get<AdminProfile>(`${environment.apiUrl}/auth/me`)
      .pipe(tap((profile) => this._profile.set(profile)));
  }

  updateProfile(body: UpdateProfileRequest): Observable<AdminProfile> {
    return this.http
      .patch<AdminProfile>(`${environment.apiUrl}/auth/profile`, body)
      .pipe(tap((profile) => this._profile.set(profile)));
  }

  getRefreshToken(): string | null {
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  }

  private storeTokens(tokens: AuthTokens): void {
    localStorage.setItem(ACCESS_TOKEN_KEY, tokens.accessToken);
    localStorage.setItem(REFRESH_TOKEN_KEY, tokens.refreshToken);
    this._accessToken.set(tokens.accessToken);
  }

  private clearSession(): void {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    this._accessToken.set(null);
    this._profile.set(null);
  }
}
