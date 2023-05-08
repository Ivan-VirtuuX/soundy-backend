import { Prop, Schema } from '@nestjs/mongoose';

@Schema()
export class MessageContent {
  @Prop()
  text: string;

  @Prop()
  images: string[];
}
