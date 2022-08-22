import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { collectionNames } from 'src/config/collections/collectionName';

@Schema({
  timestamps: true,
  versionKey: false,
  collection: collectionNames.ward.schemaName,
})
export class Ward {
  @Prop({
    type: Types.ObjectId,
    ref: collectionNames.province.ref,
    required: true,
  })
  readonly idProvince: string;

  @Prop({
    type: Types.ObjectId,
    ref: collectionNames.district.ref,
    required: true,
  })
  readonly idDistrict: string;

  @Prop({ type: String, required: true })
  readonly name: string;

  @Prop({ type: String, default: 'ward' })
  readonly type: string;

  @Prop({ type: String, slug: 'name' })
  readonly slug: string;
}

export type WardDocument = Ward & Document;
export const WardSchema = SchemaFactory.createForClass(Ward);
