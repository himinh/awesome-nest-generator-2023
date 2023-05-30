import { Types } from 'mongoose';
import { dbCollections } from '~config/collections/schemas.collection';

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({
  timestamps: true,
  versionKey: false,
  collection: dbCollections.district.name,
})
export class District {
  @Prop({
    type: Types.ObjectId,
    ref: dbCollections.province.ref,
    required: true,
  })
  readonly idProvince: Types.ObjectId;

  @Prop({ type: String, required: true })
  readonly name: string;

  @Prop({ type: String, default: 'district' })
  readonly type: string;

  @Prop({ type: String, slug: 'name' })
  readonly slug: string;
}

export type DistrictDocument = District & Document;
export const DistrictSchema = SchemaFactory.createForClass(District);
