import { Module } from '@nestjs/common';
import { PrismaService } from '../../shared/infrastructure/prisma.service';
import { MEDIA_ASSET_REPOSITORY } from '../domain/media-asset.repository';
import { MediaAssetPrismaRepository } from './media-asset-prisma.repository';
import { GenerateUploadTokenService } from '../application/generate-upload-token.service';
import { SaveAssetService } from '../application/save-asset.service';
import { GetTenantAssetsService } from '../application/get-tenant-assets.service';
import { DeleteAssetService } from '../application/delete-asset.service';
import { MediaController } from '../../entrypoints/web/media/media.controller';

@Module({
  controllers: [MediaController],
  providers: [
    PrismaService,
    { provide: MEDIA_ASSET_REPOSITORY, useClass: MediaAssetPrismaRepository },
    GenerateUploadTokenService,
    SaveAssetService,
    GetTenantAssetsService,
    DeleteAssetService,
  ],
})
export class MediaModule {}
