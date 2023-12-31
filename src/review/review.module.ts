import { Module } from '@nestjs/common';
import { ReviewController } from './review.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ReviewModel, ReviewSchema } from './review.model/review.model';
import { ReviewService } from './review.service';
import { IsValidMongoIdConstraint } from '../utils/isValidMongoId';
import { TelegramModule } from '../telegram/telegram.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ReviewModel.name, schema: ReviewSchema },
    ]),
    TelegramModule,
  ],
  controllers: [ReviewController],
  providers: [ReviewService, IsValidMongoIdConstraint],
})
export class ReviewModule {}
