import { Module } from '@nestjs/common';
import { ProductController } from './product.controller';
// import { MongooseModule } from '@nestjs/mongoose';

@Module({
  controllers: [ProductController],
  imports: [
    // MongooseModule.forFeature([{ name: 'Product', schema: ProductSchema }]),
  ],
})
export class ProductModule {}
