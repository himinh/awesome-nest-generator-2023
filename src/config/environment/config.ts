import { registerAs } from '@nestjs/config';
import { ConfigName } from './config.enum';
import { IConfiguration } from './config.interface';

const env = process.env;
console.log({ env });

const appEnv = registerAs(ConfigName.app, () => ({
  appEnv: process.env.APP_ENV,
  port: +process.env.APP_PORT,
  appUrl: process.env.APP_URL,
}));

const databaseEnv = registerAs(ConfigName.database, () => ({
  name: process.env.DATABASE_NAME,
  uri: process.env.DATABASE_URI,
}));

const cloudinaryEnv = registerAs(ConfigName.cloudinary, () => ({
  config: {
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET,
  },
  options: {
    folder: process.env.APP_NAME,
  },
}));

const otpEnv = registerAs(ConfigName.otp, () => ({
  expiresIn: eval(process.env.OTP_EXPIRATION),
}));

const uploadEnv = registerAs(ConfigName.upload, () => ({
  imageMaxSize: +process.env.UPLOAD_IMAGE_MAX_SIZE,
  rawMaxSize: +process.env.UPLOAD_RAW_MAX_SIZE,
  videoMaxSize: +process.env.UPLOAD_VIDEO_MAX_SIZE,
  audioMaxSize: +process.env.UPLOAD_AUDIO_MAX_SIZE,

  imageMaxFiles: +process.env.UPLOAD_IMAGE_MAX_FILE,
  rawMaxFiles: +process.env.UPLOAD_RAW_MAX_FILE,
  videoMaxFiles: +process.env.UPLOAD_VIDEO_MAX_FILE,
  audioMaxFiles: +process.env.UPLOAD_AUDIO_MAX_FILE,

  imagesExt: process.env.UPLOAD_IMAGE_EXT,
  rawExt: process.env.UPLOAD_RAW_EXT,
  videoExt: process.env.UPLOAD_VIDEO_EXT,
  audioExt: process.env.UPLOAD_AUDIO_EXT,
}));

const jwtEnv = registerAs(ConfigName.jwt, () => ({
  secretKey: process.env.JWT_SECRET,
  expiresIn: eval(process.env.JWT_EXPIRATION),
  accessToken: {
    expiresIn: eval(process.env.JWT_ACCESS_EXPIRATION),
    secretKey: process.env.JWT_ACCESS_SECRET,
  },
  refreshToken: {
    expiresIn: eval(process.env.JWT_REFRESH_EXPIRATION),
    secretKey: process.env.JWT_REFRESH_SECRET,
  },
  registerToken: {
    expiresIn: eval(process.env.JWT_SIGNUP_EXPIRATION),
    secretKey: process.env.JWT_SIGNUP_SECRET,
  },
  resetPasswordToken: {
    expiresIn: eval(process.env.JWT_RESET_PASSWORD_EXPIRATION),
    secretKey: process.env.JWT_SECRET_RESET_PASSWORD,
  },
}));

const mailerEnv = registerAs(ConfigName.mailer, () => ({
  isGmailServer: process.env.MAIL_SERVER,

  transport: {
    gmail: {
      host: process.env.SMTP_GMAIL_HOST,
      secure: false,
      auth: {
        user: process.env.SMTP_GMAIL_USERNAME,
        pass: process.env.SMTP_GMAIL_PASSWORD,
      },
    },

    sendgrid: {
      host: process.env.SMTP_SENDGRID_HOST,
      auth: {
        user: process.env.SMTP_SENDGRID_USERNAME,
        pass: process.env.SMTP_SENDGRID_PASSWORD,
      },
    },
  },
  defaults: { from: process.env.EMAIL_FROM },
  name: process.env.EMAIL_NAME,
}));

export const configurations = [
  appEnv,
  databaseEnv,
  cloudinaryEnv,
  otpEnv,
  uploadEnv,
  jwtEnv,
  mailerEnv,
];
