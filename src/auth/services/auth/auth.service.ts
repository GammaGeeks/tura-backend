import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthPayloadDto } from 'src/auth/dtos/auth.dto';
import { CreateUserDto } from 'src/users/dtos/CreateUser.dto';
import { UsersService } from 'src/users/services/users/users.service';
import { comparePasswords } from 'src/utils/bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private userService: UsersService,
  ) {}

  async validateUser({ username, password }: AuthPayloadDto) {
    const findUser = await this.userService.getUserByUsername(username);
    if (!findUser) return null;

    const matched = comparePasswords(password, findUser.password);

    if (matched) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...user } = findUser;
      const token = this.jwtService.sign(user, {
        secret: process.env.JWT_SECRET,
      });
      return {
        token,
        data: user,
      };
    }
  }

  async createUser(data: CreateUserDto) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...user } = await this.userService.createUser({
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return user;
  }
}
