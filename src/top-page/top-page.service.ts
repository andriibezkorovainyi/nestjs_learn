import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  TopLevelCategory,
  TopPageDocument,
} from './top-page.model/top-page.model';
import { Model } from 'mongoose';
import { CreateTopPageDto } from './dto/create-top-page.dto';
import { FindTopPageDto } from './dto/find-top-page.dto';

@Injectable()
export class TopPageService {
  constructor(
    @InjectModel('TopPageModel')
    private readonly topPageModel: Model<TopPageDocument>,
  ) {}

  async create(dto: CreateTopPageDto): Promise<TopPageDocument> {
    return this.topPageModel.create(dto);
  }

  async getById(id: string): Promise<TopPageDocument | null> {
    return this.topPageModel.findOne({ _id: id }).exec();
  }

  async getByAlias(alias: string): Promise<TopPageDocument | null> {
    return this.topPageModel.findOne({ alias }).exec();
  }

  async getAll(): Promise<TopPageDocument[]> {
    return this.topPageModel.find().exec();
  }

  async delete(id: string): Promise<TopPageDocument | null> {
    return this.topPageModel.findByIdAndDelete(id).exec();
  }

  async update(
    id: string,
    dto: CreateTopPageDto,
  ): Promise<TopPageDocument | null> {
    return this.topPageModel.findByIdAndUpdate(id, dto, { new: true }).exec();
  }

  async getByCategory(firstCategory: TopLevelCategory) {
    return this.topPageModel
      .aggregate()
      .match({
        firstCategory,
      })
      .group({
        _id: { secondCategory: '$secondCategory' },
        pages: { $push: { alias: '$alias', title: '$title' } },
      })
      .exec();
  }

  async textSearch(text: string) {
    return this.topPageModel
      .find({
        $text: {
          $search: text,
          $caseSensitive: false,
        },
      })
      .exec();
  }
}
