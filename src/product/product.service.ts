import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ProductModel } from './product.model/product.model';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel('Product') private productModel: Model<ProductModel>,
  ) {}
}
