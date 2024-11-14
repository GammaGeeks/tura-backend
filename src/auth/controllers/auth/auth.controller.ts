/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Controller,
  Body,
  Post,
  Get,
  UseGuards,
  Req,
  Res,
  HttpStatus,
} from '@nestjs/common';
import { Response, Request } from 'express';
import { AuthService } from 'src/auth/services/auth/auth.service';
import { LocalGuard } from 'src/guards/local.guard';
import { JWTAuthGuard } from 'src/guards/jwt.guard';
import { AuthPayloadDto } from 'src/auth/dtos/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

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
