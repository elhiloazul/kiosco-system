import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, tap } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { Activity, CreateActivityRequest, UpdateActivityRequest } from './activity.model';

@Injectable({ providedIn: 'root' })
export class ActivityService {
  private readonly http = inject(HttpClient);
  private readonly base = environment.apiUrl;
  private readonly cache = new Map<string, Activity>();

  getByCampaign(campaignId: string): Observable<Activity[]> {
    return this.http.get<Activity[]>(`${this.base}/campaigns/${campaignId}/activities`).pipe(
      tap((activities) => activities.forEach((a) => this.cache.set(a.id, a)))
    );
  }

  findById(id: string, campaignId: string): Observable<Activity | null> {
    if (this.cache.has(id)) return of(this.cache.get(id)!);
    return this.getByCampaign(campaignId).pipe(
      map((activities) => activities.find((a) => a.id === id) ?? null)
    );
  }

  create(campaignId: string, body: CreateActivityRequest): Observable<Activity> {
    return this.http.post<Activity>(`${this.base}/campaigns/${campaignId}/activities`, body).pipe(
      tap((activity) => this.cache.set(activity.id, activity))
    );
  }

  update(id: string, body: UpdateActivityRequest): Observable<Activity> {
    return this.http.patch<Activity>(`${this.base}/activities/${id}`, body).pipe(
      tap((activity) => this.cache.set(activity.id, activity))
    );
  }
}
