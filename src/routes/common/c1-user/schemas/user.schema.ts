import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import * as argon2 from 'argon2';

import { collectionNames } from '~config/collections/collectionName';
import { GenderEnum } from '../enums/gender.enum';
import { RoleEnum } from '../enums/role.enum';
import { AccountTypeEnum } from '../enums/account-type.enum';

@Schema({
  timestamps: true,
  versionKey: false,
  collection: collectionNames.user.schemaName,
})
export class User {
  @Prop({ type: Types.ObjectId, ref: collectionNames.address.ref })
  readonly idAddress: Types.ObjectId;

  @Prop({
    type: [{ type: Types.ObjectId, ref: collectionNames.roleManager.ref }],
    default: [],
  })
  readonly roleManager: Types.ObjectId[];

  @Prop({
    type: [{ type: Types.ObjectId, ref: collectionNames.endpointAPI.ref }],
    default: [],
  })
  readonly apiCanAccess: Types.ObjectId[];

  @Prop({
    type: [{ type: Types.ObjectId, ref: collectionNames.endpointAPI.ref }],
    default: [],
  })
  readonly apiDenines: Types.ObjectId[];

  @Prop({ type: String, required: true })
  readonly fullName: string;

  @Prop({ type: String, default: '' })
  readonly email: string;

  @Prop({ type: String, default: '' })
  readonly phone: string;

  @Prop({ type: String, select: false })
  readonly authKey: string;

  @Prop({ type: String, select: false })
  password: string;

  @Prop({ type: String, enum: AccountTypeEnum, default: AccountTypeEnum.LOCAL })
  readonly accountType: AccountTypeEnum;

  @Prop({ type: String, default: '' })
  readonly deviceID: string;

  @Prop({ type: [{ type: String }], default: [] })
  readonly fcmTokens: string[];

  @Prop({ type: Boolean, default: true })
  readonly enableFcm: boolean;

  @Prop({ type: String, enum: GenderEnum, default: GenderEnum.FEMALE })
  readonly gender: GenderEnum;

  @Prop({ type: Number, default: 0 })
  readonly dateOfBirth: number;

  @Prop({ type: String, enum: RoleEnum, default: RoleEnum.USER })
  readonly role: RoleEnum;
}

type UserDocument = User & Document;
const UserSchema = SchemaFactory.createForClass(User);

UserSchema.pre('save', async function (next: any) {
  const user = this as UserDocument;

  // Only hash the password if it has been modified (or is new)
  if (!user.isModified('password')) return next();

  // Hash password
  user.password = await argon2.hash(user.password);

  return next();
});

export { UserDocument, UserSchema };
