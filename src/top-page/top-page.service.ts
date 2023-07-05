import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { TopPageDocument } from './top-page.model/top-page.model';
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
    return this.topPageModel.findOne({ id }).exec();
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

  async find(dto: FindTopPageDto): Promise<TopPageDocument | null> {
    return this.topPageModel.findOne(dto);
  }
}
