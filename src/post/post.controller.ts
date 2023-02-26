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

  @Post('/search')
  searchPosts(@Body() { title }: { title: string }) {
    return this.postService.search(title);
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

  // @Get(':id/comments')
  // getPostComment(@Param('id') postId: string) {
  //   return this.postService.getPostComment(postId);
  // }

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
    return this.postService.create(createPostDto, req.user.id);
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
  @Delete(':id/likes')
  removeLike(
    @Param('id') postId: string,
    @Body() { likeId }: { likeId: string },
  ): Promise<PostSchema> {
    return this.postService.removeLike(postId, likeId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete()
  delete(@Body() { postId }: { postId: string }) {
    return this.postService.delete(postId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id/comments')
  removeComment(@Param('id') postId: string, @Body() commentId: string) {
    return this.postService.removeComment(commentId, postId);
  }
}
