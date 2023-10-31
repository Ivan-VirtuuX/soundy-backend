import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { Post as PostSchema } from './schemas/post.schema';
import { AddLikeDto } from './dto/add-like.dto';

@Controller('posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Get()
  findAll(@Query() { _limit, _page }) {
    return this.postService.findAll(_limit, _page);
  }

  @Get('/search')
  async searchPosts(@Query() { _text, _limit, _page }) {
    return this.postService.searchPosts(_text, _limit, _page);
  }

  @Get('/user')
  getUserPosts(@Query() { _limit, _page, userId }) {
    return this.postService.getUserPosts(_limit, _page, userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id')
  addView(@Param('id') id: string, @Request() req) {
    return this.postService.addView(id, req.user);
  }

  @Get('/comments')
  findAllPostsComments() {
    return this.postService.findAllPostsComments();
  }

  @UseGuards(JwtAuthGuard)
  @Get('/pinned')
  getPinnedPost(@Query() { userId }) {
    return this.postService.getPinnedPost(userId);
  }

  @Get(':id/comments')
  getPostComments(@Param('id') postId: string) {
    return this.postService.getPostComments(postId);
  }

  @Get(':id')
  findOne(@Param('id') _id: string) {
    return this.postService.findById(_id);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  create(
    @Body() createPostDto: CreatePostDto,
    @Request() req,
  ): Promise<PostSchema> {
    return this.postService.create(createPostDto, req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/likes')
  addLike(
    @Param('id') id: string,
    @Body() addLikeDto: AddLikeDto,
    @Request() req,
  ): Promise<PostSchema> {
    return this.postService.addLike(addLikeDto, id, req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/pins')
  togglePin(@Param('id') id: string, @Request() req): Promise<PostSchema> {
    return this.postService.togglePin(id, req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id/likes')
  removeLike(
    @Param('id') postId: string,
    @Body() { likeId }: { likeId: string },
  ): Promise<PostSchema> {
    return this.postService.removeLike(postId, likeId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete()
  delete(@Body() { postId }: { postId: string }): Promise<any> {
    return this.postService.delete(postId);
  }
}
