import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { AuthKeyEnum } from '~auths/a1-auth/enums/auth-key.enum';

import { OtpType } from '../enum/otp-type.enum';

export class SendOtpDto {
  @IsNotEmpty()
  @IsString()
  readonly authValue: string;

  @IsNotEmpty()
  @IsEnum(AuthKeyEnum)
  @IsString({ each: true })
  readonly authKey: string;

  @IsOptional()
  @IsEnum(OtpType)
  otpType: OtpType;
}
