import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ChangeUserDataDto } from '@user/dto/change-userdata.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(':id')
  async getUser(@Param('id') _id: string): Promise<User> {
    return this.userService.findById(_id);
  }

  @Get()
  async getUsers() {
    return this.userService.findAll();
  }

  @Post()
  async createUser(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.userService.create(createUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async changeUserData(
    @Param('id') userId: string,
    @Body() { data }: { data: ChangeUserDataDto },
  ) {
    return this.userService.changeUserData(userId, data);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/avatar')
  async updateAvatar(
    @Request() req,
    @Body() { avatarUrl }: { avatarUrl: string },
  ) {
    return this.userService.updateAvatar(req.user.id, avatarUrl);
  }
}
