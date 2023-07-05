import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Inject,
  Param,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ReviewService } from './review.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { REVIEW_NOT_FOUND } from './review-constants';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { AuthGuard } from '@nestjs/passport';
import { UserEmail } from '../auth/decorators/user-email.decorator';
import { IdValidationPipe } from '../pipes/id-validation.pipe';
import * as assert from 'assert';

@Controller('review')
export class ReviewController {
  @Inject()
  private readonly reviewService: ReviewService;

  @Post('create')
  async create(@Body(IdValidationPipe) dto: CreateReviewDto) {
    return this.reviewService.create(dto);
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
