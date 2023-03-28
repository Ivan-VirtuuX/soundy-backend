import mongoose from 'mongoose';

export class CreateConversationDto {
  receiver: mongoose.Types.ObjectId | string;
}
