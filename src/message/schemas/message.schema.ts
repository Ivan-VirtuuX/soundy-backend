import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

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
  text: string;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt?: Date;
}

export const MessageSchema = SchemaFactory.createForClass(Message);
