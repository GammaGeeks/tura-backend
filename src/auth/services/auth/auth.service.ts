import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthPayloadDto } from 'src/auth/dtos/auth.dto';
import { CreateUserDto } from 'src/users/dtos/CreateUser.dto';
import { UsersService } from 'src/users/services/users/users.service';
import { comparePasswords } from 'src/utils/bcrypt';
import { generateUsername } from 'src/utils/generateUsername';

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

  async googleLogin(user: any) {
    // Find user or create if doesn't exist
    let existingUser = await this.userService.getUserByEmail(user.email);

    if (!existingUser) {
      existingUser = await this.userService.createUser({
        fullname: user.name,
        username: generateUsername(user.name),
        email: user.email,
        gender: user.gender,
        address: user.address,
        dob: user.dob,
        phoneNumber: user.phone,
        profileImg: user.picture,
        coverImg: null,
        password: '',
        role: 'CLIENT',
        isVerified: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...data } = existingUser;

    return {
      token: this.jwtService.sign(data, {
        secret: process.env.JWT_SECRET,
      }),
      data,
    };
  }
}
