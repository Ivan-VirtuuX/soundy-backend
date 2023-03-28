import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { PostModule } from './post/post.module';
import { CommentModule } from './comment/comment.module';
import { GatewayModule } from './gateway/gateway.module';
import { ConversationModule } from './conversation/conversation.module';
import { MessageModule } from './message/message.module';

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb+srv://virtuux:897158@soundy-db.hd0zmxc.mongodb.net/test',
    ),
    AuthModule,
    PostModule,
    CommentModule,
    GatewayModule,
    ConversationModule,
    MessageModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
