import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { AuthDocument } from './auth.model/auth.model';
import { Model } from 'mongoose';

@Injectable()
export class AuthService {
  constructor(@InjectModel('Auth') private authModel: Model<AuthDocument>) {}

  async findUser(email: string) {
    return this.authModel.findOne({ email }).exec();
  }

  async createUser(email: string, password: string) {
    const newUser = new this.authModel({ email, passwordHash: password });
    return await newUser.save();
  }
}
