import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { MessageService } from './message.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Controller('messages')
export class MessageController {
  constructor(
    private readonly messageService: MessageService,
    private eventEmitter: EventEmitter2,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Request() req, @Body() createMessageDto: CreateMessageDto) {
    this.eventEmitter.emit('message.create', createMessageDto);

    return this.messageService.create(createMessageDto, req.user);
  }

  @Get()
  findAll() {
    return this.messageService.findAll();
  }

  @Delete(':id')
  remove(@Param('id') messageId: string) {
    this.eventEmitter.emit('message.delete', messageId);

    return this.messageService.remove(messageId);
  }
}
