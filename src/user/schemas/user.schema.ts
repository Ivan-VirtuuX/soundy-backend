import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop()
  _id?: Types.ObjectId;

  @Prop()
  userId: string;

  @Prop()
  login: string;

  @Prop()
  name: string;

  @Prop()
  surname: string;

  @Prop()
  birthDate: Date;

  @Prop()
  avatarUrl?: string;

  @Prop()
  friends: User[];

  @Prop()
  friendRequests: User[];

  @Prop()
  password?: string;

  @Prop()
  createdAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
