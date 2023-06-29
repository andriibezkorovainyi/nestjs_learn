import { HydratedDocument, Schema as MSchema } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ProductModel } from '../../product/product.model/product.model';

export type ReviewDocument = HydratedDocument<ReviewModel>;

@Schema({ timestamps: true })
export class ReviewModel {
  @Prop()
  name: string;

  @Prop()
  title: string;

  @Prop()
  description: string;

  @Prop()
  rating: number;

  @Prop({ type: MSchema.Types.ObjectId, ref: () => ProductModel.name })
  product: ProductModel;
}

export const ReviewSchema = SchemaFactory.createForClass(ReviewModel);
