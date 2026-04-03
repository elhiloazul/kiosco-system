import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, tap } from 'rxjs';
import { map } from 'rxjs/operators';
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

  findById(id: string): Observable<Tenant | null> {
    if (this.cache.has(id)) {
      return of(this.cache.get(id)!);
    }
    return this.getAll().pipe(
      map((tenants) => tenants.find((t) => t.id === id) ?? null)
    );
  }

  create(body: CreateTenantRequest): Observable<Tenant> {
    return this.http.post<Tenant>(this.base, body).pipe(
      tap((tenant) => this.cache.set(tenant.id, tenant))
    );
  }
}
