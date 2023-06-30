import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { UserDocument, UserModel } from './auth.model/user.model';
import { Model } from 'mongoose';
import { AuthDto } from './dto/auth.dto';
import { USER_NOT_FOUND_ERROR, WRONG_PASSWORD_ERROR } from './auth.constants';
import { hash, compare } from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel('User') private userModel: Model<UserDocument>,
    private readonly jwtService: JwtService,
  ) {}
  async register({ email, password }: AuthDto): Promise<UserDocument> {
    const passwordHash = await hash(password, 10);

    return this.userModel.create({ email, passwordHash });
  }

  async findUser(email: string) {
    return this.userModel.findOne({ email });
  }

  async validateUser({
    email,
    password,
  }: AuthDto): Promise<Pick<UserDocument, 'email'>> {
    const user = await this.userModel.findOne({ email });

    if (!user) {
      throw new UnauthorizedException(USER_NOT_FOUND_ERROR);
    }

    const isCorrectPassword = await compare(password, user.passwordHash);

    if (!isCorrectPassword) {
      throw new UnauthorizedException(WRONG_PASSWORD_ERROR);
    }

    return { email: user.email };
  }

  async getAccessToken(email: string) {
    const payload = { email };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
