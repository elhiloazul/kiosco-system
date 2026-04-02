import { Controller, Post, Get, Patch, Body } from '@nestjs/common';
import { Public } from '../../../security/guards/public.decorator';
import { CurrentAdmin, JwtPayload } from '../../../security/guards/current-admin.decorator';
import { LoginService } from '../../../security/auth/application/login.service';
import { RefreshTokenService } from '../../../security/auth/application/refresh-token.service';
import { LogoutService } from '../../../security/auth/application/logout.service';
import { GetMeService } from '../../../security/auth/application/get-me.service';
import { UpdateProfileService } from '../../../security/auth/application/update-profile.service';
import {
  LoginInputDto,
  RefreshTokenInputDto,
  LogoutInputDto,
  UpdateProfileInputDto,
} from '../../../security/auth/application/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly loginService: LoginService,
    private readonly refreshTokenService: RefreshTokenService,
    private readonly logoutService: LogoutService,
    private readonly getMeService: GetMeService,
    private readonly updateProfileService: UpdateProfileService,
  ) {}

  @Public()
  @Post('login')
  login(@Body() body: unknown) {
    const input = LoginInputDto.parse(body);
    return this.loginService.execute(input);
  }

  @Public()
  @Post('refresh')
  refresh(@Body() body: unknown) {
    const input = RefreshTokenInputDto.parse(body);
    return this.refreshTokenService.execute(input);
  }

  @Post('logout')
  logout(@Body() body: unknown) {
    const input = LogoutInputDto.parse(body);
    return this.logoutService.execute(input);
  }

  @Get('me')
  getMe(@CurrentAdmin() admin: JwtPayload) {
    return this.getMeService.execute(admin.sub);
  }

  @Patch('profile')
  updateProfile(@CurrentAdmin() admin: JwtPayload, @Body() body: unknown) {
    const input = UpdateProfileInputDto.parse(body);
    return this.updateProfileService.execute(admin.sub, input);
  }
}
