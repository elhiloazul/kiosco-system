import { Inject, Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { del } from '@vercel/blob';
import { IMediaAssetRepository, MEDIA_ASSET_REPOSITORY } from '../domain/media-asset.repository';

@Injectable()
export class DeleteAssetService {
  constructor(
    @Inject(MEDIA_ASSET_REPOSITORY)
    private readonly repository: IMediaAssetRepository,
  ) {}

  async execute(id: string, tenantId: string): Promise<void> {
    const asset = await this.repository.findById(id);
    if (!asset) throw new NotFoundException('Asset not found');
    if (asset.tenantId !== tenantId) throw new ForbiddenException();

    if (asset.url.includes('vercel-storage.com') || asset.url.includes('vercel.com/api/blob')) {
      await del(asset.url);
    }

    await this.repository.delete(id);
  }
}
