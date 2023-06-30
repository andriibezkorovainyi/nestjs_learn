import {
  Controller,
  Post,
  HttpCode,
  Body,
  Get,
  Param,
  Inject,
  BadRequestException,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthDto } from './dto/auth.dto';
import { AuthService } from './auth.service';
import { ALREADY_REGISTERED_ERROR } from './auth.constants';

@Controller('auth')
export class AuthController {
  @Inject()
  private readonly authService: AuthService;

  @UsePipes(new ValidationPipe())
  @Post('register')
  async register(@Body() dto: AuthDto) {
    const isUserExist = await this.authService.findUser(dto.email);

    if (isUserExist) {
      throw new BadRequestException(ALREADY_REGISTERED_ERROR);
    }

    return this.authService.register(dto);
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Post('login')
  async login(@Body() dto: AuthDto) {
    const { email } = await this.authService.validateUser(dto);

    return this.authService.getAccessToken(email);
  }
}
