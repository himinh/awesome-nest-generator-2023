import { ObjectId } from 'mongodb';

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({
  timestamps: true,
  versionKey: false,
  collection: 'districts',
})
export class District {
  @Prop({
    type: ObjectId,
    ref: 'Province',
    required: true,
  })
  readonly idProvince: ObjectId;

  @Prop({ type: String, required: true })
  readonly name: string;

  @Prop({ type: String, default: 'district' })
  readonly type: string;

  @Prop({ type: String, slug: 'name' })
  readonly slug: string;
}

export type DistrictDocument = District & Document;
export const DistrictSchema = SchemaFactory.createForClass(District);