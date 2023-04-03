import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type MessageDocument = MessageContent & Document;

@Schema()
export class MessageContent {
  @Prop()
  text: string;

  @Prop()
  images: string[];
}

export const MessageSchema = SchemaFactory.createForClass(MessageContent);
