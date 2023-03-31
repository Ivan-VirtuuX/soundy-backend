import { CommentRepository } from './comment.repository';
import { Inject, Injectable } from '@nestjs/common';
import { AddCommentDto } from '../post/dto/add-comment.dto';
import { UserService } from '@user/user.service';
import { v4 as uuidv4 } from 'uuid';
import { User } from '@user/schemas/user.schema';

@Injectable()
export class CommentService {
  constructor(
    private readonly repository: CommentRepository,

    @Inject(UserService)
    private readonly userService: UserService,
  ) {}

  async removeComment(commentId: string) {
    return await this.repository.removeComment(commentId);
  }

  async addComment(dto: AddCommentDto, { id }) {
    const author: User = await this.userService.findById(id);

    const createdAt = new Date();

    const commentId = uuidv4();

    return await this.repository.create({
      commentId,
      postId: dto.postId,
      text: dto.text,
      createdAt: createdAt,
      author: {
        _id: author._id,
        userId: author.userId,
        login: author.login,
        name: author.name,
        surname: author.surname,
        birthDate: author.birthDate,
        avatarUrl: author.avatarUrl,
      },
      likes: [],
    });
  }

  async addCommentLike(commentId: string, postId: string, { id }) {
    const { _id }: any = await this.userService.findById(id);

    return await this.repository.addCommentLike(commentId, postId, _id);
  }

  async removeCommentLike(commentId: string, likeId: string) {
    return await this.repository.removeCommentLike(commentId, likeId);
  }

  async findAll() {
    return this.repository.findAll();
  }

  async remove(messageId: string) {
    return this.repository.remove(messageId);
  }
}
