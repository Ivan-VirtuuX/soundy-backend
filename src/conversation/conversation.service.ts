import { ConversationRepository } from './conversation.repository';
import {
  ForbiddenException,
  forwardRef,
  Inject,
  Injectable,
} from '@nestjs/common';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { v4 as uuidv4 } from 'uuid';
import { User } from '@user/schemas/user.schema';
import { UserRepository } from '@user/user.repository';
import { UserService } from '@user/user.service';
import mongoose from 'mongoose';

@Injectable()
export class ConversationService {
  constructor(
    private readonly conversationRepository: ConversationRepository,
    @Inject(forwardRef(() => UserService))
    private readonly userRepository: UserRepository,
  ) {}

  async create(dto: CreateConversationDto, sender: User) {
    const receiverObjId: mongoose.Types.ObjectId = await (
      await this.userRepository.findAll()
    ).find((user) => user.userId === String(dto.receiver))._id;

    const conversations: any = await this.conversationRepository.findAll(
      sender,
    );

    if (
      conversations.some(
        (conversation) =>
          conversation.receiver.userId === dto.receiver ||
          conversation.sender.userId === dto.receiver,
      )
    ) {
      throw new ForbiddenException('This conversation exists');
    }
    return await this.conversationRepository.create({
      sender: sender._id,
      receiver: receiverObjId,
      conversationId: uuidv4(),
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  async findAll(user: User) {
    return await this.conversationRepository.findAll(user);
  }

  async findMessages(conversationId: string) {
    return await this.conversationRepository.findMessages(conversationId);
  }

  async findOne(conversationId: string) {
    return await this.conversationRepository.findOne(conversationId);
  }

  async remove(conversationId: string) {
    return await this.conversationRepository.remove(conversationId);
  }
}
