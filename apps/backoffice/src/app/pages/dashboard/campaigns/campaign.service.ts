import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, tap } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { Campaign, CreateCampaignRequest, UpdateCampaignRequest } from './campaign.model';

@Injectable({ providedIn: 'root' })
export class CampaignService {
  private readonly http = inject(HttpClient);
  private readonly base = environment.apiUrl;
  private readonly cache = new Map<string, Campaign>();

  getByTenant(tenantId: string): Observable<Campaign[]> {
    return this.http.get<Campaign[]>(`${this.base}/tenants/${tenantId}/campaigns`).pipe(
      tap((campaigns) => campaigns.forEach((c) => this.cache.set(c.id, c)))
    );
  }

  findById(id: string, tenantId: string): Observable<Campaign | null> {
    if (this.cache.has(id)) return of(this.cache.get(id)!);
    return this.getByTenant(tenantId).pipe(
      map((campaigns) => campaigns.find((c) => c.id === id) ?? null)
    );
  }

  create(tenantId: string, body: CreateCampaignRequest): Observable<Campaign> {
    return this.http.post<Campaign>(`${this.base}/tenants/${tenantId}/campaigns`, body).pipe(
      tap((campaign) => this.cache.set(campaign.id, campaign))
    );
  }

  update(id: string, body: UpdateCampaignRequest): Observable<Campaign> {
    return this.http.patch<Campaign>(`${this.base}/campaigns/${id}`, body).pipe(
      tap((campaign) => this.cache.set(campaign.id, campaign))
    );
  }
}
