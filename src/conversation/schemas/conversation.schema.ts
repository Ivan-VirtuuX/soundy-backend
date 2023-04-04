import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { Message } from '../../message/schemas/message.schema';

export type ConversationDocument = Conversation & Document;

@Schema()
export class Conversation {
  @Prop()
  conversationId: string;

  @Prop()
  sender: mongoose.Types.ObjectId;

  @Prop()
  receiver: mongoose.Types.ObjectId;

  @Prop()
  messages: Message[];

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;
}

export const ConversationSchema = SchemaFactory.createForClass(Conversation);
