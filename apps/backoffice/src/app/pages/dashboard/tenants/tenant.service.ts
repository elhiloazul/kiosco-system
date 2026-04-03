import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Tenant, CreateTenantRequest } from './tenant.model';

@Injectable({ providedIn: 'root' })
export class TenantService {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiUrl}/tenants`;

  getAll(): Observable<Tenant[]> {
    return this.http.get<Tenant[]>(this.base);
  }

  create(body: CreateTenantRequest): Observable<Tenant> {
    return this.http.post<Tenant>(this.base, body);
  }
}
