import { Controller, Post, Get, Delete, Param, Body, Query, HttpCode, HttpStatus } from '@nestjs/common';
import { SkipResponseWrapper } from '../response.interceptor';
import { GenerateUploadTokenService } from '../../../media/application/generate-upload-token.service';
import { SaveAssetService } from '../../../media/application/save-asset.service';
import { GetTenantAssetsService } from '../../../media/application/get-tenant-assets.service';
import { DeleteAssetService } from '../../../media/application/delete-asset.service';
import { SaveAssetInputDto, GetTenantAssetsInputDto } from '../../../media/application/media-asset.dto';

@Controller('tenants/:tenantId')
export class MediaController {
  constructor(
    private readonly generateUploadTokenService: GenerateUploadTokenService,
    private readonly saveAssetService: SaveAssetService,
    private readonly getTenantAssetsService: GetTenantAssetsService,
    private readonly deleteAssetService: DeleteAssetService,
  ) {}

  @SkipResponseWrapper()
  @Post('assets/upload-token')
  async generateUploadToken(
    @Param('tenantId') tenantId: string,
    @Body() body: unknown,
  ) {
    return this.generateUploadTokenService.execute(tenantId, body as any);
  }

  @Post('assets')
  async saveAsset(
    @Param('tenantId') tenantId: string,
    @Body() body: unknown,
  ) {
    const input = SaveAssetInputDto.parse({ tenantId, ...(body as object) });
    return this.saveAssetService.execute(input);
  }

  @Get('assets')
  async listAssets(
    @Param('tenantId') tenantId: string,
    @Query('type') type?: string,
  ) {
    const input = GetTenantAssetsInputDto.parse({ tenantId, type });
    return this.getTenantAssetsService.execute(input);
  }

  @Delete('assets/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteAsset(
    @Param('tenantId') tenantId: string,
    @Param('id') id: string,
  ) {
    await this.deleteAssetService.execute(id, tenantId);
  }
}
