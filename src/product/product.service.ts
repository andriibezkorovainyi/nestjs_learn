import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ProductDocument, ProductModel } from './product.model/product.model';
import { CreateProductDto } from './dto/create-product.dto';
import { FindProductDto } from './dto/find-product.dto';
import { ReviewModel } from '../review/review.model/review.model';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel('Product') private productModel: Model<ProductModel>,
  ) {}

  async create(dto: CreateProductDto): Promise<ProductDocument> {
    return this.productModel.create(dto);
  }

  async findById(id: string): Promise<ProductDocument | null> {
    return this.productModel.findById(id).exec();
  }

  async deleteById(id: string): Promise<ProductDocument | null> {
    return this.productModel.findByIdAndDelete(id).exec();
  }

  async updateById(
    id: string,
    dto: CreateProductDto,
  ): Promise<ProductDocument | null> {
    return this.productModel.findByIdAndUpdate(id, dto, { new: true }).exec();
  }

  async findWithReviews(dto: FindProductDto): Promise<
    (ProductModel & {
      review: ReviewModel[];
      reviewCount: number;
      reviewAvg: number;
    })[]
  > {
    return (await this.productModel
      .aggregate([
        {
          $match: {
            categories: dto.category,
          },
        },
        {
          $sort: {
            _id: 1,
          },
        },
        {
          $limit: dto.limit,
        },
        {
          $lookup: {
            from: 'reviewmodels',
            localField: '_id',
            foreignField: 'product',
            as: 'reviews',
          },
        },
        {
          $addFields: {
            reviewCount: { $size: '$reviews' },
            reviewAvg: { $avg: '$reviews.rating' },
          },
        },
      ])
      .exec()) as (ProductModel & {
      review: ReviewModel[];
      reviewCount: number;
      reviewAvg: number;
    })[];
  }
}
