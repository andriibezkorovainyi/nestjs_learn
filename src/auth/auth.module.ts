import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthSchema } from './auth.model/auth.model';
import { AuthService } from './auth.service';

@Module({
  controllers: [AuthController],
  imports: [MongooseModule.forFeature([{ name: 'Auth', schema: AuthSchema }])],
  providers: [AuthService],
})
export class AuthModule {}
