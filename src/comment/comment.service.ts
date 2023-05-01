import { CommentRepository } from './comment.repository';
import { Inject, Injectable } from '@nestjs/common';
import { AddCommentDto } from '../post/dto/add-comment.dto';
import { UserService } from '@user/user.service';
import { v4 as uuidv4 } from 'uuid';
import { User } from '@user/schemas/user.schema';
import { PostRepository } from '../post/post.repository';

@Injectable()
export class CommentService {
  constructor(
    private readonly repository: CommentRepository,

    @Inject(UserService)
    private readonly userService: UserService,

    @Inject(PostRepository)
    private readonly postRepository: PostRepository,
  ) {}

  async removeComment(commentId: string, { userId }: { userId: string }) {
    return await this.repository.removeComment(commentId, userId);
  }

  async addComment(dto: AddCommentDto, { userId }) {
    const author: User = await this.userService.findById(userId);

    const createdAt = new Date();

    const commentId = uuidv4();

    const comment = {
      commentId,
      postId: dto.postId,
      content: {
        text: dto.content.text,
        images: dto.content.images,
      },
      createdAt: createdAt,
      author: author._id,
      likes: [],
    };

    await this.postRepository.addComment(comment);

    return await this.repository.create(comment);
  }

  async addCommentLike(commentId: string, postId: string, { userId }) {
    const { _id }: any = await this.userService.findById(userId);

    return await this.repository.addCommentLike(commentId, postId, _id);
  }

  async removeCommentLike(commentId: string, likeId: string) {
    return await this.repository.removeCommentLike(commentId, likeId);
  }

  async findAll() {
    return this.repository.findAll();
  }
}
