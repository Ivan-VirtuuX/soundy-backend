import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { LoginUserDto } from './dto/login-user.dto';
import { ChangeUserDataDto } from './dto/change-userdata.dto';
import { User, UserDocument } from './schemas/user.schema';
import { SearchUserDto } from '@user/dto/search-user.dto';

@Injectable()
export class UserRepository {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async findOne(id: string): Promise<User> {
    const users = await this.userModel
      .find()
      .populate('friendRequests', '', this.userModel)
      .populate('friends', '', this.userModel)
      .exec();

    const userId = await users.find((user) => user.userId === id)?._id;

    return await this.userModel
      .findOne(userId)
      .populate('friendRequests', '', this.userModel)
      .populate('friends', '', this.userModel)
      .exec();
  }

  async findAll(): Promise<User[]> {
    return this.userModel
      .find()
      .populate('friendRequests', '', this.userModel)
      .exec();
  }

  async searchUsers(
    { _name, _surname, _login, _query }: SearchUserDto,
    _limit: number,
    _page: number,
  ): Promise<User[]> {
    const capitalize = (word: string) => {
      return word.charAt(0).toUpperCase() + word.slice(1);
    };

    if (_name && _surname && !_login) {
      if (_limit > 0 && _page == 1) {
        return this.userModel
          .find({
            name: {
              $regex: capitalize(_name),
            },
            surname: {
              $regex: capitalize(_surname),
            },
          })
          .limit(_limit);
      } else if (_limit > 0 && _page > 1) {
        return this.userModel
          .find({
            name: {
              $regex: capitalize(_name),
            },
            surname: {
              $regex: capitalize(_surname),
            },
          })
          .skip(_limit * (_page - 1))
          .limit(_limit);
      } else
        return this.userModel.find({
          name: {
            $regex: capitalize(_name),
          },
          surname: {
            $regex: capitalize(_surname),
          },
        });
    } else if (_query && !_name && !_surname && !_login) {
      if (_limit > 0 && _page == 1) {
        return this.userModel
          .find({
            $or: [
              {
                name: {
                  $regex: capitalize(_query),
                },
              },
              {
                surname: {
                  $regex: capitalize(_query),
                },
              },
              {
                login: {
                  $regex: _query.toLowerCase(),
                },
              },
            ],
          })
          .limit(_limit);
      } else if (_limit > 0 && _page > 1) {
        return this.userModel
          .find({
            $or: [
              {
                name: {
                  $regex: capitalize(_query),
                },
              },
              {
                surname: {
                  $regex: capitalize(_query),
                },
              },
              {
                login: {
                  $regex: _query.toLowerCase(),
                },
              },
            ],
          })
          .skip(_limit * (_page - 1))
          .limit(_limit);
      }
    }
  }

  async create(user: User): Promise<User> {
    const newUser = new this.userModel(user);

    return await newUser.save();
  }

  async findOneBy(cond: LoginUserDto): Promise<User> {
    return this.userModel.findOne(cond);
  }

  async changeUserData(
    userId: string,
    { name, surname, birthDate }: ChangeUserDataDto,
  ): Promise<ChangeUserDataDto> {
    await this.userModel
      .findOneAndUpdate(
        { userId },
        {
          $set: {
            name,
            surname,
            birthDate,
          },
        },
      )
      .exec();

    return { name, surname, birthDate };
  }

  async addFriendRequests(userId: string, requestFriendId: string) {
    const users = await this.userModel
      .find()
      .populate('friendRequests', '', this.userModel)
      .populate('friends', '', this.userModel)
      .exec();

    const user = await users.find((user) => user.userId === userId);

    const requestFriendObjectId = await users.find(
      (user) => user.userId === requestFriendId,
    )._id;

    if (user.friends.find((user) => user.userId === requestFriendId)) {
      return new ForbiddenException('Already in friends');
    } else if (userId === requestFriendId) {
      return new ForbiddenException('Access denied');
    } else if (
      !user.friendRequests.find((friend) => friend.userId === requestFriendId)
    ) {
      return this.userModel.updateOne(
        { userId },
        {
          $push: {
            friendRequests: requestFriendObjectId,
          },
        },
      );
    } else {
      return new ForbiddenException('Duplicate error');
    }
  }

  async getFriendRequests(userId: string): Promise<User[]> {
    const user = await this.userModel
      .findOne({ userId })
      .populate('friendRequests', '', this.userModel)
      .exec();

    return user.friendRequests;
  }

  async getFriends(userId: string): Promise<User[]> {
    const user = await this.userModel
      .findOne({ userId })
      .populate('friends', '', this.userModel)
      .exec();

    return user.friends;
  }

  async confirmFriendRequest(
    userId: string,
    id: string,
    requestFriendId: string,
  ) {
    if (userId === id) {
      const requestFriend = await this.userModel.findOne({
        userId: requestFriendId,
      });

      const user = await this.userModel.findOne({ userId });

      await this.userModel.findOneAndUpdate(
        { userId },
        {
          $push: {
            friends: requestFriend._id,
          },
        },
      );

      await this.userModel.findOneAndUpdate(
        { userId: requestFriendId },
        {
          $push: {
            friends: user._id,
          },
        },
      );

      return this.userModel.updateOne(
        { userId },
        {
          $pull: {
            friendRequests: requestFriend._id,
          },
        },
      );
    }
    return new ForbiddenException('Access denied');
  }

  async cancelFriendRequest(requestFriendId, id, userId) {
    if (userId === id) {
      const { _id } = await this.userModel.findOne({
        userId,
      });

      const { friendRequests }: { friendRequests: Types.ObjectId[] } =
        await this.userModel.findOne({ userId: requestFriendId });

      if (friendRequests.find((_id) => _id.equals(_id))) {
        await this.userModel.findOneAndUpdate(
          { userId: requestFriendId },
          {
            $pull: {
              friendRequests: _id,
            },
          },
        );
      }
      return new ForbiddenException('Access denied');
    } else {
      const { _id } = await this.userModel.findOne({
        userId,
      });

      const { friendRequests }: { friendRequests: Types.ObjectId[] } =
        await this.userModel.findOne({ userId: id });

      if (friendRequests.find((_id) => _id.equals(_id))) {
        await this.userModel.findOneAndUpdate(
          { userId: id },
          {
            $pull: {
              friendRequests: _id,
            },
          },
        );
      }
      return new ForbiddenException('Access denied');
    }
  }

  async deleteFriend(userId: string, friendId: string): Promise<User> {
    const friend = await this.userModel.findOne({ userId: friendId });

    const user = await this.userModel.findOne({ userId });

    await this.userModel.findOneAndUpdate(
      { userId: friendId },
      {
        $pull: {
          friends: user._id,
        },
      },
    );

    return this.userModel.findOneAndUpdate(
      { userId },
      {
        $pull: {
          friends: friend._id,
        },
      },
    );
  }

  async updateAvatar(userId: string, avatarUrl: string): Promise<User> {
    return this.userModel.findOneAndUpdate(
      { userId },
      {
        $set: {
          avatarUrl: avatarUrl,
        },
      },
    );
  }
}
