import {
  Controller,
  Post,
  HttpCode,
  Body,
  Get,
  Param,
  Inject,
} from '@nestjs/common';
import { AuthDto } from './dto/auth.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  @Inject()
  private readonly authService: AuthService;

  @Post('register')
  async register(@Body() dto: AuthDto) {
    return 'register';
  }

  @HttpCode(200)
  @Post('login')
  async login(@Body() dto: AuthDto) {
    return 'login';
  }
}
