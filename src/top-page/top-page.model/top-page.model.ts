import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export enum TopLevelCategory {
  Courses = 'courses',
  Services = 'services',
  Books = 'books',
  Products = 'products',
}

export type TopPageDocument = HydratedDocument<TopPageModel>;

export class HhData {
  @Prop()
  count: number;
  @Prop()
  juniorSalary: number;
  @Prop()
  middleSalary: number;
  @Prop()
  seniorSalary: number;
}

export class TopPageAdvantage {
  title: string;
  description: string;
}

@Schema({ timestamps: true })
export class TopPageModel {
  @Prop({ enum: TopLevelCategory })
  firstCategory: TopLevelCategory;

  @Prop()
  secondCategory: string;

  @Prop({ unique: true })
  alias: string;

  @Prop()
  title: string;

  @Prop()
  category: string;

  @Prop({ type: () => [HhData] })
  hh?: HhData;

  @Prop({ type: () => [TopPageAdvantage] })
  advantages: TopPageAdvantage[];

  @Prop()
  seoText: string;

  @Prop()
  tagsTitle: string;

  @Prop()
  tags: string[];
}

export const TopPageSchema = SchemaFactory.createForClass(TopPageModel);
