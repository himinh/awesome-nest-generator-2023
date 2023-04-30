import { Types } from 'mongoose';
import { AppConfig, JWTConfig } from '~config/environment';
import { appEnvEnum } from '~config/environment/enums/app_env.enum';
import { MailService } from '~lazy-modules/mail/mail.service';
import { CreateUserDto } from '~routes/users/dto/create-user.dto';

import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { OtpType } from '../c3-otp/enum/otp-type.enum';
import { OtpService } from '../c3-otp/otp.service';
import { UserService } from '../users/user.service';
import { ResetPasswordDto } from './dto/reset-password-by-otp.dto';
import { SignInDto } from './dto/signin.dto';
import { SignupDto } from './dto/signup.dto';
import { AuthResponse, AuthTokenPayload, TokenPayload } from './interface';
import { TokenService } from './token.service';

@Injectable()
export class AuthService {
  private appConfig: AppConfig;
  private jwtConfig: JWTConfig;

  constructor(
    private readonly userService: UserService,
    private readonly tokenService: TokenService,
    private readonly otpService: OtpService,
    private readonly mailService: MailService,
    private readonly configService: ConfigService,
  ) {
    this.appConfig = this.configService.get<AppConfig>('app');
    this.jwtConfig = this.configService.get<JWTConfig>('jwt');
  }

  /**
   * Sign in with email/phone and password
   *
   * @param data
   * @returns
   */
  async signin(data: SignInDto): Promise<AuthResponse> {
    const { authKey, authValue, deviceID } = data;
    const filter = { [authKey]: authValue };

    const user = await this.userService.findOne(filter);

    if (user) {
      // check account deleted.
      if (user.deleted) {
        throw new BadRequestException('The account has been removed.');
      }

      // check password
      // await this.userService.checkPasswordById(user._id, password);

      // Add deviceID to fcmTokens
      if (deviceID) {
        await this.userService.addDeviceID(user._id, deviceID);
        // user.deviceID = deviceID;
      }

      // success
      const tokens = await this.generateAuthTokens(user);
      return { ...tokens, user };
    }

    //  Not found
    throw new BadRequestException('Incorrect account.');
  }

  /**
   * Sign in with social
   *
   * @param data
   * @returns
   */
  async signinWithSocial(data: CreateUserDto): Promise<AuthResponse> {
    let user = await this.userService.findOne({ socialToken: data.socialToken });

    // check user not exist
    if (!user) user = await this.userService.create(data);

    // check user has been deleted
    if (user.deleted) {
      throw new BadRequestException('The account has been removed.');
    }

    // Add deviceID
    if (data.deviceID) {
      await this.userService.addDeviceID(user._id, data.deviceID);
      user.deviceID = data.deviceID;
    }

    // success
    const tokens = await this.generateAuthTokens(user);
    return { ...tokens, user };
  }

  /**
   * Signup with otp
   *
   * @param data
   * @returns
   */
  async signup(data: SignupDto): Promise<AuthResponse> {
    await this.userService.validateCreateUser({
      phone: data.phone,
      email: data.email,
    });

    // verify otpCode
    // await this.otpService.verifyOtp({
    //   authKey,
    //   authValue,
    //   otpType: OtpType.SIGNUP,
    //   otpCode: data.otpCode,
    // });

    // // create user
    // userItem[authKey] = authValue;
    const user = await this.userService.create(data);

    // success
    const tokens = await this.generateAuthTokens(user);
    return { ...tokens, user };
  }

  /**
   * Sign up with token
   *
   * @param data
   * @returns
   */
  async signupSendTokenLink(data: CreateUserDto) {
    // check email
    const user = await this.userService.findOne({ email: data.email });

    // check user exist
    if (user) {
      if (user.deleted) {
        throw new BadRequestException('The account has been removed.');
      }

      throw new BadRequestException('Account already exists in the system.');
    }

    // generate signup token
    const token = await this.tokenService.generateSignupToken(data);

    const verificationLink = `${this.appConfig.appUrl}/auth/verify-signup-token?token=${token}`;

    // send mail
    await this.mailService.sendSignupToken(verificationLink, 'data.email', 'Register account.');

    // success
    return { verificationLink, token };
  }

  /**
   * Activate signup
   *
   * @param token
   * @return
   */
  async activateSignupToken(token: string) {
    const decoded = await this.tokenService.verifySignupToken(token);

    // delete key of token
    delete decoded.iat;
    delete decoded.exp;

    // validate user
    const user = await this.userService.findOne({ email: decoded.email });

    // check user exist
    if (user) {
      if (user.deleted) {
        throw new BadRequestException('The account has been removed.');
      }

      throw new BadRequestException('Account already exists in the system.');
    }

    // create user
    const userCreated = await this.userService.create(decoded);

    // success
    const tokens = await this.generateAuthTokens(userCreated);
    return { ...tokens, user };
  }

  /**
   * Refresh token
   *
   * @param token
   * @return
   */
  async refresh(token: string) {
    const decoded = await this.tokenService.verifyRefreshToken(token);
    const user = await this.userService.findById(decoded._id);

    if (!user) throw new NotFoundException('Invalid refresh');

    // success
    const tokens = await this.generateAuthTokens(user);
    return { ...tokens, user };
  }

  /**
   * Forgot password send token link
   *
   * @param email
   * @returns
   */
  async forgotPasswordSendTokenLink(email: string) {
    const user = await this.userService.findOne({ email });

    // check user exist
    if (user) {
      if (user.deleted) {
        throw new BadRequestException('The account has been removed.');
      }

      // Create expireTime
      // const expireTime = this.jwtConfig.expirationTime.resetPassword;

      // Generate accessToken
      const token = await this.tokenService.generateAccessToken({
        _id: user._id,
        role: user.role,
      });

      const resetPasswordLink = `${this.appConfig.appUrl}/auth/reset-password?token=${token}`;

      // Send mail
      await this.mailService.sendResetPasswordToken(
        resetPasswordLink,
        'data.email',
        'Reset password.',
      );

      // Response otp
      if (this.appConfig.env === appEnvEnum.DEVELOPMENT) {
        return { resetPasswordLink, token };
      }
    }

    throw new NotFoundException('Email not found.');
  }

  /**
   * Reset password by otp
   *
   * @param data
   * @return
   */
  async resetPasswordByOtp(data: ResetPasswordDto) {
    const { authKey, authValue } = data;

    const filter = { [authKey]: authValue };

    const user = await this.userService.findOne(filter);

    // check user exist
    if (user) {
      if (user.deleted) {
        throw new BadRequestException('The account has been removed.');
      }

      // Add deviceID to fcmTokens
      if (data.deviceID) {
        await this.userService.addDeviceID(user._id, data.deviceID);
        // user.deviceID = data.deviceID;
      }

      // verify otpCode
      await this.otpService.verifyOtp({
        authKey,
        authValue,
        otpType: OtpType.RESET_PASSWORD,
        otpCode: data.otpCode,
      });

      // update password
      await this.userService.updatePasswordById(user._id, {
        oldPassword: data.password,
        newPassword: data.password,
      });

      // success
      const tokens = await this.generateAuthTokens(user);
      return { ...tokens, user };
    }

    throw new NotFoundException('Account not found.');
  }

  /**
   * Reset password
   *
   * @param userId
   * @param password
   * @return
   */
  async resetPassword(userId: Types.ObjectId, password: string) {
    const user = await this.userService.updatePasswordById(userId, {
      oldPassword: '',
      newPassword: password,
    });

    // success
    const tokens = await this.generateAuthTokens(user);
    return { ...tokens, user };
  }

  /**
   * Generate auth tokens
   *
   * @param user
   * @returns
   */
  private async generateAuthTokens(user: any): Promise<AuthTokenPayload> {
    const payload: TokenPayload = {
      _id: user._id,
      role: user.role,
    };

    // Generate accessToken and refreshToken
    const [accessToken, refreshToken] = await Promise.all([
      this.tokenService.generateAccessToken(payload),
      this.tokenService.generateRefreshToken(payload),
    ]);

    // Success
    return { accessToken, refreshToken };
  }
}
