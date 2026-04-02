import { Inject, Injectable } from '@nestjs/common';
import { IRefreshTokenRepository, REFRESH_TOKEN_REPOSITORY } from '../domain/refresh-token.repository';
import { LogoutInputDto } from './auth.dto';

@Injectable()
export class LogoutService {
  constructor(
    @Inject(REFRESH_TOKEN_REPOSITORY)
    private readonly refreshTokenRepository: IRefreshTokenRepository,
  ) {}

  async execute(input: LogoutInputDto): Promise<void> {
    await this.refreshTokenRepository.deleteByToken(input.refreshToken);
  }
}
