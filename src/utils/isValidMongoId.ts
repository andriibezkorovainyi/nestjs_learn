import { Injectable } from '@nestjs/common';
import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
} from 'class-validator';
import mongoose from 'mongoose';

@ValidatorConstraint({ name: 'IsValidMongoId' })
@Injectable()
export class IsValidMongoIdConstraint {
  validate(value: string) {
    return mongoose.isValidObjectId(value);
  }

  defaultMessage() {
    return 'Id is not valid';
  }
}

export function IsValidMongoId(validationOptions?: ValidationOptions) {
  return (object: object, propertyName: string) => {
    registerDecorator({
      name: 'IsValidMongoId',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: IsValidMongoIdConstraint,
    });
  };
}
