import {
  Body,
  Controller,
  Delete,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { AddCommentDto } from './dto/add-comment.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Comment } from './schemas/comment.schema';

@Controller('comments')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  addComment(@Body() addCommentDto: AddCommentDto, @Request() req) {
    return this.commentService.addComment(addCommentDto, req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id')
  addCommentLike(
    @Param('id') id,
    @Body() { postId }: { postId: string },
    @Request() req,
  ) {
    return this.commentService.addCommentLike(id, postId, req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  removeLike(
    @Param('id') commentId: string,
    @Body() { likeId }: { likeId: string },
  ): Promise<Comment> {
    return this.commentService.removeCommentLike(commentId, likeId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete()
  removeComment(@Body() { commentId }: { commentId: string }) {
    return this.commentService.removeComment(commentId);
  }
}
