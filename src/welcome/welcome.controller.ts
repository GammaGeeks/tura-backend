import { Controller, Get, HttpStatus } from '@nestjs/common';

@Controller('welcome')
export class WelcomeController {
  @Get()
  getWelcome() {
    return {
      message: 'Welcome to the application!',
      statusCode: HttpStatus.OK,
    };
  }
}