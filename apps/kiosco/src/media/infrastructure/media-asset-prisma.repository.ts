import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../shared/infrastructure/prisma.service';
import { IMediaAssetRepository } from '../domain/media-asset.repository';
import { MediaAsset } from '../domain/media-asset.aggregate';

@Injectable()
export class MediaAssetPrismaRepository implements IMediaAssetRepository {
  constructor(private readonly prisma: PrismaService) {}

  async save(asset: MediaAsset): Promise<void> {
    await this.prisma.mediaAsset.create({
      data: {
        id: asset.id,
        tenantId: asset.tenantId,
        name: asset.name,
        url: asset.url,
        mimeType: asset.mimeType,
        size: asset.size,
        createdAt: asset.createdAt,
      },
    });
  }

  async findById(id: string): Promise<MediaAsset | null> {
    const row = await this.prisma.mediaAsset.findUnique({ where: { id } });
    if (!row) return null;
    return MediaAsset.reconstitute(row);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.mediaAsset.delete({ where: { id } });
  }

  async findAllByTenant(tenantId: string, mimeTypePrefix?: string): Promise<MediaAsset[]> {
    const rows = await this.prisma.mediaAsset.findMany({
      where: {
        tenantId,
        ...(mimeTypePrefix ? { mimeType: { startsWith: mimeTypePrefix } } : {}),
      },
      orderBy: { createdAt: 'desc' },
    });

    return rows.map((row) => MediaAsset.reconstitute(row));
  }
}
