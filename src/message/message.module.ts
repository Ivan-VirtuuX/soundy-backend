import { MessageRepository } from './message.repository';
import { forwardRef, Module } from '@nestjs/common';
import { MessageService } from './message.service';
import { MessageController } from './message.controller';
import { Message, MessageSchema } from './schemas/message.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { ConversationModule } from '../conversation/conversation.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { User, UserSchema } from '@user/schemas/user.schema';
import {
  Conversation,
  ConversationSchema,
} from '../conversation/schemas/conversation.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Message.name, schema: MessageSchema }]),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([
      { name: Conversation.name, schema: ConversationSchema },
    ]),
    forwardRef(() => ConversationModule),
    EventEmitterModule.forRoot(),
  ],
  controllers: [MessageController],
  providers: [MessageService, MessageRepository],
  exports: [MessageService],
})
export class MessageModule {}
