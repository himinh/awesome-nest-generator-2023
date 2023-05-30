import { ProvinceModule } from 'src/routes/c6-provinces/province.module';
import { DistrictModule } from 'src/routes/c7-districts/district.module';
import { WardModule } from 'src/routes/c8-wards/ward.module';
import { EndpointModule } from '~routes/endpoints/endpoint.module';

import { Module } from '@nestjs/common';

import { SeedController } from './seed.controller';
import { SeedService } from './seed.service';

@Module({
  imports: [ProvinceModule, DistrictModule, WardModule, EndpointModule],
  controllers: [SeedController],
  providers: [SeedService],
})
export class SeedModule {}
