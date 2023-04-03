import { MongooseModule } from '@nestjs/mongoose';
import { Comment, CommentSchema } from './schemas/comment.schema';
import { User, UserSchema } from '@user/schemas/user.schema';
import { forwardRef, Module } from '@nestjs/common';
import { CommentController } from './comment.controller';
import { CommentService } from './comment.service';
import { CommentRepository } from './comment.repository';
import { Post, PostSchema } from '../post/schemas/post.schema';
import { UserModule } from '@user/user.module';
import { PostRepository } from '../post/post.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Comment.name, schema: CommentSchema },
      { name: User.name, schema: UserSchema },
      { name: Post.name, schema: PostSchema },
    ]),
    forwardRef(() => UserModule),
  ],
  controllers: [CommentController],
  providers: [CommentService, CommentRepository, PostRepository],
  exports: [CommentService],
})
export class CommentModule {}
