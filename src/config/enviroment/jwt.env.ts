import { registerAs } from '@nestjs/config';

const jwtEnv = {
  secret: process.env.JWT_SECRET || '?wOfl6_4Q_KeYS(#a{qGe+W2!L_q6H', // https://randomkeygen.com/
  expiresIn: process.env.JWT_EXPIRESIN || '30m',
  expirationTime: {
    accessToken: process.env.JWT_ACCESS_EXPIRATION || '88d',
    refreshToken: process.env.JWT_REFRESH_EXPIRATION || '1m',
    signupToken: process.env.JWT_SIGNUP_EXPIRATION || '10m',
    resetPasswordToken: process.env.JWT_RESET_PASSWORD_EXPIRATION || '5m',
  },
  secrets: {
    accessToken: process.env.JWT_ACCESS_SECRET || 'JWT_ACCESS_SECRET',
    refreshToken: process.env.JWT_REFRESH_SECRET || 'JWT_REFRESH_SECRET',
    signupToken: process.env.JWT_SIGNUP_SECRET || 'JWT_SIGNUP_SECRET',
  },
};

export type JWTConfig = typeof jwtEnv;

export const jwtCofig = registerAs('jwt', () => jwtEnv);
