import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { createId } from '@paralleldrive/cuid2';
import { IAdminRepository, ADMIN_REPOSITORY } from '../domain/admin.repository';
import { IRefreshTokenRepository, REFRESH_TOKEN_REPOSITORY } from '../domain/refresh-token.repository';
import { LoginInputDto, TokensOutputDto } from './auth.dto';

@Injectable()
export class LoginService {
  constructor(
    @Inject(ADMIN_REPOSITORY)
    private readonly adminRepository: IAdminRepository,
    @Inject(REFRESH_TOKEN_REPOSITORY)
    private readonly refreshTokenRepository: IRefreshTokenRepository,
    private readonly jwtService: JwtService,
  ) {}

  async execute(input: LoginInputDto): Promise<TokensOutputDto> {
    const admin = await this.adminRepository.findByEmail(input.email);
    if (!admin) {
      throw new UnauthorizedException('Unauthorized access');
    }

    const passwordValid = await bcrypt.compare(input.password, admin.passwordHash);
    if (!passwordValid) {
      throw new UnauthorizedException('Unauthorized access');
    }

    const accessToken = this.jwtService.sign({ sub: admin.id, email: admin.email.toString() });

    await this.refreshTokenRepository.deleteExpiredByAdminId(admin.id);

    const refreshToken = createId();
    const expiresIn = process.env.JWT_REFRESH_EXPIRES_IN ?? '7d';
    const expiresAt = new Date(Date.now() + parseDuration(expiresIn));
    await this.refreshTokenRepository.save(refreshToken, admin.id, expiresAt);

    return { accessToken, refreshToken };
  }
}

function parseDuration(duration: string): number {
  const units: Record<string, number> = {
    s: 1000,
    m: 60 * 1000,
    h: 60 * 60 * 1000,
    d: 24 * 60 * 60 * 1000,
  };
  const match = duration.match(/^(\d+)([smhd])$/);
  if (!match) throw new Error(`Invalid duration format: ${duration}`);
  return parseInt(match[1]) * units[match[2]];
}