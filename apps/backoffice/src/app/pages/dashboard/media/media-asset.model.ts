export interface MediaAsset {
  id: string;
  tenantId: string;
  name: string;
  url: string;
  mimeType: string;
  size: number;
  createdAt: string;
}

export type MediaAssetType = 'image' | 'video' | 'document' | 'audio';

export interface SaveAssetRequest {
  name: string;
  url: string;
  mimeType: string;
  size: number;
}
