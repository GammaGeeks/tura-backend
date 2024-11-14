import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  createUser(data: Prisma.UserCreateInput) {
    return this.prisma.user.create({
      data: {
        ...data,
        userSetting: {
          create: {
            smsEnabled: true,
            notificationsOn: false,
          },
        },
      },
    });
  }

  getUsers() {
    return this.prisma.user.findMany({
      include: {
        userSetting: true,
      },
    });
  }

  getUserById(id: number) {
    return this.prisma.user.findUnique({
      where: { id },
      include: {
        userSetting: {
          select: {
            smsEnabled: true,
            notificationsOn: true,
            // userId: true,
          },
        },
        // cars: true,
      },
    });
  }

  getUserByUsername(username: string) {
    return this.prisma.user.findUnique({
      where: { username },
      include: {
        userSetting: {
          select: {
            smsEnabled: true,
            notificationsOn: true,
            // userId: true,
          },
        },
        // cars: true,
      },
    });
  }

  getUserByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async updateUserByUsername(username: string, data: Prisma.UserUpdateInput) {
    const findUser = await this.getUserByUsername(username);
    if (!findUser)
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);

    if (data.username) {
      const findUsername = await this.getUserByUsername(
        data.username as string,
      );
      if (findUsername)
        throw new HttpException('Username already exists', HttpStatus.CONFLICT);
    }

    if (data.email) {
      const findEmail = await this.getUserByEmail(data.email as string);
      if (findEmail)
        throw new HttpException('Email already exists', HttpStatus.CONFLICT);
    }

    return this.prisma.user.update({ where: { username }, data });
  }

  async deleteUserByUsername(username: string) {
    const findUser = await this.getUserByUsername(username);
    if (!findUser)
      throw new HttpException('User not found', HttpStatus.BAD_REQUEST);
    const id: number = findUser?.id;
    console.log('ID', id);
    return this.prisma.user.delete({ where: { id } });
  }

  async updateUserSettings(
    username: string,
    data: Prisma.UserSettingUpdateInput,
  ) {
    const findUser = await this.getUserByUsername(username);
    if (!findUser)
      throw new HttpException('User not found', HttpStatus.BAD_REQUEST);
    if (!findUser.userSetting)
      throw new HttpException(
        'User settings not found',
        HttpStatus.BAD_REQUEST,
      );
    const id: number = findUser?.id;
    return this.prisma.userSetting.update({
      where: { userId: id },
      data,
    });
  }
}
