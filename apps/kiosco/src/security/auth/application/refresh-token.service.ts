import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { IAdminRepository, ADMIN_REPOSITORY } from '../domain/admin.repository';
import { IRefreshTokenRepository, REFRESH_TOKEN_REPOSITORY } from '../domain/refresh-token.repository';
import { RefreshTokenInputDto, TokensOutputDto } from './auth.dto';

@Injectable()
export class RefreshTokenService {
  constructor(
    @Inject(ADMIN_REPOSITORY)
    private readonly adminRepository: IAdminRepository,
    @Inject(REFRESH_TOKEN_REPOSITORY)
    private readonly refreshTokenRepository: IRefreshTokenRepository,
    private readonly jwtService: JwtService,
  ) {}

  async execute(input: RefreshTokenInputDto): Promise<TokensOutputDto> {
    const record = await this.refreshTokenRepository.findByToken(input.refreshToken);
    if (!record) {
      throw new UnauthorizedException('Invalid token');
    }

    if (record.expiresAt < new Date()) {
      await this.refreshTokenRepository.deleteByToken(input.refreshToken);
      throw new UnauthorizedException('Refresh token expired');
    }

    const admin = await this.adminRepository.findById(record.adminId);
    if (!admin) {
      throw new UnauthorizedException('Unauthorized access');
    }

    const accessToken = this.jwtService.sign({ sub: admin.id, email: admin.email.toString() });

    return { accessToken, refreshToken: input.refreshToken };
  }
}