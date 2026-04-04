import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Kiosk, CreateKioskRequest, UpdateKioskRequest } from './kiosk.model';

@Injectable({ providedIn: 'root' })
export class KioskService {
  private readonly http = inject(HttpClient);
  private readonly base = environment.apiUrl;

  getByTenant(tenantId: string): Observable<Kiosk[]> {
    return this.http.get<Kiosk[]>(`${this.base}/tenants/${tenantId}/kiosks`);
  }

  create(tenantId: string, body: CreateKioskRequest): Observable<Kiosk> {
    return this.http.post<Kiosk>(`${this.base}/tenants/${tenantId}/kiosks`, body);
  }

  update(id: string, body: UpdateKioskRequest): Observable<Kiosk> {
    return this.http.patch<Kiosk>(`${this.base}/kiosks/${id}`, body);
  }
}
