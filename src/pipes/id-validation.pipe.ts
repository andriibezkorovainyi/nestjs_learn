import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import mongoose from 'mongoose';
import { ID_VALIDATION_ERROR } from './id-validation.constants';
import { CreateReviewDto } from '../review/dto/create-review.dto';

@Injectable()
export class IdValidationPipe implements PipeTransform {
  transform(value: string | CreateReviewDto, metadata: ArgumentMetadata) {
    const id = typeof value === 'string' ? value : value.product;

    if (!mongoose.isValidObjectId(id)) {
      throw new BadRequestException(ID_VALIDATION_ERROR);
    }
    return value;
  }
}
