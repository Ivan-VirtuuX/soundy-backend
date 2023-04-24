import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { ChangeUserDataDto } from './dto/change-userdata.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { UserRepository } from './user.repository';
import { User } from './schemas/user.schema';
import { v4 as uuidv4 } from 'uuid';
import mongoose from 'mongoose';
import { SearchUserDto } from '@user/dto/search-user.dto';
import { MusicTrackDto } from '@user/dto/music-track.dto';

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
      playlist: [],
      createdAt: new Date(),
    });
  }

  async findAll(): Promise<User[]> {
    return await this.repository.findAll();
  }

  async searchUsers(
    dto: SearchUserDto,
    _limit: number,
    _page: number,
  ): Promise<User[]> {
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

  async addFriendRequests(id: string, { userId }) {
    return await this.repository.addFriendRequests(id, userId);
  }

  async getFriendRequests(userId: string): Promise<User[]> {
    return await this.repository.getFriendRequests(userId);
  }

  async getFriends(userId: string): Promise<User[]> {
    return await this.repository.getFriends(userId);
  }

  async confirmFriendRequest(id: string, { userId }, requestFriendId: string) {
    return await this.repository.confirmFriendRequest(
      id,
      userId,
      requestFriendId,
    );
  }

  async toggleMusicTrack(musicTrack: MusicTrackDto, { userId }): Promise<User> {
    return await this.repository.toggleMusicTrack(musicTrack, userId);
  }

  async cancelFriendRequest(requestFriendId: string, { userId }, id: string) {
    return await this.repository.cancelFriendRequest(
      requestFriendId,
      userId,
      id,
    );
  }

  async deleteFriend(userId: string, friendId: string): Promise<User> {
    return await this.repository.deleteFriend(userId, friendId);
  }

  async updateAvatar(userId: string, avatarUrl: string): Promise<User> {
    return await this.repository.updateAvatar(userId, avatarUrl);
  }
}
