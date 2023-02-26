import { CreateUserDto } from '@user/dto/create-user.dto';
import { UserService } from '@user/user.service';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@user/schemas/user.schema';
import mongoose from 'mongoose';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async getMe(_id: string) {
    await this.userService.findById(_id);
  }

  async validateUser(login: string, password: string): Promise<User> {
    const user = await this.userService.findByCond({
      login,
      password,
    });

    if (user && user.password === password) {
      const { ...result } = user;

      return result;
    }
    return null;
  }

  generateJwtToken(userData: any) {
    const payload = {
      login: userData._doc.login,
      userId: userData._doc.userId,
    };

    return this.jwtService.sign(payload);
  }

  async login(user) {
    const { ...userData } = user;

    return {
      ...userData._doc,
      token: this.generateJwtToken(userData),
    };
  }

  async register(dto: CreateUserDto) {
    try {
      const users = await this.userService.findAll();

      const { ...userData }: any =
        !users.some((user) => user.login === dto.login) &&
        (await this.userService.create({
          _id: new mongoose.Types.ObjectId(),
          login: dto.login,
          password: dto.password,
          name: dto.name,
          surname: dto.surname,
          birthDate: dto.birthDate,
        }));

      return {
        id: userData._doc.userId,
        login: userData._doc.login,
        token: this.generateJwtToken(userData),
      };
    } catch (err) {
      console.log(err);

      throw new ForbiddenException('Логин занят');
    }
  }
}
