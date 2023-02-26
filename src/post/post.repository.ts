import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Post, PostDocument } from './schemas/post.schema';
import { v4 as uuidv4 } from 'uuid';
import { User, UserDocument } from '@user/schemas/user.schema';
import { AddLikeDto } from './dto/add-like.dto';
import { Comment, CommentDocument } from '../comment/schemas/comment.schema';

@Injectable()
export class PostRepository {
  constructor(
    @InjectModel(Post.name) private postModel: Model<PostDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Comment.name) private commentModel: Model<CommentDocument>,
  ) {}
  async findAllPostsComments() {
    const result: any = await this.postModel
      .find()
      .populate('comments.author', '', this.userModel)
      .exec();

    return result.map(({ comments }) => comments).flat();
  }

  async searchByTitle(title: string) {
    return this.postModel.find({
      title: { $regex: title, $options: 'i' },
    });
  }

  async findOne(_id: string): Promise<Post> {
    const posts = await this.postModel.find();

    return this.postModel.findById(
      posts.find((post) => post.postId === _id)?._id,
    );
  }

  async find(_limit?: number, _page?: number): Promise<Post[]> {
    if (_limit > 0 && _page == 1)
      return await this.postModel
        .find()
        .limit(_limit)
        .populate('author', '', this.userModel)
        .populate('comments.author', '', this.userModel)
        .exec();
    else if (_limit > 0 && _page > 1)
      return await this.postModel
        .find()
        .skip(_limit * (_page - 1))
        .limit(_limit)
        .populate('author', '', this.userModel)
        .populate('comments.author', '', this.userModel)
        .exec();
    else
      return await this.postModel
        .find()
        .populate('author', '', this.userModel)
        .populate('comments.author', '', this.userModel)
        .exec();
  }

  async findComments(postId: string): Promise<any> {
    return await this.commentModel
      .find({ postId })
      .populate('author', '', this.userModel)
      .exec();
  }

  async findComment(postId: string): Promise<any> {
    const comment = await this.commentModel
      .findOne({ postId })
      .populate('author', '', this.userModel)
      .exec();

    const comments = [];

    return [...comments, comment];
  }

  async create(post: Post): Promise<Post> {
    const newPost = new this.postModel(post);

    return newPost.save();
  }

  async delete(postId: string) {
    await this.commentModel.deleteMany({ postId });

    return this.postModel.deleteOne({ postId: postId });
  }

  async addLike(dto: AddLikeDto, id: string, _id: Types.ObjectId) {
    const likeId = uuidv4();

    return this.postModel.findOneAndUpdate(
      { postId: id },
      {
        $push: {
          likes: {
            likeId,
            postId: id,
            author: _id,
          },
        },
      },
    );
  }

  async removeLike(postId: string, likeId: string) {
    return this.postModel.findOneAndUpdate(
      { postId },
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

  async removeComment(commentId, postId: string) {
    const posts = await this.postModel.find();

    const currPostId = posts.find((post) => post.postId === postId)._id;

    await this.postModel.findByIdAndUpdate(
      currPostId,
      {
        $pull: {
          comments: { commentId: commentId.commentId },
        },
      },
      { new: true },
    );

    return { message: 'Comment deleted' };
  }

  async addView(postId: string, userId: string) {
    const user = await this.userModel.find({ userId });

    const post = await this.postModel.find({ postId });

    return post[0]?.views.length === 0 ||
      post[0]?.views?.some((user) => user.userId !== userId)
      ? await this.postModel.findOneAndUpdate(
          { postId },
          {
            $push: {
              views: user[0],
            },
          },
        )
      : new ForbiddenException('Duplicate error');
  }
}
