import { Controller, Get, HttpStatus } from '@nestjs/common';

@Controller()
export class WelcomeController {
  @Get()
  getWelcome() {
    return {
      message: 'Welcome to TuraAPI backend application',
      statusCode: HttpStatus.OK,
    };
  }
}
