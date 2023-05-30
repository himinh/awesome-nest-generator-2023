import { District, DistrictDocument } from './schemas/district.schema';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PaginateModel } from 'mongoose';
import { BaseService } from '~base-inherit/base.service';

@Injectable()
export class DistrictService extends BaseService<DistrictDocument> {
  constructor(@InjectModel(District.name) model: PaginateModel<DistrictDocument>) {
    super(model);
  }
}
