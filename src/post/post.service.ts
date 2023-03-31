import { Inject, Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { PostRepository } from './post.repository';
import { Post } from './schemas/post.schema';
import { v4 as uuidv4 } from 'uuid';
import { UserService } from '@user/user.service';
import { User } from '@user/schemas/user.schema';
import { Types } from 'mongoose';
import { AddLikeDto } from './dto/add-like.dto';
import { Comment } from '../comment/schemas/comment.schema';

@Injectable()
export class PostService {
  @Inject(UserService)
  private readonly userService: UserService;

  constructor(private readonly repository: PostRepository) {}

  async findAllPostsComments(): Promise<Comment[]> {
    return await this.repository.findAllPostsComments();
  }

  async create(dto: CreatePostDto, userId: string): Promise<Post> {
    const firstParagraph = dto.body.find((obj) => obj.type === 'paragraph')
      ?.data?.text;

    const users: User[] = await this.userService.findAll();

    const userObjectId: Types.ObjectId = await users.find(
      (user) => user.userId === userId,
    )._id;

    return await this.repository.create({
      postId: uuidv4(),
      body: dto.body,
      description: firstParagraph || '',
      comments: [],
      author: userObjectId,
      views: [],
      likes: [],
      createdAt: new Date(),
      pinned: false,
    });
  }

  async getPinnedPost(userId: string): Promise<Post> {
    const posts = await this.repository.find();

    const userPosts = posts.filter(
      (post: any) => post.author.userId === userId,
    );

    return userPosts.find((post) => post.pinned);
  }

  async findAll(_limit: number, _page: number): Promise<Post[]> {
    return await this.repository.find(_limit, _page);
  }

  async searchPosts(
    _text: string,
    _limit: number,
    _page: number,
  ): Promise<Post[]> {
    return await this.repository.searchPosts(_text, _limit, _page);
  }

  async getUserPosts(
    _limit: number,
    _page: number,
    userId: string,
  ): Promise<Post[]> {
    return await this.repository.getUserPosts(_limit, _page, userId);
  }

  async delete(postId: string) {
    return this.repository.delete(postId);
  }

  async addLike(dto: AddLikeDto, postId: string, { id }) {
    const { _id }: any = await this.userService.findById(id);

    return await this.repository.addLike(dto, postId, _id);
  }

  async togglePin(postId: string, { id }) {
    const { userId }: any = await this.userService.findById(id);

    return await this.repository.togglePin(postId, userId);
  }

  async removeLike(postId: string, likeId: string) {
    return await this.repository.removeLike(postId, likeId);
  }

  async getPostComments(postId: string) {
    return this.repository.findComments(postId);
  }

  async findById(_id: string): Promise<Post> {
    return await this.repository.findOne(_id);
  }

  async addView(postId: string, { id }) {
    return await this.repository.addView(postId, id);
  }
}
