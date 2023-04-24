import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ChangeUserDataDto } from '@user/dto/change-userdata.dto';
import { MusicTrackDto } from '@user/dto/music-track.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/search')
  async searchUsers(
    @Query() { _name, _surname, _login, _query, _limit, _page },
  ): Promise<User[]> {
    return this.userService.searchUsers(
      { _name, _surname, _login, _query },
      _limit,
      _page,
    );
  }

  @Get(':id')
  async getUser(@Param('id') _id: string): Promise<User> {
    return this.userService.findById(_id);
  }

  @Get()
  async getUsers(): Promise<User[]> {
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
  @Post(':id/friend-requests')
  async addFriendRequests(@Param('id') userId: string, @Request() req) {
    return this.userService.addFriendRequests(userId, req.user);
  }

  @Get(':id/friend-requests')
  async getFriendRequests(@Param('id') userId: string): Promise<User[]> {
    return this.userService.getFriendRequests(userId);
  }

  @Get(':id/friends')
  async getFriends(@Param('id') userId: string): Promise<User[]> {
    return this.userService.getFriends(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/friend-requests')
  async confirmFriendRequest(
    @Param('id') userId: string,
    @Request() req,
    @Body() { requestFriendId }: { requestFriendId: string },
  ) {
    return this.userService.confirmFriendRequest(
      userId,
      req.user,
      requestFriendId,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/playlist')
  async toggleMusicTrack(
    @Request() req,
    @Body()
    {
      data,
    }: {
      data: {
        musicTrack: MusicTrackDto;
      };
    },
  ) {
    return this.userService.toggleMusicTrack(data.musicTrack, req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id/friend-requests')
  async cancelFriendRequest(
    @Param('id') requestFriendId: string,
    @Request() req,
    @Body() { userId }: { userId: string },
  ) {
    return this.userService.cancelFriendRequest(
      requestFriendId,
      req.user,
      userId,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id/friends')
  async deleteFriend(
    @Param('id') userId: string,
    @Body() { friendId }: { friendId: string },
  ) {
    return this.userService.deleteFriend(userId, friendId);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/avatar')
  async updateAvatar(
    @Request() req,
    @Body() { avatarUrl }: { avatarUrl: string },
  ) {
    return this.userService.updateAvatar(req.user.userId, avatarUrl);
  }
}
