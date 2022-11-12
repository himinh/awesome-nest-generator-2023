import { ATStrategy } from './strategies/at.strategy';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { Global, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TokenService } from './token.service';
import { OtpModule } from '~auths/a2-otp/otp.module';
import { UserModule } from '~common/c1-users/user.module';

@Global()
@Module({
  imports: [UserModule, OtpModule, JwtModule],
  providers: [AuthService, TokenService, ATStrategy],
  controllers: [AuthController],
  exports: [AuthService, TokenService],
})
export class AuthModule {}
