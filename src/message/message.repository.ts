import {
  Conversation,
  ConversationDocument,
} from '../conversation/schemas/conversation.schema';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '@user/schemas/user.schema';
import { Message, MessageDocument } from './schemas/message.schema';

@Injectable()
export class MessageRepository {
  constructor(
    @InjectModel(Message.name)
    private messageModel: Model<MessageDocument>,

    @InjectModel(User.name)
    private userModel: Model<UserDocument>,

    @InjectModel(Conversation.name)
    private conversationModel: Model<ConversationDocument>,
  ) {}

  async create(message: Message): Promise<Message> {
    const newMessage = new this.messageModel(message);

    await this.conversationModel.findOneAndUpdate(
      { conversationId: message.conversationId },
      { $set: { updatedAt: new Date() } },
    );

    return await newMessage.save();
  }

  async findAll() {
    return await this.messageModel
      .find()
      .populate('sender', '', this.userModel)
      .exec();
  }

  async remove(messageId: string) {
    return await this.messageModel.deleteOne({ messageId: messageId });
  }
}
