import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { encodePassword } from 'src/utils/bcrypt';
import { S3Service } from 'src/s3/services/s3.service';

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private s3Service: S3Service,
  ) {}

  async createUser(data: Prisma.UserCreateInput) {
    return this.prisma.user.create({
      data: {
        ...data,
        password: await encodePassword(data.password),
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
    return this.prisma.user.delete({ where: { username } });
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

  activateUser(username: string) {
    return this.prisma.user.update({
      where: { username },
      data: { isVerified: true },
    });
  }

  async uploadProfilePicture(
    file: Express.Multer.File,
    username: string,
  ): Promise<string> {
    const folder = `users/${username}`;
    const key = await this.s3Service.uploadFile(file, folder);

    const url = await this.s3Service.generateSignedUrl(key);

    await this.prisma.user.update({
      where: { username },
      data: { profileImg: url },
    });

    return url;
  }
}
