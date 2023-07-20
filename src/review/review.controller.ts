import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import { ReviewService } from './review.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { REVIEW_NOT_FOUND } from './review-constants';
import { UserEmail } from '../auth/decorators/user-email.decorator';
import { IdValidationPipe } from '../pipes/id-validation.pipe';
import { TelegramService } from '../telegram/telegram.service';

@Controller('review')
export class ReviewController {
  constructor(
    private readonly reviewService: ReviewService,
    private readonly telegramService: TelegramService,
  ) {}

  @Post('create')
  async create(@Body(IdValidationPipe) dto: CreateReviewDto) {
    return this.reviewService.create(dto);
  }

  @Post('notify')
  async notify(@Body() dto: CreateReviewDto) {
    const message =
      `Пользователь оставил отзыв на товар: ${dto.title}\n` +
      `Оценка: ${dto.rating}\n` +
      `Комментарий: ${dto.description}\n` +
      `Имя: ${dto.name}\n`;
    return this.telegramService.sendMessage(message);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    const deletedDoc = this.reviewService.delete(id);

    if (!deletedDoc) {
      throw new HttpException(REVIEW_NOT_FOUND, HttpStatus.NOT_FOUND);
    }
  }

  // @UseGuards(JwtAuthGuard)
  @Get('byProduct/:productId')
  async getByProduct(
    @Param('productId', IdValidationPipe) productId: string,
    @UserEmail() email: string,
  ) {
    console.log(email);
    return this.reviewService.findByProductId(productId);
  }

  @Get('getAll')
  async getAll() {
    return this.reviewService.getAll();
  }
}
