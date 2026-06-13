import { Inject, Injectable } from '@nestjs/common';
import { IMediaAssetRepository, MEDIA_ASSET_REPOSITORY } from '../domain/media-asset.repository';
import { GetTenantAssetsInputDto, MediaAssetOutputDto } from './media-asset.dto';

const MIME_PREFIXES: Record<string, string> = {
  image: 'image/',
  video: 'video/',
  document: 'application/',
};

@Injectable()
export class GetTenantAssetsService {
  constructor(
    @Inject(MEDIA_ASSET_REPOSITORY)
    private readonly repository: IMediaAssetRepository,
  ) {}

  async execute(input: GetTenantAssetsInputDto): Promise<MediaAssetOutputDto[]> {
    const mimeTypePrefix = input.type ? MIME_PREFIXES[input.type] : undefined;
    const assets = await this.repository.findAllByTenant(input.tenantId, mimeTypePrefix);

    return assets.map((a) => ({
      id: a.id,
      tenantId: a.tenantId,
      name: a.name,
      url: a.url,
      mimeType: a.mimeType,
      size: a.size,
      createdAt: a.createdAt,
    }));
  }
}
