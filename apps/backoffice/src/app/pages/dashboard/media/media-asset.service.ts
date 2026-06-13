import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { MediaAsset, MediaAssetType, SaveAssetRequest } from './media-asset.model';

@Injectable({ providedIn: 'root' })
export class MediaAssetService {
  private readonly http = inject(HttpClient);

  getAll(tenantId: string, type?: MediaAssetType): Observable<MediaAsset[]> {
    const params = type ? `?type=${type}` : '';
    return this.http.get<MediaAsset[]>(
      `${environment.apiUrl}/tenants/${tenantId}/assets${params}`
    );
  }

  getUploadToken(tenantId: string, filename: string, contentType: string): Observable<{ url: string; clientToken: string }> {
    return this.http.post<{ url: string; clientToken: string }>(
      `${environment.apiUrl}/tenants/${tenantId}/assets/upload-token`,
      { filename, contentType }
    );
  }

  save(tenantId: string, body: SaveAssetRequest): Observable<MediaAsset> {
    return this.http.post<MediaAsset>(
      `${environment.apiUrl}/tenants/${tenantId}/assets`,
      body
    );
  }

  delete(tenantId: string, id: string): Observable<void> {
    return this.http.delete<void>(
      `${environment.apiUrl}/tenants/${tenantId}/assets/${id}`
    );
  }
}
