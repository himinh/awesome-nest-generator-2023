import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ApiQueryParamsMiddleware } from 'src/utils/interceptor/api-query-params.middleware';
import { DatabaseModule } from '~config/database/database.module';
import { UserModule } from '~common/c1-user/user.module';
import { ProvinceModule } from '~common/c3-provinces/province.module';
import { MailModule } from '~lazy-modules/mail/mail.module';
import { OtpModule } from '~common/c2-otp/otp.module';
import { AuthModule } from '~authorizations/a1-auth/auth.module';
import { SeedModule } from '~lazy-modules/seed/seed.module';
import { LoggerModule } from '~lazy-modules/logger/logger.module';
import { configuration } from '~config/enviroment/enviroment.config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [configuration] }),
    DatabaseModule,
    UserModule,
    ProvinceModule,
    MailModule,
    OtpModule,
    AuthModule,
    SeedModule,
    LoggerModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(ApiQueryParamsMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.GET });
  }
}
