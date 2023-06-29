import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ReviewDocument, ReviewModel } from './review.model/review.model';
import { Model, Types } from 'mongoose';
import { CreateReviewDto } from './dto/create-review.dto';

@Injectable()
export class ReviewService {
  constructor(
    @InjectModel('ReviewModel') private reviewModel: Model<ReviewDocument>,
  ) {}

  async create(dto: CreateReviewDto): Promise<ReviewDocument> {
    // const foundReview = await this.reviewModel.findOne({ title: dto.title });
    //
    // if (foundReview) {
    //   throw new HttpException('Error', HttpStatus.CONFLICT);
    // }

    return this.reviewModel.create(dto);
  }

  async delete(id: string): Promise<DocumentType | null> {
    return this.reviewModel.findByIdAndDelete(id);
  }

  async findByProductId(productId: string): Promise<ReviewDocument[]> {
    return this.reviewModel
      .find({ product: new Types.ObjectId(productId) })
      .exec();
  }

  async deleteByProductId(productId: string) {
    return this.reviewModel
      .deleteMany({
        product: new Types.ObjectId(productId),
      })
      .exec();
  }
}
