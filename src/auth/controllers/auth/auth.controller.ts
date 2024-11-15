/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Controller,
  Body,
  Post,
  Get,
  UseGuards,
  Req,
  Res,
  UsePipes,
  ValidationPipe,
  HttpException,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { Response, Request } from 'express';
import { AuthService } from 'src/auth/services/auth/auth.service';
import { LocalGuard } from 'src/guards/local.guard';
import { JWTAuthGuard } from 'src/guards/jwt.guard';
import { AuthPayloadDto } from 'src/auth/dtos/auth.dto';
import { CreateUserDto } from 'src/users/dtos/CreateUser.dto';
import { UsersService } from 'src/users/services/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { MailService } from 'src/mail/services/mail/mail.service';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UsersService,
    private jwtService: JwtService,
    private mailService: MailService,
  ) {}

  @Post('login')
  @UseGuards(LocalGuard)
  login(
    // @Body() authPayload: AuthPayloadDto,
    @Res() res: Response,
    @Req() req: Request,
  ) {
    // const user = this.authService.validateUser(authPayload);

    return res.status(HttpStatus.CREATED).json({
      message: 'Login successful',
      token: req.user,
    });
  }

  @Post('signup')
  @UsePipes(ValidationPipe)
  async signup(
    @Body() createUserDto: CreateUserDto,
    @Res() res: Response,
    @Req() req: Request,
  ) {
    const emailExists = await this.userService.getUserByEmail(
      createUserDto.email,
    );

    const usernameExists = await this.userService.getUserByUsername(
      createUserDto.username,
    );

    if (emailExists || usernameExists)
      throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
    const user = await this.authService.createUser(createUserDto);
    const token = this.jwtService.sign(user, {
      secret: process.env.JWT_SECRET,
    });

    await this.mailService.sendVerificationEmail(createUserDto.email, token);

    return res.status(HttpStatus.CREATED).json({
      message: 'SignUp successful',
      data: user,
      token,
    });
  }

  @Get('status')
  @UseGuards(JWTAuthGuard)
  status(@Req() req: Request, @Res() res: Response) {
    console.log('Inside AuthController status method');
    console.log(req.user);
    return res.status(HttpStatus.OK).json({
      message: 'User successfully fetched',
      user: req.user,
    });
  }

  @Get('verify-email')
  async verifyEmail(@Query('token') token: string, @Res() res: Response) {
    if (!token) {
      throw new HttpException(
        'Verification token is required',
        HttpStatus.BAD_REQUEST,
      );
    }

    try {
      // Decode the token to get the email
      const decoded = this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET,
      }) as {
        email: string;
      };

      const user = await this.userService.getUserByEmail(decoded.email);

      if (!user) {
        throw new HttpException(
          'Invalid token or user not found',
          HttpStatus.BAD_REQUEST,
        );
      }

      // Activate the user account
      await this.userService.activateUser(user.username);

      return res.status(HttpStatus.OK).json({
        message: 'Email verified successfully.',
      });
    } catch (err) {
      console.log(err);
      throw new HttpException(
        'Invalid or expired token',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
