import { MessageRepository } from './message.repository';
import { Injectable } from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import { User } from '@user/schemas/user.schema';

@Injectable()
export class MessageService {
  constructor(private readonly repository: MessageRepository) {}

  async create(dto: CreateMessageDto, sender: User) {
    return this.repository.create({
      messageId: dto.messageId,
      conversationId: dto.conversationId,
      sender: sender._id,
      text: dto.text,
      createdAt: new Date(),
    });
  }

  async findAll() {
    return this.repository.findAll();
  }

  async remove(messageId: string) {
    return this.repository.remove(messageId);
  }
}
