import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Campaign, CreateCampaignRequest, UpdateCampaignRequest } from './campaign.model';

@Injectable({ providedIn: 'root' })
export class CampaignService {
  private readonly http = inject(HttpClient);
  private readonly base = environment.apiUrl;

  getByTenant(tenantId: string): Observable<Campaign[]> {
    return this.http.get<Campaign[]>(`${this.base}/tenants/${tenantId}/campaigns`);
  }

  create(tenantId: string, body: CreateCampaignRequest): Observable<Campaign> {
    return this.http.post<Campaign>(`${this.base}/tenants/${tenantId}/campaigns`, body);
  }

  update(id: string, body: UpdateCampaignRequest): Observable<Campaign> {
    return this.http.patch<Campaign>(`${this.base}/campaigns/${id}`, body);
  }
}
