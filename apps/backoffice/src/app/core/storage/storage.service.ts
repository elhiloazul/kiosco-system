import { Injectable, inject } from '@angular/core';
import { Observable, from, switchMap, lastValueFrom } from 'rxjs';
import { upload } from '@vercel/blob/client';
import { environment } from '../../../environments/environment';
import { AuthService } from '../auth/auth.service';
import { MediaAssetService } from '../../pages/dashboard/media/media-asset.service';
import { MediaAsset } from '../../pages/dashboard/media/media-asset.model';

export interface UploadResult {
  asset: MediaAsset;
}

@Injectable({ providedIn: 'root' })
export class StorageService {
  private readonly authService = inject(AuthService);
  private readonly mediaAssetService = inject(MediaAssetService);

  upload(
    tenantId: string,
    file: File,
    onProgress?: (pct: number) => void,
  ): Observable<UploadResult> {
    if (!environment.production) {
      return this.uploadLocal(tenantId, file);
    }
    return this.uploadVercel(tenantId, file, onProgress);
  }

  private uploadLocal(tenantId: string, file: File): Observable<UploadResult> {
    const objectUrl = URL.createObjectURL(file);
    return this.mediaAssetService.save(tenantId, {
      name: file.name,
      url: objectUrl,
      mimeType: file.type,
      size: file.size,
    }).pipe(switchMap((asset) => [{ asset }]));
  }

  private uploadVercel(
    tenantId: string,
    file: File,
    onProgress?: (pct: number) => void,
  ): Observable<UploadResult> {
    const promise = upload(file.name, file, {
      access: 'public',
      handleUploadUrl: `${environment.apiUrl}/tenants/${tenantId}/assets/upload-token`,
      headers: { Authorization: `Bearer ${this.authService.accessToken()}` },
      onUploadProgress: ({ percentage }) => onProgress?.(Math.round(percentage)),
    }).then((blob) =>
      lastValueFrom(this.mediaAssetService.save(tenantId, {
        name: file.name,
        url: blob.url,
        mimeType: file.type,
        size: file.size,
      })).then((asset) => ({ asset }))
    );

    return from(promise);
  }
}
