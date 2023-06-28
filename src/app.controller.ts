import { Controller, Get, Res, Req } from '@nestjs/common';
import { AppService } from './app.service';
import { Response, Request } from 'express';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('app')
  getHello(@Res() res: Response, @Req() req: Request): string {
    return this.appService.getHello();
  }
}
