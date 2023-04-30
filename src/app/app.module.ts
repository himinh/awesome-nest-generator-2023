import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { join } from 'path';
import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { AqpMiddleware } from '~middleware/aqp.middleware';
import { LoggerMiddleware } from '~middleware/logger.middleware';

import { DatabaseModule } from '~config/database/database.module';
import { LoggerModule } from '~lazy-modules/logger/logger.module';
import { EndpointModule } from 'src/routes/endpoints/endpoint.module';
import { MenuModule } from 'src/routes/menus/menu.module';
import { UserModule } from '~routes/users/user.module';
import { configuration } from '~config/environment/configuration';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '../../', 'public'),
      serveRoot: '/',
    }),

    ConfigModule.forRoot({
      load: [configuration],
    }),

    // Authorizations
    DatabaseModule,
    // SeedModule,
    LoggerModule,
    EndpointModule,
    MenuModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AqpMiddleware).forRoutes({ path: '*', method: RequestMethod.GET });

    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
