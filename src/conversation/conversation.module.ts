import {
  Conversation,
  ConversationSchema,
} from './schemas/conversation.schema';
import { forwardRef, Module } from '@nestjs/common';
import { ConversationService } from './conversation.service';
import { ConversationController } from './conversation.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ConversationRepository } from './conversation.repository';
import { Message, MessageSchema } from '../message/schemas/message.schema';
import { User, UserSchema } from '@user/schemas/user.schema';
import { UserModule } from '@user/user.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Conversation.name, schema: ConversationSchema },
      { name: Message.name, schema: MessageSchema },
      { name: User.name, schema: UserSchema },
    ]),
    forwardRef(() => UserModule),
  ],
  controllers: [ConversationController],
  providers: [ConversationService, ConversationRepository],
  exports: [ConversationService],
})
export class ConversationModule {}
