import { Module } from '@nestjs/common';
import { ProductController } from './product.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductService } from './product.service';
import { ProductSchema } from './product.model/product.model';

@Module({
  controllers: [ProductController],
  imports: [
    MongooseModule.forFeature([{ name: 'Product', schema: ProductSchema }]),
  ],
  providers: [ProductService],
})
export class ProductModule {}
