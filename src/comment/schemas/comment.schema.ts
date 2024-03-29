import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from '@user/schemas/user.schema';
import { MessageContent } from '../../message/schemas/message-content.schema';

export type CommentDocument = Comment & Document;

@Schema()
export class Comment {
  @Prop({ type: Types.ObjectId, ref: User.name })
  author: User;

  @Prop()
  postId: string;

  @Prop()
  commentId: string;

  @Prop()
  content: MessageContent;

  @Prop()
  likes: User[];

  @Prop()
  createdAt?: Date;

  @Prop()
  updatedAt?: Date;
}

export const CommentSchema = SchemaFactory.createForClass(Comment);
