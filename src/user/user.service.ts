import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { ChangeUserDataDto } from './dto/change-userdata.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { UserRepository } from './user.repository';
import { User } from './schemas/user.schema';
import { v4 as uuidv4 } from 'uuid';
import mongoose from 'mongoose';

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
      createdAt: new Date(),
    });
  }

  async findAll(): Promise<User[]> {
    return await this.repository.findAll();
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

  async updateAvatar(userId: string, avatarUrl: string) {
    return await this.repository.updateAvatar(userId, avatarUrl);
  }
}
