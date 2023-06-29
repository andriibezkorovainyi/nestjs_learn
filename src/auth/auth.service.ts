import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { AuthDocument } from './auth.model/auth.model';
import { Model } from 'mongoose';
import { AuthDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(@InjectModel('Auth') private authModel: Model<AuthDocument>) {}

  async login({ email }: AuthDto) {
    return this.authModel.findOne({ email }).exec();
  }

  async register({ email, password }: AuthDto) {
    const newUser = new this.authModel({ email, passwordHash: password });
    return await newUser.save();
  }
}
