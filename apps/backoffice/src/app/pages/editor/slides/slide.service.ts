import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Slide, CreateSlideRequest, UpdateSlideRequest } from './slide.model';

@Injectable({ providedIn: 'root' })
export class SlideService {
  private readonly http = inject(HttpClient);
  private readonly base = environment.apiUrl;

  getByActivity(activityId: string): Observable<Slide[]> {
    return this.http.get<Slide[]>(`${this.base}/activities/${activityId}/slides`);
  }

  getById(id: string): Observable<Slide> {
    return this.http.get<Slide>(`${this.base}/slides/${id}`);
  }

  create(activityId: string, body: CreateSlideRequest): Observable<Slide> {
    return this.http.post<Slide>(`${this.base}/activities/${activityId}/slides`, body);
  }

  update(id: string, body: UpdateSlideRequest): Observable<Slide> {
    return this.http.patch<Slide>(`${this.base}/slides/${id}`, body);
  }
}
