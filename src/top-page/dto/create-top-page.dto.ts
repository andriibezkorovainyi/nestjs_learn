import { TopLevelCategory } from '../top-page.model/top-page.model';
import {
  IsArray,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

export class HhDataDto {
  @IsNumber()
  count: number;
  @IsNumber()
  juniorSalary: number;
  @IsNumber()
  middleSalary: number;
  @IsNumber()
  seniorSalary: number;
}

export class TopPageAdvantageDto {
  @IsString()
  title: string;
  @IsString()
  description: string;
}

export class CreateTopPageDto {
  @IsEnum(TopLevelCategory)
  firstCategory: TopLevelCategory;

  @IsString()
  secondCategory: string;

  @IsString()
  alias: string;

  @IsString()
  title: string;

  @IsString()
  category: string;

  @IsOptional()
  @ValidateNested()
  hh?: HhDataDto;

  @ValidateNested()
  advantages: TopPageAdvantageDto[];

  @IsString()
  seoText: string;

  @IsString()
  tagsTitle: string;

  @IsArray()
  @IsString({ each: true })
  tags: string[];
}
