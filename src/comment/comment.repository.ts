import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Comment, CommentDocument } from './schemas/comment.schema';
import { User, UserDocument } from '@user/schemas/user.schema';
import { v4 as uuidv4 } from 'uuid';
import { Post, PostDocument } from '../post/schemas/post.schema';

@Injectable()
export class CommentRepository {
  constructor(
    @InjectModel(Comment.name)
    private commentModel: Model<CommentDocument>,

    @InjectModel(User.name)
    private userModel: Model<UserDocument>,

    @InjectModel(Post.name)
    private postModel: Model<PostDocument>,
  ) {}

  async create(comment) {
    const newComment = await new this.commentModel(comment);

    await newComment.populate('author', '', this.userModel);

    return await newComment.save();
  }

  async removeComment(commentId: string, userId: string) {
    const comment = await this.commentModel
      .findOne({ commentId })
      .populate('author', '', this.userModel);

    if (comment.author.userId === userId) {
      await this.commentModel.findOneAndDelete({ commentId });
    }
  }

  async addCommentLike(commentId: string, postId: string, _id: Types.ObjectId) {
    const comments = await this.commentModel.find({ postId });

    const like = { likeId: uuidv4(), author: _id };

    if (
      comments.find((comment) => comment.commentId === commentId).likes
        .length === 0 ||
      !comments.find((comment) =>
        comment.likes.find((like: any) => _id.equals(like.author)),
      )
    ) {
      await this.commentModel.findOneAndUpdate(
        { commentId },
        {
          $push: {
            likes: {
              ...like,
            },
          },
        },
      );
      return like;
    }
    return new ForbiddenException('Duplicate error');
  }

  async removeCommentLike(commentId: string, likeId: string) {
    return this.commentModel.findOneAndUpdate(
      { commentId },
      {
        $pull: {
          likes: {
            likeId,
          },
        },
      },
      { new: true },
    );
  }

  async findAll() {
    return this.commentModel.find();
  }

  async remove(commentId: string) {
    return this.commentModel.deleteOne({ commentId: commentId });
  }
}
