import { MediaAsset } from './media-asset.aggregate';

export const MEDIA_ASSET_REPOSITORY = Symbol('IMediaAssetRepository');

export interface IMediaAssetRepository {
  save(asset: MediaAsset): Promise<void>;
  findById(id: string): Promise<MediaAsset | null>;
  findAllByTenant(tenantId: string, mimeTypePrefix?: string): Promise<MediaAsset[]>;
  delete(id: string): Promise<void>;
}
