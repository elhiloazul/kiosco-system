import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Activity, CreateActivityRequest, UpdateActivityRequest } from './activity.model';

@Injectable({ providedIn: 'root' })
export class ActivityService {
  private readonly http = inject(HttpClient);
  private readonly base = environment.apiUrl;

  getByCampaign(campaignId: string): Observable<Activity[]> {
    return this.http.get<Activity[]>(`${this.base}/campaigns/${campaignId}/activities`);
  }

  create(campaignId: string, body: CreateActivityRequest): Observable<Activity> {
    return this.http.post<Activity>(`${this.base}/campaigns/${campaignId}/activities`, body);
  }

  update(id: string, body: UpdateActivityRequest): Observable<Activity> {
    return this.http.patch<Activity>(`${this.base}/activities/${id}`, body);
  }
}
