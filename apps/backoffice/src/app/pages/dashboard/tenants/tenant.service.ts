import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Tenant, CreateTenantRequest } from './tenant.model';

@Injectable({ providedIn: 'root' })
export class TenantService {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiUrl}/tenants`;
  private readonly cache = new Map<string, Tenant>();

  getAll(): Observable<Tenant[]> {
    return this.http.get<Tenant[]>(this.base).pipe(
      tap((tenants) => tenants.forEach((t) => this.cache.set(t.id, t)))
    );
  }

  findById(id: string): Observable<Tenant> {
    return this.http.get<Tenant>(`${this.base}/${id}`).pipe(
      tap((tenant) => this.cache.set(tenant.id, tenant))
    );
  }

  create(body: CreateTenantRequest): Observable<Tenant> {
    return this.http.post<Tenant>(this.base, body).pipe(
      tap((tenant) => this.cache.set(tenant.id, tenant))
    );
  }
}
