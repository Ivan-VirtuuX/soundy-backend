import { Injectable } from '@nestjs/common';
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

    return newComment.save();
  }
  async addCommentLike(commentId: string, postId: string, _id: Types.ObjectId) {
    return this.commentModel.findOneAndUpdate(
      { commentId },
      {
        $push: {
          likes: {
            likeId: uuidv4(),
            author: _id,
          },
        },
      },
    );
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
