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
} from '@nestjs/common';
import { Response, Request } from 'express';
import { AuthService } from 'src/auth/services/auth/auth.service';
import { LocalGuard } from 'src/guards/local.guard';
import { JWTAuthGuard } from 'src/guards/jwt.guard';
import { AuthPayloadDto } from 'src/auth/dtos/auth.dto';
import { CreateUserDto } from 'src/users/dtos/CreateUser.dto';
import { UsersService } from 'src/users/services/users/users.service';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UsersService,
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

    return res.status(HttpStatus.CREATED).json({
      message: 'SignUp successful',
      data: user,
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
}
