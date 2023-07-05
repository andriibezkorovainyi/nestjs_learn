import { IsNumber, IsString, Max, Min } from 'class-validator';
import { IsValidMongoId } from '../../utils/isValidMongoId';

export class CreateReviewDto {
  @IsString()
  name: string;

  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsNumber()
  @Max(5)
  @Min(1)
  rating: number;

  @IsString()
  @IsValidMongoId()
  product: string;
}
