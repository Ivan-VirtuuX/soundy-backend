import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { LoginUserDto } from './dto/login-user.dto';
import { ChangeUserDataDto } from './dto/change-userdata.dto';
import { User, UserDocument } from './schemas/user.schema';

@Injectable()
export class UserRepository {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async findOne(id: string) {
    const users = await this.userModel.find().exec();
    const userId = await users.find((user) => user.userId === id)?._id;

    return this.userModel.findOne(userId);
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find();
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

  async updateAvatar(userId: string, avatarUrl: string) {
    return this.userModel.findOneAndUpdate(
      { userId: userId },
      {
        $set: {
          avatarUrl: avatarUrl,
        },
      },
    );
  }
}
