import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
  MinLength,
  ValidateIf,
} from 'class-validator';

import { AccountType } from '../enums/account-type.enum';
import { Gender } from '../enums/gender.enum';
import { Role } from '../enums/role.enum';

export class CreateUserDto {
  @ValidateIf((o) => !(o.phone || o.socialToken))
  @IsEmail()
  email: string;

  @ValidateIf((o) => !(o.email || o.socialToken))
  @IsString()
  phone: string;

  @ValidateIf((o) => !(o.email || o.phone))
  @IsString()
  socialToken: string;

  @ValidateIf((o) => o.email || o.phone)
  @IsString()
  @Min(6)
  @Max(50)
  password: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(2)
  fullName: string;

  @IsOptional()
  @IsString()
  deviceID: string;

  @IsOptional()
  @IsNumber()
  dateOfBirth?: number;

  @IsOptional()
  @IsEnum(Gender)
  gender?: Gender;

  @IsOptional()
  @IsEnum(AccountType)
  accountType?: AccountType;

  @IsOptional()
  @IsEnum(Role)
  role?: Role;
}
