import { hash } from 'argon2';
import { HydratedDocument } from 'mongoose';

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { AccountType } from './enums/account-type.enum';
import { Gender } from './enums/gender.enum';
import { Role } from './enums/role.enum';
import { IUser } from './interface/user.interface';

type UserDocument = HydratedDocument<User>;

@Schema({
  timestamps: true,
  versionKey: false,
  collection: 'users',
})
export class User implements IUser {
  @Prop({ type: String })
  email: string;

  @Prop({ type: String })
  phone: string;

  @Prop({ type: String, select: false })
  socialToken: string;

  @Prop({ type: String, enum: AccountType, default: AccountType.LOCAL })
  accountType: AccountType;

  @Prop({ type: String, minlength: 6, select: false })
  password: string;

  @Prop({ type: String, default: '' })
  fullName: string;

  @Prop({ type: String, default: '' })
  deviceID: string;

  @Prop({ type: Number, default: 0 })
  dateOfBirth: number;

  @Prop({ type: String, enum: Gender, default: Gender.OTHER })
  gender: Gender;

  @Prop({ type: String, enum: Role, default: Role.USER })
  role: Role;

  @Prop({ type: Boolean, default: false })
  deleted: boolean;

  @Prop({ type: String, default: '', select: false })
  refreshToken: string;

  @Prop({ type: String, default: '' })
  avatar: string;
}

const UserSchema = SchemaFactory.createForClass(User);

// Pre save
UserSchema.pre('save', async function (next: any) {
  const user = this as UserDocument;

  // Only hash the password if it has been modified (or is new)
  if (!user.isModified('password')) return next();

  // Hash password
  user.password = await hash(user.password);

  return next();
});

export { UserDocument, UserSchema };
