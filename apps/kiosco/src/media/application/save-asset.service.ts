import { Inject, Injectable } from '@nestjs/common';
import { createId } from '@paralleldrive/cuid2';
import { IMediaAssetRepository, MEDIA_ASSET_REPOSITORY } from '../domain/media-asset.repository';
import { MediaAsset } from '../domain/media-asset.aggregate';
import { SaveAssetInputDto, MediaAssetOutputDto } from './media-asset.dto';

@Injectable()
export class SaveAssetService {
  constructor(
    @Inject(MEDIA_ASSET_REPOSITORY)
    private readonly repository: IMediaAssetRepository,
  ) {}

  async execute(input: SaveAssetInputDto): Promise<MediaAssetOutputDto> {
    const asset = MediaAsset.create({
      id: createId(),
      tenantId: input.tenantId,
      name: input.name,
      url: input.url,
      mimeType: input.mimeType,
      size: input.size,
    });

    await this.repository.save(asset);

    return {
      id: asset.id,
      tenantId: asset.tenantId,
      name: asset.name,
      url: asset.url,
      mimeType: asset.mimeType,
      size: asset.size,
      createdAt: asset.createdAt,
    };
  }
}
