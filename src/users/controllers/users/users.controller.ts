import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Param,
  Body,
  UsePipes,
  ValidationPipe,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { UsersService } from 'src/users/services/users/users.service';
import { CreateUserDto } from 'src/users/dtos/CreateUser.dto';
import { UpdateUserDto } from 'src/users/dtos/UpdateUser.dto';
import { UpdateUserSettingsDto } from 'src/users/dtos/UpdateUserSettings.dto';

@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}

  @Post()
  @UsePipes(ValidationPipe)
  async createUser(@Body() createUserDto: CreateUserDto) {
    const emailExists = await this.userService.getUserByEmail(
      createUserDto.email,
    );

    const usernameExists = await this.userService.getUserByUsername(
      createUserDto.username,
    );

    if (emailExists || usernameExists)
      throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);

    return this.userService.createUser({
      ...createUserDto,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  @Get()
  getUsers() {
    return this.userService.getUsers();
  }

  @Get(':username')
  async getUserByUsername(@Param('username') username: string) {
    const user = await this.userService.getUserByUsername(username);
    if (!user) throw new HttpException('User Not Found', HttpStatus.NOT_FOUND);
    return user;
  }

  @Patch(':username')
  updateUserByUsername(
    @Param('username') username: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.userService.updateUserByUsername(username, updateUserDto);
  }

  @Delete(':username')
  deleteUserByUsername(@Param('username') username: string) {
    return this.userService.deleteUserByUsername(username);
  }

  @Patch(':username/settings')
  updateUserSettingsByUserUsername(
    @Param('username') username: string,
    @Body() updateUserSettingsDto: UpdateUserSettingsDto,
  ) {
    return this.userService.updateUserSettings(username, updateUserSettingsDto);
  }
}