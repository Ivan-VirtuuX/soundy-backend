import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { ChangeUserDataDto } from './dto/change-userdata.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { UserRepository } from './user.repository';
import { User } from './schemas/user.schema';
import { v4 as uuidv4 } from 'uuid';
import mongoose from 'mongoose';
import { SearchUserDto } from '@user/dto/search-user.dto';

@Injectable()
export class UserService {
  constructor(private readonly repository: UserRepository) {}

  async create(dto: CreateUserDto): Promise<User> {
    return await this.repository.create({
      _id: new mongoose.Types.ObjectId(),
      userId: uuidv4(),
      avatarUrl: '',
      login: dto.login,
      password: dto.password,
      name: dto.name,
      surname: dto.surname,
      birthDate: dto.birthDate,
      friends: [],
      friendRequests: [],
      createdAt: new Date(),
    });
  }

  async findAll(): Promise<User[]> {
    return await this.repository.findAll();
  }

  async searchUsers(dto: SearchUserDto, _limit: number, _page: number) {
    return await this.repository.searchUsers(dto, _limit, _page);
  }

  async findById(_id: string): Promise<User> {
    return await this.repository.findOne(_id);
  }

  async findByCond(cond: LoginUserDto): Promise<User> {
    return await this.repository.findOneBy(cond);
  }

  async changeUserData(
    userId: string,
    dto: ChangeUserDataDto,
  ): Promise<ChangeUserDataDto> {
    return await this.repository.changeUserData(userId, dto);
  }

  async addFriendRequests(userId: string, { id }) {
    return await this.repository.addFriendRequests(userId, id);
  }

  async getFriendRequests(userId: string) {
    return await this.repository.getFriendRequests(userId);
  }

  async getFriends(userId: string) {
    return await this.repository.getFriends(userId);
  }

  async confirmFriendRequest(userId: string, { id }, requestFriendId: string) {
    return await this.repository.confirmFriendRequest(
      userId,
      id,
      requestFriendId,
    );
  }

  async cancelFriendRequest(requestFriendId: string, { id }, userId: string) {
    return await this.repository.cancelFriendRequest(
      requestFriendId,
      id,
      userId,
    );
  }

  async deleteFriend(userId: string, friendId: string) {
    return await this.repository.deleteFriend(userId, friendId);
  }

  async updateAvatar(userId: string, avatarUrl: string) {
    return await this.repository.updateAvatar(userId, avatarUrl);
  }
}
