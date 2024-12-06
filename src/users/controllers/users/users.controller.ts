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
  UseGuards,
  HttpCode,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UsersService } from 'src/users/services/users/users.service';
import { CreateUserDto } from 'src/users/dtos/CreateUser.dto';
import { UpdateUserDto } from 'src/users/dtos/UpdateUser.dto';
import { UpdateUserSettingsDto } from 'src/users/dtos/UpdateUserSettings.dto';
import { JWTAuthGuard } from 'src/guards/jwt.guard';

@Controller('users')
@UseGuards(JWTAuthGuard)
export class UsersController {
  constructor(private userService: UsersService) {}

  @Post()
  @UsePipes(ValidationPipe)
  @HttpCode(HttpStatus.CREATED)
  async createUser(@Body() createUserDto: CreateUserDto) {
    const emailExists = await this.userService.getUserByEmail(
      createUserDto.email,
    );

    const usernameExists = await this.userService.getUserByUsername(
      createUserDto.username,
    );

    if (emailExists || usernameExists)
      throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);

    const user = await this.userService.createUser({
      ...createUserDto,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return {
      message: 'User successfully created',
      data: user,
    };
  }

  @Get()
  async getUsers() {
    const users = await this.userService.getUsers();
    return {
      message: 'Users successfully fetched',
      data: users,
    };
  }

  @Get(':username')
  async getUserByUsername(@Param('username') username: string) {
    const user = await this.userService.getUserByUsername(username);
    if (!user) throw new HttpException('User Not Found', HttpStatus.NOT_FOUND);
    return {
      message: 'User successfully fetched',
      data: user,
    };
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

  @Post(':username/upload')
  @UseInterceptors(
    FileInterceptor('file', {
      limits: { fileSize: 5 * 1024 * 1024 }, // Limit to 5MB
    }),
  )
  async uploadProfileImg(
    @Param('username') username: string,
    @UploadedFile() file: Express.Multer.File, // Correctly receive the file
  ) {
    if (!file) {
      throw new BadRequestException('No file provided.');
    }

    return {
      message: 'Image successfully uploaded',
      data: await this.userService.uploadProfilePicture(file, username),
    };
  }
}
