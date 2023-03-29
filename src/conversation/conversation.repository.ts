import {
  Conversation,
  ConversationDocument,
} from './schemas/conversation.schema';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Message, MessageDocument } from '../message/schemas/message.schema';
import { User, UserDocument } from '@user/schemas/user.schema';

@Injectable()
export class ConversationRepository {
  constructor(
    @InjectModel(Conversation.name)
    private conversationModel: Model<ConversationDocument>,
    @InjectModel(Message.name)
    private messageModel: Model<MessageDocument>,
    @InjectModel(User.name)
    private userModel: Model<UserDocument>,
  ) {}

  async create(conversation: Conversation): Promise<Conversation> {
    const newConversation = new this.conversationModel(conversation);

    return await newConversation.save();
  }

  async findMessages(conversationId: string): Promise<Message[]> {
    const messages = await this.messageModel
      .find({ conversationId })
      .populate('sender', '', this.userModel)
      .exec();

    return messages;
  }

  async findAll(user: User): Promise<Conversation[]> {
    const conversations = await this.conversationModel
      .find()
      .populate('sender', '', this.userModel)
      .populate('receiver', '', this.userModel)
      .exec();

    return conversations.filter((conversation) => {
      return (
        conversation.sender._id.equals(user._id) ||
        conversation.receiver._id.equals(user._id)
      );
    });
  }

  async findOne(conversationId: string) {
    return await this.conversationModel
      .findOne({
        conversationId: conversationId,
      })
      .populate('sender', '', this.userModel)
      .populate('receiver', '', this.userModel)
      .exec();
  }

  async remove(conversationId: string) {
    await this.messageModel
      .find({})
      .deleteMany({ conversationId: conversationId });

    return await this.conversationModel.deleteOne({
      conversationId: conversationId,
    });
  }
}
