import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { MessageContent } from './message-content.schema';

export type MessageDocument = Message & Document;

@Schema()
export class Message {
  @Prop()
  messageId: string;

  @Prop()
  conversationId: string;

  @Prop()
  sender: mongoose.Types.ObjectId;

  @Prop()
  content: MessageContent;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt?: Date;
}

export const MessageSchema = SchemaFactory.createForClass(Message);
