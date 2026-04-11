import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { UserSession } from './session.model';

@Injectable({ providedIn: 'root' })
export class SessionService {
  private readonly http = inject(HttpClient);
  private readonly base = environment.apiUrl;

  getByKiosk(kioskId: string): Observable<UserSession[]> {
    return this.http.get<UserSession[]>(`${this.base}/kiosks/${kioskId}/sessions`);
  }
}
