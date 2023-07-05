import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Inject,
  NotFoundException,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { TopPageModel } from './top-page.model/top-page.model';
import { FindTopPageDto } from './dto/find-top-page.dto';
import { CreateTopPageDto } from './dto/create-top-page.dto';
import { TopPageService } from './top-page.service';
import { IdValidationPipe } from '../pipes/id-validation.pipe';
import { TOP_PAGE_NOT_FOUND } from './top-page.constants';

@Controller('top-page')
export class TopPageController {
  constructor(private readonly topPageService: TopPageService) {}

  @Post('create')
  async create(@Body() dto: CreateTopPageDto) {
    return this.topPageService.create(dto);
  }

  @Get(':id')
  async get(@Param('id', IdValidationPipe) id: string) {
    const page = await this.topPageService.getById(id);

    if (!page) {
      throw new NotFoundException(TOP_PAGE_NOT_FOUND);
    }

    return page;
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    const deletedPage = await this.topPageService.delete(id);

    if (!deletedPage) {
      throw new NotFoundException(TOP_PAGE_NOT_FOUND);
    }
  }

  @Patch(':id')
  async patch(@Param('id') id: string, @Body() dto: CreateTopPageDto) {
    const updatedPage = await this.topPageService.update(id, dto);

    if (!updatedPage) {
      throw new NotFoundException(TOP_PAGE_NOT_FOUND);
    }

    return updatedPage;
  }

  @Post()
  @HttpCode(200)
  async find(@Body() dto: FindTopPageDto) {
    return this.topPageService.find(dto);
  }
}
