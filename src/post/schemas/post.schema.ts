import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { User } from '@user/schemas/user.schema';
import { Document, Types } from 'mongoose';
import { OutputBlockData } from '../dto/create-post.dto';
import { Comment } from '../../comment/schemas/comment.schema';

export type PostDocument = Post & Document;

@Schema()
export class Post {
  @Prop()
  postId: string;

  @Prop()
  body: OutputBlockData[];

  @Prop([String])
  description: string;

  @Prop()
  comments: Comment[];

  @Prop()
  author: Types.ObjectId;

  @Prop()
  views: User[];

  @Prop()
  likes: User[];

  @Prop()
  createdAt?: Date;

  @Prop()
  updatedAt?: Date;

  @Prop()
  pinned: false;
}

export const PostSchema = SchemaFactory.createForClass(Post);
