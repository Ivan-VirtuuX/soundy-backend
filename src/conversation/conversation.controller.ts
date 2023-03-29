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
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ConversationService } from './conversation.service';
import { CreateConversationDto } from './dto/create-conversation.dto';

@Controller('conversations')
export class ConversationController {
  constructor(private readonly conversationService: ConversationService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Request() req, @Body() createConversationDto: CreateConversationDto) {
    return this.conversationService.create(createConversationDto, req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(@Request() req) {
    return this.conversationService.findAll(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') conversationId: string) {
    return this.conversationService.findOne(conversationId);
  }

  @Get(':id/messages')
  findMessages(@Param('id') id: string) {
    return this.conversationService.findMessages(id);
  }

  @Delete(':id')
  remove(@Param('id') conversationId: string) {
    return this.conversationService.remove(conversationId);
  }
}
