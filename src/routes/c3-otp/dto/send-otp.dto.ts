import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { AuthKeyType } from '~routes/auth/enums/auth-key.enum';
import { OtpType } from '../enum/otp-type.enum';

export class SendOtpDto {
  @IsNotEmpty()
  @IsString()
  readonly authValue: string;

  @IsNotEmpty()
  @IsEnum(AuthKeyType)
  @IsString({ each: true })
  readonly authKey: string;

  @IsOptional()
  @IsEnum(OtpType)
  otpType: OtpType;
}
